import { notFound, redirect } from "next/navigation";
import { getOrderDetails } from "@/features/orders/queries";
import OrderDetailsView from "@/features/orders/components/OrderDetailsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details | Sohar Water",
};

/**
 * Account Tracking Page - RSC (Server Component)
 * Dynamically fetches order detail and tracking history
 */
export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) return redirect("/account/orders");

    const order = await getOrderDetails(id);
    if (!order) return notFound();

    // Replicate buildGoogleMapEmbedUrl logic inline
    const orderMapQuery = [
		order.address_label,
		order.address_details,
		order.address?.city,
	].filter(Boolean).join(", ");
    
    // NOTE: In production, substitute API_KEY with a valid Google Maps Embed API key via process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_API_KEY&q=${encodeURIComponent(orderMapQuery)}&zoom=11`;

    return (
        <OrderDetailsView order={order} mapSrc={mapSrc} />
    );
}
