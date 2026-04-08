import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchCart, cartKeys } from "@/features/cart/services/cartService";
import { fetchAddresses, addressKeys } from "@/features/addresses/services/addressService";
import CheckoutPageContent from "@/features/checkout/components/CheckoutPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.checkout" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);

    const queryClient = makeQueryClient();
    
    // Parallel prefetching for cart and addresses
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: cartKeys.all,
            queryFn: fetchCart,
        }),
        queryClient.prefetchQuery({
            queryKey: addressKeys.list(),
            queryFn: fetchAddresses,
        })
    ]);

	return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CheckoutPageContent />
        </HydrationBoundary>
    );
}


