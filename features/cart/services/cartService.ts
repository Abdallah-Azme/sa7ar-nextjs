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
  return apiClient({
    route: "/cart/add",
    method: "POST",
    body: JSON.stringify(payload),
    tokenRequire: true,
  });
}

export async function postUpdateCart(payload: { cart_item_id: number; quantity: number }) {
  return apiClient({
    route: "/cart/update",
    method: "POST",
    body: JSON.stringify({ ...payload, _method: "PUT" }),
    tokenRequire: true,
  });
}

export async function postApplyCoupon(code: string) {
  return apiClient({
    route: "/cart/apply-coupon",
    method: "POST",
    body: JSON.stringify({ code }),
    tokenRequire: true,
  });
}
