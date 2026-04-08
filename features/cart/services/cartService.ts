import apiClient from "@/lib/apiClient";

export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
};

export async function fetchCart() {
  return apiClient<unknown>({
    route: "/cart",
    tokenRequire: true,
  });
}

export async function postAddToCart(payload: { product_id: number; quantity: number; size_id?: number | null }) {
  const bodyPayload: { product_id: number; quantity: number; size_id?: number } = {
    product_id: payload.product_id,
    quantity: payload.quantity,
  };
  if (typeof payload.size_id === "number") {
    bodyPayload.size_id = payload.size_id;
  }

  return apiClient<{ message?: string }>({
    route: "/cart/add",
    method: "POST",
    body: JSON.stringify(bodyPayload),
    tokenRequire: true,
  });
}

export async function postUpdateCart(payload: { cart_item_id: number; quantity: number }) {
  return apiClient<{ message?: string; data?: any }>({
    route: "/cart/update",
    method: "POST",
    body: JSON.stringify({ ...payload, _method: "PUT" }),
    tokenRequire: true,
  });
}

export async function postApplyCoupon(code: string) {
  return apiClient<{ message?: string; data?: any }>({
    route: "/cart/apply-coupon",
    method: "POST",
    body: JSON.stringify({ code }),
    tokenRequire: true,
  });
}
