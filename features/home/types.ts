import { Product, Seo } from "@/types";

export interface HomeResponse {
	uuid: string;
	sliders: {
		id: number;
		title: string;
		description: string;
		image: string;
		category_id: number | null;
		category_name: string | null;
		type: string;
		seo: Seo;
	}[];
	home_sliders?: HomeResponse["sliders"];
	my_subscription: unknown | null;
	my_points: number | null;
	most_sold_products: Product[];
	near_point_of_sales: {
		id: number;
		name: string;
		image: string;
		lat: number;
		long: number;
		location: string;
	}[];
	smart_consumer_categories: {
		id: number;
		name: string;
		logo: string;
		seo: Seo;
	}[];
	unfinished_order: unknown | null;
	most_ordered_products: Product[];
}
