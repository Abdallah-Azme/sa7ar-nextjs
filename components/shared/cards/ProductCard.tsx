"use client";

import PriceIcon from "@/components/icons/PriceIcon";
import WaterDrop from "@/components/icons/WaterDrop";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { MinusIcon, PlusIcon, ShoppingBasketIcon, StarIcon, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import ImageFallback from "../ImageFallback";
import { useTranslations } from "next-intl";

const buttonClass =
	"inline-flex cursor-pointer items-center justify-center bg-background-cu hover:bg-background-cu/80 p-0 shrink-0 size-8 rounded-full";

/**
 * ProductCard - Client Component
 * Handles direct cart interaction and quantity management
 */
export default function ProductCard({ item }: { item: Product }) {
    const tActions = useTranslations("actions");
    const tProducts = useTranslations("products");
	const { cart, addToCart, updateCart, addToCartPending, updateCartPending } = useCart();

	const pointsValue = Number(item?.points_value ?? 0);
	const hasPoints = pointsValue > 0;
	const isMostSold = Boolean(item?.is_most_sold);

	const cartItem = cart?.items?.find(
		(c) => Number(c?.product?.id) === Number(item?.id),
	);

	return (
		<Card className="p-0 shadow-none border-0 bg-transparent">
			<CardHeader className="relative rounded-4xl py-4 sm:py-6 bg-background-cu flex items-center justify-center overflow-visible">
				{(hasPoints || isMostSold) && (
					<div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 direction-ltr">
						{hasPoints && (
							<span className="rounded-md bg-accent flex gap-px items-center px-2 py-1 text-xs font-extrabold leading-none text-white whitespace-nowrap">
								<StarIcon size={10} className="fill-white" />{pointsValue}+
							</span>
						)}
						{isMostSold && (
							<span className="rounded-md bg-orange-500 px-2 py-1 text-[10px] font-bold leading-none text-white whitespace-nowrap">
								{tProducts("mostSold")}
							</span>
						)}
					</div>
				)}
				<Link href={`/products/${item?.seo?.slug || item?.id}`}>
					<ImageFallback
						src={item?.image}
						alt={item?.name}
						width={275}
						height={275}
						className="w-33 h-48 mx-auto object-contain"
					/>
				</Link>
			</CardHeader>
			<CardContent className="flex flex-col gap-3 items-center text-center mt-4">
				<div className="text-gray text-xs font-medium flex items-center justify-center gap-2">
					<WaterDrop size={14} className="stroke-2" />
					<span>{item?.size}</span>
				</div>
				{/* Title */}
				<h3 className="font-bold text-lg line-clamp-1">{item?.name}</h3>

				{/* Price */}
				<div className="font-extrabold text-xl flex items-center gap-2">
					{item?.offer_price && (
						<div className="text-accent flex items-center gap-1">
							{item?.offer_price}
							<PriceIcon />
						</div>
					)}
					<div
						className={cn(
							"text-gray-light flex items-center gap-1",
							!item?.offer_price && "text-accent",
							item?.offer_price && "line-through",
						)}
					>
						{item?.price}
						<PriceIcon />
					</div>
				</div>
			</CardContent>
			<CardFooter className="bg-transparent border-0">
				{cartItem ? (
					<div className="flex justify-between w-full items-center gap-2 rounded-md border border-primary h-10 px-4 md:h-13 py-2">
						<button
							className={buttonClass + " text-accent"}
							aria-label={tActions("increase")}
							disabled={updateCartPending}
							onClick={() => updateCart({ cartItem, type: "increase" })}
						>
							<PlusIcon size={14} />
						</button>
						<span className="text-xs font-medium">
							{String(cartItem.quantity).padStart(2, "0")}
						</span>
						<button 
							className={buttonClass + " text-gray"} 
							aria-label={cartItem.quantity === 1 ? tActions("remove") : tActions("decrease")}
							disabled={updateCartPending}
							onClick={() => updateCart({ cartItem, type: cartItem.quantity === 1 ? "remove" : "decrease" })}
						>
							{cartItem.quantity === 1 ? (
								<Trash2 className="text-destructive stroke-1" size={14} />
							) : (
								<MinusIcon size={14} />
							)}
						</button>
					</div>
				) : (
					<Button
						className="w-full"
						disabled={addToCartPending}
						onClick={() => addToCart({ product_id: item.id, quantity: 1, size_id: null })}
					>
						<span>{tActions("addToCart")}</span>
						<ShoppingBasketIcon size={10} />
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
