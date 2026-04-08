import apiClient from "@/lib/apiClient";
import type { Address } from "../types";

export const addressKeys = {
  all: ["addresses"] as const,
  list: () => [...addressKeys.all, "list"] as const,
};

export async function fetchAddresses() {
  return apiClient<{ data: Address[] }>({
    route: "/addresses",
    tokenRequire: true,
  });
}

export async function deleteAddress(id: number) {
  return apiClient({
    route: `/addresses/${id}`,
    method: "DELETE",
    tokenRequire: true,
  });
}

export async function setDefaultAddress(id: number) {
  return apiClient({
    route: `/addresses/${id}/set-default`,
    method: "POST",
    tokenRequire: true,
  });
}
