export enum OrderStatus {
	pending = "pending",
	in_the_way = "in_the_way",
	delivered = "delivered",
	canceled = "canceled",
	in_progress = "in_progress",
	on_request = "on_request",
}

export interface Order {
	id: number;
	status: OrderStatus;
	status_label?: string;
	delivery_status?: string;
	delivery_status_value?: string;
	order_status_value?: string;
	total: string;
	items_summary: string;
	image: string;
	created_at: string;
	delivered_at?: string | null;
	cancelled_at?: string | null;
	cancel_reason?: string | null;
}

export interface OrderItem {
    id: number;
    name: string;
    image: string;
    price: string;
    quantity: number;
    total: string;
    product_name?: string; // Adding for compatibility
}

export interface OrderDetails extends Order {
    items: OrderItem[];
    subtotal: string;
    tax: string;
    coupon_discount?: string;
    delivery_price: string;
    address_label?: string;
    address_details?: string;
    address: {
        id?: number;
        city?: string | null;
        details?: string | null;
        label?: string;
    };
    payment_method?: string;
    notes?: string | null;
}
