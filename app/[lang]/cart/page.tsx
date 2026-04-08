import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchCart, cartKeys } from "@/features/cart/services/cartService";
import CartPageContent from "@/features/cart/components/CartPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
	title: "سلة المشتريات | مياه صحار",
	description: "راجع مشترياتك وقم بتطبيق كوبونات الخصم قبل إتمام الطلب.",
};

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
