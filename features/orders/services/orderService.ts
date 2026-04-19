import apiClient from "@/lib/apiClient";

import type { Order, OrderDetails } from "../types";

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export async function fetchOrderHistory() {
  const res = await apiClient<{
    data: Order[] | { orders?: Order[] };
  }>({
    route: "/orders/my-orders",
    tokenRequire: true,
  });
  const d = res.data;
  if (Array.isArray(d)) return d;
  return d?.orders ?? [];
}

export async function fetchOrderDetail(id: string) {
  const res = await apiClient<{ data: OrderDetails }>({
    route: `/orders/${id}`,
    tokenRequire: true,
  });
  return res.data;
}
