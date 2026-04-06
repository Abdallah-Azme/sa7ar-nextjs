import { getOrderHistory } from "@/features/orders/queries";
import OrderHistoryView from "@/features/orders/components/OrderHistoryView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History | Sohar Water",
  description: "View and track your previous water orders and delivery status.",
};

/**
 * Order History Page - RSC (Server Component)
 * Dynamically fetches authenticated user orders for secure display.
 */
export default async function OrdersPage() {
  const orders = await getOrderHistory();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      <section className="container py-12 flex-grow">
        <OrderHistoryView orders={orders || []} />
      </section>
    </div>
  );
}
