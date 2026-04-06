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
    
    // Use Google Maps Embed if API key is configured, otherwise fall back to free OpenStreetMap embed
    const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const mapSrc = googleKey
        ? `https://www.google.com/maps/embed/v1/place?key=${googleKey}&q=${encodeURIComponent(orderMapQuery)}&zoom=11`
        : `https://maps.google.com/maps?q=${encodeURIComponent(orderMapQuery)}&z=11&output=embed`;

    return (
        <OrderDetailsView order={order} mapSrc={mapSrc} />
    );
}
