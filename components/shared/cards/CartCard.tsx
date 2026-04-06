"use client";

import ImageFallback from "@/components/shared/ImageFallback";
import PriceIcon from "@/components/icons/PriceIcon";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";
import { MinusIcon, PlusIcon, Trash2, XIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CartCardProps {
	item: CartItem;
}

/**
 * CartCard - Client Component
 * Handles quantity updates and removal of items within the shopping cart.
 */
export default function CartCard({ item }: CartCardProps) {
	const { updateCart, updateCartPending } = useCart();
	const product = item.product;
	const buttonClass =
		"inline-flex cursor-pointer items-center justify-center bg-background-cu hover:bg-background-cu/80 p-0 shrink-0 size-8 rounded-full transition-all active:scale-95";

	return (
		<Card className="border border-black/5 rounded-4xl p-5 flex flex-col sm:flex-row gap-6 items-center justify-between">
			<CardContent className="flex items-center gap-4 w-full px-2">
				<div className="size-35 lg:size-50 rounded-3xl bg-background-cu flex items-center justify-center overflow-hidden">
					<ImageFallback
						src={product.image}
						alt={product.name}
						width={200}
						height={200}
						className="object-contain size-full"
					/>
				</div>
				<div className="space-y-2">
					<h3 className="text-lg font-bold text-primary">{product.name}</h3>
					<div className="flex items-center gap-2 text-sm font-bold">
						<span className="text-accent flex items-center gap-1">
							{item.price}
							<PriceIcon />
						</span>
					</div>
				</div>
			</CardContent>

			<div className="space-y-5">
				<button 
					className="ms-auto block hover:opacity-70 transition-opacity" 
					disabled={updateCartPending}
					onClick={() => updateCart({ cartItem: item, type: "remove" })}
				>
					<XIcon
						size={16}
						className="text-destructive stroke-2 cursor-pointer"
					/>
				</button>

				<div className="flex items-center justify-between rounded-full py-1.5 px-3 bg-white gap-3 border border-black/10">
					<button
						disabled={updateCartPending}
						onClick={() => updateCart({ cartItem: item, type: "increase" })}
						className={cn(buttonClass, "border border-black/10 shadow-sm")}
					>
						<PlusIcon size={12} className="stroke-[3px] text-accent" />
					</button>
					<span className="font-extrabold text-[10px] w-6 text-center">
						{String(item.quantity).padStart(2, "0")}
					</span>
					<button
						disabled={updateCartPending}
						onClick={() => updateCart({ cartItem: item, type: "decrease" })}
						className={cn(buttonClass, "border border-black/10 shadow-sm")}
					>
						{item.quantity === 1 ? (
							<Trash2 className="text-secondary stroke-[3px]" size={10} />
						) : (
							<MinusIcon size={12} className="stroke-[3px] text-gray" />
						)}
					</button>
				</div>
			</div>
		</Card>
	);
}
