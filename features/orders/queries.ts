import apiClient from "@/lib/apiClient";
import type { Order, OrderDetails } from "./types";

/**
 * Fetch Order History
 * Server-side function with token support
 */
export async function getOrderHistory() {
	try {
		const res = await apiClient<Order[]>({
			route: "/orders",
			tokenRequire: true,
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching order history:", error);
		return [];
	}
}

/**
 * Fetch Single Order Details
 */
export async function getOrderDetails(id: string) {
	try {
		const res = await apiClient<OrderDetails>({
			route: `/orders/${id}`,
			tokenRequire: true,
		});
		return res.data;
	} catch (error) {
		console.error(`Error fetching order ${id} details:`, error);
		return null;
	}
}
