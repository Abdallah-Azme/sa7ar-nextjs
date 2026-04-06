import apiClient from "@/lib/apiClient";
import type { HomeResponse } from "./types";

/**
 * Server-side Fetch for Home Page Data
 */
export async function getHomeData() {
	try {
		const res = await apiClient<HomeResponse>({
			route: "/home",
			next: { revalidate: 3600 }, // Cache for 1 hour
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching home data:", error);
		return null;
	}
}

export async function getFaqData() {
	try {
        // Calling /faq endpoint based on React's Faq.tsx fetcher
		const res = await apiClient<{ id: number; question: string; answer: string; }[]>({
			route: "/faqs",
			next: { revalidate: 3600 }, 
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching FAQ data:", error);
		return [];
	}
}
