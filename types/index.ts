export type ResponseResult<T> = {
	code: number;
	status: boolean;
	data: T;
	message: string;
};

export type RequestAppInit = {
	route: string;
	isFormData?: boolean;
	isDownload?: boolean;
	tokenRequire?: boolean;
} & RequestInit;

export interface Profile {
	id: number;
	name: string;
	email: string;
	mobile: string;
	image?: string | null;
	cart_count: number;
	unread_notifications_count: number;
	points: number;
}

export type Product = {
	id: number;
	name: string;
	slug?: string | null;
	image: string;
	image_alt?: string | null;
	price: number;
	offer_price: number | null;
	points_value: number;
	size: string;
	seo: Seo;
	is_most_sold: boolean;
};

interface CartProduct {
	id: number;
	name: string;
	category: string | null;
	image: string;
	price: string;
	offer_price: string;
	discount_percentage: number;
}

export interface CartItem {
	id: number;
	quantity: number;
	price: number;
	subtotal: number;
	is_donation: boolean;
	product: CartProduct;
}

export interface Seo {
	slug: string;
	meta_title: string | null;
	meta_description: string | null;
	meta_keywords: string | null;
}

export type Pagination = {
	current_page: number;
	per_page: number;
	total: number;
	total_pages: number;
};
