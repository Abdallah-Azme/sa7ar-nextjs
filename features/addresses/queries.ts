import apiClient from "@/lib/apiClient";
import type { Address } from "./types";

/**
 * Fetch All User Addresses
 * Server-side authenticated request
 */
export async function getAddresses() {
	try {
		const res = await apiClient<{ data: Address[] }>({
			route: "/addresses",
			tokenRequire: true,
		});
		return res.data || [];
	} catch (error) {
		console.error("Error fetching addresses:", error);
		return [];
	}
}

/**
 * Fetch Single Address Details
 */
export async function getAddressDetails(id: string) {
	try {
		const res = await apiClient<{ data: Address }>({
			route: `/addresses/${id}`,
			tokenRequire: true,
		});
		return res.data;
	} catch (error) {
		console.error(`Error fetching address ${id}:`, error);
		return null;
	}
}

/**
 * Delete Address Action
 */
export async function deleteAddress(id: number) {
    return apiClient({
        route: `/addresses/${id}`,
        method: "DELETE",
        tokenRequire: true,
    });
}

/**
 * Set Default Address Action
 */
export async function setDefaultAddress(id: number) {
    return apiClient({
        route: `/addresses/${id}/set-default`,
        method: "POST",
        tokenRequire: true,
    });
}
