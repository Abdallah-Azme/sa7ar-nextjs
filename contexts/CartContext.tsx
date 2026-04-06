"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, ResponseResult } from "@/types";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

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

interface CartContextType {
	cart: CartResponse | null;
	cartCount: number;
	isLoading: boolean;
	refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

/**
 * CartProvider - Client Component
 * Managed client-side cart data
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
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

	return (
		<CartContext.Provider
			value={{
				cart,
				cartCount,
				isLoading,
				refreshCart,
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
