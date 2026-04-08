"use client";

import { useQuery } from "@tanstack/react-query";
import { orderKeys, fetchOrderHistory } from "../services/orderService";
import OrderHistoryView from "./OrderHistoryView";
import type { Order } from "../types";
import { useTranslations } from "next-intl";



export default function OrdersPageContent() {
  const tCommon = useTranslations("common");
  const { data: ordersData, isLoading } = useQuery({
    queryKey: orderKeys.list(),
    queryFn: fetchOrderHistory,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">{tCommon("loading")}</div>;

  const orders = (ordersData as unknown as { data: Order[] })?.data || [];
  return <OrderHistoryView orders={orders} />;
}
