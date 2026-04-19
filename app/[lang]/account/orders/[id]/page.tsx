import { notFound, redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchOrderDetail, orderKeys } from "@/features/orders/services/orderService";
import OrderDetailsView from "@/features/orders/components/OrderDetailsView";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateAlternateMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Order Details | Sohar Water",
    ...generateAlternateMetadata(`/account/orders/${id}`),
  };
}

/**
 * Account Tracking Page - RSC (Server Component)
 * Dynamically fetches order detail and tracking history
 */
export default async function OrderDetailsPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = await params;
    setRequestLocale(lang);

    if (!id) return redirect("/account/orders");

    const queryClient = makeQueryClient();
    
    // We use fetchQuery here so we can check for 404/Null before rendering
    const order = await queryClient.fetchQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => fetchOrderDetail(id),
    });


     if (!order) return notFound();

    // Replicate buildGoogleMapEmbedUrl logic inline
    const orderMapQuery = [
		order.address_label,
		order.address_details,
		order.address?.city,
	].filter(Boolean).join(", ");
    
    // Use Google Maps Embed if API key is configured, otherwise fall back to free OpenStreetMap embed
    const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const mapSrc = googleKey
        ? `https://www.google.com/maps/embed/v1/place?key=${googleKey}&q=${encodeURIComponent(orderMapQuery)}&zoom=11`
        : `https://maps.google.com/maps?q=${encodeURIComponent(orderMapQuery)}&z=11&output=embed`;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <OrderDetailsView order={order} mapSrc={mapSrc} />
        </HydrationBoundary>
    );
}
