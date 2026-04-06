"use client";

import { useMemo, useState } from "react";
import { ShoppingBasketIcon } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import EmptyCard from "@/components/shared/EmptyCard";
import ProductCard from "@/components/shared/cards/ProductCard";
import ShowMore from "@/components/shared/buttons/ShowMore";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { Product } from "@/types";

export type ProductFilterOption = {
	value: string;
	label: string;
};

interface ProductsCarouselSectionProps {
	label: string;
	title: string;
	filters: ProductFilterOption[];
	products: Product[];
	showMoreTo?: string;
}

/**
 * ProductsCarouselSection - Client Component
 * Interactive product section with client-side filtering by size
 */
export default function ProductsCarouselSection({
	label,
	title,
	filters,
	products,
	showMoreTo,
}: ProductsCarouselSectionProps) {
	const [selectedFilter, setSelectedFilter] = useState<string>("all");

    // Local filtering by size to avoid additional server roundtrips
	const filteredProducts = useMemo(() => {
		if (selectedFilter === "all") return products;
		return products.filter(
			(product) => product.size.toLowerCase() === selectedFilter.toLowerCase(),
		);
	}, [products, selectedFilter]);

	return (
		<section className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-6">
				<div className="space-y-4">
					<SectionLabel text={label} Icon={<ShoppingBasketIcon size={15} />} />
					<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
						{title}
					</h2>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{filters.map((filter) => (
						<Button
							key={filter.value}
							variant={filter.value === selectedFilter ? "default" : "outline"}
							onClick={() => setSelectedFilter(filter.value)}
							className="rounded-full h-11.5 border-none px-6"
						>
							{filter.label}
						</Button>
					))}
					{showMoreTo && filteredProducts.length > 6 && <ShowMore to={showMoreTo} />}
				</div>
			</div>

			{filteredProducts.length === 0 ? (
				<EmptyCard />
			) : (
				<Carousel opts={{ align: "start" }}>
					<CarouselContent className="py-2">
						{filteredProducts.map((product) => (
							<CarouselItem
								key={product.id}
								className="basis-full min-[460px]:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/6"
							>
								<ProductCard item={product} />
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			)}
		</section>
	);
}
