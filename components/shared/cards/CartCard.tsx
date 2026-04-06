"use client";

import ImageFallback from "@/components/shared/ImageFallback";
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
	const { isLoading } = useCart();
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
						<span className="text-accent">{item.price} OMR</span>
					</div>
				</div>
			</CardContent>

			<div className="space-y-5">
				<button className="ms-auto block hover:opacity-70 transition-opacity" disabled={isLoading}>
					<XIcon
						size={16}
						className="text-destructive stroke-2 cursor-pointer"
					/>
				</button>

				<div className="flex items-center gap-2 bg-background-cu rounded-full p-1 border">
					<button
						disabled={isLoading}
						className={buttonClass + " text-accent"}
					>
						<PlusIcon size={14} />
					</button>
					<span className="text-xs font-bold w-6 text-center">
						{String(item.quantity).padStart(2, "0")}
					</span>
					<button
						disabled={isLoading}
						className={buttonClass + " text-gray"}
					>
						{item.quantity === 1 ? (
							<Trash2 className="text-destructive stroke-1" size={14} />
						) : (
							<MinusIcon size={14} />
						)}
					</button>
				</div>
			</div>
		</Card>
	);
}
