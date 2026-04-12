"use client";

import { createContext, useContext, useMemo } from "react";
import type { CartItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { 
    useCartQuery, 
    useAddToCartMutation, 
    useUpdateCartMutation, 
    useApplyCouponMutation 
} from "@/features/cart/hooks/useCart";

interface AppliedCoupon {
	code: string;
	discount_type?: string;
	discount_value?: number;
}

interface CartResponse {
	address_id: number | null;
	items: CartItem[];
	applied_coupon: AppliedCoupon | null;
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

export function CartProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth();
	const { openAuth } = useAuthDialog();
    const tCartErrors = useTranslations("cart.errors");
    
    // React Query Hooks
    const { data: cartData, isLoading, refetch } = useCartQuery(isAuthenticated);
    const addToCartMutation = useAddToCartMutation();
    const updateCartMutation = useUpdateCartMutation();
    const applyCouponMutation = useApplyCouponMutation();

    const cart = (cartData as unknown as { data: CartResponse })?.data ?? null;
	const cartCount = useMemo(() => cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0, [cart]);

	const refreshCart = async () => {
		await refetch();
	};

	const addToCart = async ({ quantity = 1, ...item }: DataSent) => {
        if (!isAuthenticated) {
            toast.error(tCartErrors("loginRequired"));
			openAuth("login");
            return;
        }
		addToCartMutation.mutate({ ...item, quantity });
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

		updateCartMutation.mutate({ 
            cart_item_id: cartItem.id, 
            quantity: Math.max(0, resolvedQuantity) 
        });
	};

	const applyCoupon = async (code: string) => {
		try {
            await applyCouponMutation.mutateAsync(code);
            return true;
        } catch {
            return false;
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
				addToCartPending: addToCartMutation.isPending,
				updateCartPending: updateCartMutation.isPending,
				applyCouponPending: applyCouponMutation.isPending,
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
