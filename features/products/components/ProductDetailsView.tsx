"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon, ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import ImageFallback from "@/components/shared/ImageFallback";
import WaterDrop from "@/components/icons/WaterDrop";
import PriceIcon from "@/components/icons/PriceIcon";
import CartIcon from "@/components/icons/CartIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";
import Autoplay from "embla-carousel-autoplay";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductCard from "@/components/shared/cards/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export interface ProductSize {
	id: number;
	size: string;
	price: number;
	offer_price: number | null;
}

export interface ProductDetail extends Product {
    sizes: ProductSize[];
    description: string;
    images: string[];
    size_id: number;
}

interface ProductDetailsViewProps {
	product: ProductDetail;
	relatedProducts: Product[];
}

import { useTranslations } from "next-intl";

/**
 * ProductDetailsView - Client Component
 * Interactive view for a single product.
 */
export default function ProductDetailsView({ product, relatedProducts }: ProductDetailsViewProps) {
	const tProducts = useTranslations("productDetails");
	const tNav = useTranslations("products");
	const tActions = useTranslations("actions");

	const { addToCart, addToCartPending } = useCart();
	const [quantity, setQuantity] = useState(1);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(product?.size_id || null);

    const activeSize = product?.sizes?.find((s: ProductSize) => s.id === selectedSizeId) || product;
	const unitPrice = activeSize?.offer_price || activeSize?.price || 0;
	const totalPrice = unitPrice * quantity;

	return (
		<div className="flex flex-col gap-16">
			<section className="container grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start mt-10">
				{/* Images Carousel */}
				<div className="bg-accent/10 rounded-4xl p-6 space-y-4">
					<Carousel opts={{ align: "start" }}>
						<CarouselContent>
							{product?.images?.map((image: string, index: number) => (
								<CarouselItem key={index}>
									<div className="h-96 flex items-center justify-center">
										<ImageFallback
											src={image}
											alt={product?.name}
											width={400}
											height={400}
											className="object-contain"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselNext className="end-4" />
						<CarouselPrevious className="start-4" />
					</Carousel>
				</div>

				{/* Info Column */}
				<div className="space-y-7">
					<div className="space-y-3">
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center font-medium gap-2 text-gray text-xs">
								<WaterDrop size={16} className="stroke-2 text-accent" />
								<span>{activeSize?.size}</span>
							</div>
                            {product?.is_most_sold ? (
                                <span className="rounded-md bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
                                    {tNav("mostSold")}
                                </span>
                            ) : null}
						</div>
						<div className="flex justify-between gap-2 items-center">
							<h1 className="text-primary text-2xl lg:text-3xl font-bold">
								{product?.name}
							</h1>
							<div className="font-extrabold text-xl flex items-center gap-2">
								<span className="text-accent flex items-center gap-1">
									{totalPrice.toFixed(3)}
									<PriceIcon className="size-6" />
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<label className="text-gray font-bold text-sm inline-block">
							<CartIcon className="inline me-2" />
							{tProducts("descriptionLabel")}
						</label>
						<p className="font-light text-gray text-sm leading-relaxed">
							{product?.description}
						</p>
					</div>

					{/* Size Selection */}
					{product?.sizes?.length > 0 && (
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-gray">{tProducts("sizeLabel")}</p>
                            <div className="flex gap-3 w-full">
                                {product.sizes.map((option: ProductSize) => (
                                    <Button
                                        key={option.id}
                                        variant={option.id === selectedSizeId ? "default" : "outline"}
                                        className={cn("rounded-xl flex-col gap-0 flex-1 font-extrabold h-12 px-6 border-none", option.id !== selectedSizeId && "text-gray")}
                                        onClick={() => setSelectedSizeId(option.id)}
                                    >
                                        {option.size}
                                        <span className="font-light text-xs">{tProducts("packageLabel")}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

					{/* Quantity Selector */}
					<div className="space-y-4">
						<label className="text-gray font-bold text-sm inline-block">
							<CartIcon className="inline me-2" />
							{tProducts("quantityLabel")}
						</label>
						<div className="flex items-center justify-between rounded-full py-2 px-5 bg-background-cu gap-3">
							<Button
								size="icon"
								className="rounded-full size-10"
								onClick={() => setQuantity(q => q + 1)}
							>
								<PlusIcon size={16} />
							</Button>
							<span className="font-bold text-lg">
								{String(quantity).padStart(2, "0")}
							</span>
							<Button
								size="icon"
								variant="outline"
								className="rounded-full size-10"
								onClick={() => setQuantity(q => Math.max(1, q - 1))}
							>
								<MinusIcon size={16} />
							</Button>
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="secondary"
							className="rounded-full h-14 flex-1 text-lg gap-2"
							disabled={addToCartPending}
							onClick={() => addToCart({ product_id: product.id, quantity, size_id: activeSize?.id })}
						>
							{tActions("addToCart")}
							<ShoppingBagIcon size={20} />
						</Button>
						<Button
							type="button"
							className="rounded-full h-14 flex-1 text-lg gap-2 bg-black hover:bg-black/90"
						>
							{tActions("buyNow")}
							<ArrowIcon className="rtl:rotate-180" />
						</Button>
					</div>
				</div>
			</section>

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<section className="container space-y-6 pb-20">
					<SectionHeader
						label={tNav("mostSold")}
						title={tProducts("similarTitle")}
						labelIcon={<ShoppingBagIcon size={15} />}
						titleIcon={<ShoppingBasketIcon size={30} />}
					/>
					<Carousel
						plugins={[Autoplay({ delay: 2500 })]}
						opts={{ align: "start", loop: true }}
					>
						<CarouselContent className="py-2">
							{relatedProducts.map((related) => (
								<CarouselItem
									key={related.id}
									className="basis-full min-[460px]:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/6"
								>
									<ProductCard item={related} />
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</section>
			)}
		</div>
	);
}
