import apiClient from "@/lib/apiClient";

import type { Order, OrderDetails } from "../types";

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export async function fetchOrderHistory() {
  const res = await apiClient<{ data: Order[] }>({
    route: "/orders",
    tokenRequire: true,
  });
  return res.data;
}

export async function fetchOrderDetail(id: string) {
  const res = await apiClient<{ data: OrderDetails }>({
    route: `/orders/${id}`,
    tokenRequire: true,
  });
  return res.data;
}
