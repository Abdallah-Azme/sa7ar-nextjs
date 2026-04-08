import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchCart, cartKeys } from "@/features/cart/services/cartService";
import CartPageContent from "@/features/cart/components/CartPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.cart" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);

    const queryClient = makeQueryClient();
    
    // We only prefetch if we have a session (token in cookies)
    // fetchCart handles token check internally via apiClient
    await queryClient.prefetchQuery({
        queryKey: cartKeys.all,
        queryFn: fetchCart,
    });

	return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CartPageContent />
        </HydrationBoundary>
    );
}
