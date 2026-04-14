import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { orderKeys, fetchOrderHistory } from "@/features/orders/services/orderService";
import OrdersPageContent from "@/features/orders/components/OrdersPageContent";
import type { Metadata } from "next";
import { generateAlternateMetadata } from "@/lib/seo";

import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Order History | Sohar Water",
  description: "View and track your previous water orders and delivery status.",
  ...generateAlternateMetadata("/account/orders"),
};

export default async function OrdersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: orderKeys.list(),
    queryFn: fetchOrderHistory,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      <section className="container py-12 grow">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <OrdersPageContent />
        </HydrationBoundary>
      </section>
    </div>
  );
}

