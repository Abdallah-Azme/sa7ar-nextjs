"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, ResponseResult } from "@/types";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CartResponse {
	address_id: number | null;
	items: CartItem[];
	applied_coupon: any | null;
	subtotal: number;
	tax: number;
	coupon_discount: number;
	delivery_price: number;
	total: number;
}

interface DataSent {
	product_id: number;
	quantity?: number;
	size_id?: number | null;
}

interface CartContextType {
	cart: CartResponse | null;
	cartCount: number;
	isLoading: boolean;
	refreshCart: () => Promise<void>;
	addToCart: (item: DataSent) => void;
	applyCoupon: (code: string) => Promise<boolean>;
	updateCart: (params: {
		cartItem: CartItem;
		type?: "remove" | "increase" | "decrease";
		quantity?: number;
	}) => void;
	addToCartPending: boolean;
	updateCartPending: boolean;
	applyCouponPending: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

/**
 * CartProvider - Client Component
 * Managed client-side cart data
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [addToCartPending, setAddToCartPending] = useState(false);
	const [updateCartPending, setUpdateCartPending] = useState(false);
	const [applyCouponPending, setApplyCouponPending] = useState(false);
	const { isAuthenticated } = useAuth();

	const cartCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

	const refreshCart = async () => {
		if (!isAuthenticated) {
			setCart(null);
			return;
		}

		setIsLoading(true);
		try {
			const res = await apiClient<CartResponse>({
				route: "/cart",
				tokenRequire: true,
			});
			setCart(res.data ?? null);
		} catch (error) {
			console.error("Cart Fetch Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			refreshCart();
		} else {
			setCart(null);
		}
        // eslint-disable-next-line
	}, [isAuthenticated]);

	const addToCart = async ({ quantity = 1, ...item }: DataSent) => {
		if (!isAuthenticated) {
			toast.error("يرجى تسجيل الدخول أولاً");
			return;
		}

		setAddToCartPending(true);
		try {
			const res = await apiClient({
				route: "/cart/add",
				method: "POST",
				body: JSON.stringify({ ...item, quantity }),
				tokenRequire: true,
			});
			toast.success(res.message);
			await refreshCart();
		} catch (error: any) {
			toast.error(error?.message || "حدث خطأ ما");
		} finally {
			setAddToCartPending(false);
		}
	};

	const updateCart = async ({
		cartItem,
		type,
		quantity,
	}: {
		cartItem: CartItem;
		type?: "remove" | "increase" | "decrease";
		quantity?: number;
	}) => {
		let resolvedQuantity: number;

		if (typeof quantity === "number") {
			resolvedQuantity = quantity;
		} else {
			switch (type) {
				case "remove":
					resolvedQuantity = 0;
					break;
				case "decrease":
					resolvedQuantity = cartItem.quantity - 1;
					break;
				case "increase":
				default:
					resolvedQuantity = cartItem.quantity + 1;
			}
		}

		setUpdateCartPending(true);
		try {
			const res = await apiClient({
				route: "/cart/update",
				method: "POST",
				body: JSON.stringify({ cart_item_id: cartItem.id, quantity: Math.max(0, resolvedQuantity), _method: "PUT" }),
				tokenRequire: true,
			});
			toast.success(res.message);
			await refreshCart();
		} catch (error: any) {
			toast.error(error?.message || "حدث خطأ ما");
		} finally {
			setUpdateCartPending(false);
		}
	};

	const applyCoupon = async (code: string) => {
		if (!isAuthenticated) {
			toast.error("يرجى تسجيل الدخول أولاً");
			return false;
		}

		setApplyCouponPending(true);
		try {
			const data = await apiClient({
				route: "/cart/apply-coupon",
				method: "POST",
				body: JSON.stringify({ code }),
				tokenRequire: true,
			});
			toast.success(data.message);
			await refreshCart();
			return true;
		} catch (error: any) {
			toast.error(error?.message || "حدث خطأ ما");
			return false;
		} finally {
			setApplyCouponPending(false);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				cartCount,
				isLoading,
				refreshCart,
				addToCart,
				updateCart,
				applyCoupon,
				addToCartPending,
				updateCartPending,
				applyCouponPending,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
