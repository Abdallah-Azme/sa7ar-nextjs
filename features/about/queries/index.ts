import apiClient from "@/lib/apiClient";

export interface AboutPageData {
	about_us: {
		title: string;
		description: string;
		first_image: string;
		second_image: string;
		number_of_workers: string;
		number_of_products: string;
		years_of_experience: string;
	};
	about_us_values_cards: Array<{
		icon: string | null;
		title: string;
		description: string;
	}>;
	our_vision: {
		title?: string;
		description?: string;
		icon?: string | null;
	} | null;
	our_sms: {
		title?: string;
		description?: string;
		icon?: string | null;
	} | null;
}

/**
 * Fetch About Us Page Data
 * Server-side cached query with 1 hour revalidation
 */
export async function getAboutPageData() {
	try {
		const res = await apiClient<{ data: AboutPageData }>({
			route: "/about-us",
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching about page data:", error);
		return null;
	}
}
