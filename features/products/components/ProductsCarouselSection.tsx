"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBasketIcon } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import EmptyCard from "@/components/shared/EmptyCard";
import ProductCard from "@/components/shared/cards/ProductCard";
import ShowMore from "@/components/shared/buttons/ShowMore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { Product } from "@/types";

export type ProductFilterOption = {
	value: string;
	label: string;
};

interface ProductsCarouselSectionProps {
	label: string;
	title: string;
	filters: ProductFilterOption[];
	selectedFilter?: string;
	onFilterChange?: (value: string) => void;
	products: Product[];
	isLoading?: boolean;
	isFiltersLoading?: boolean;
	showMoreTo?: string;
	emptyTitle?: string;
	emptyDescription?: string;
}

/**
 * ProductsCarouselSection - Client Component
 * Interactive product section with client-side filtering by size
 */
export default function ProductsCarouselSection({
	label,
	title,
	filters,
	selectedFilter = "all",
	onFilterChange = () => {},
	products,
	isLoading = false,
	isFiltersLoading = false,
	showMoreTo,
	emptyTitle,
	emptyDescription,
}: ProductsCarouselSectionProps) {
	const [api, setApi] = useState<CarouselApi>();
	const isMobile = useIsMobile();
	const filterCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		products.forEach((product) => {
			const sizeValue = (product.size || "").trim().toLowerCase();
			if (sizeValue) {
				counts[sizeValue] = (counts[sizeValue] ?? 0) + 1;
			}
		});
		return counts;
	}, [products]);
	const filteredProducts = useMemo(() => {
		if (selectedFilter === "all") return products;
		return products.filter(
			(product) => (product.size || "").trim().toLowerCase() === selectedFilter,
		);
	}, [products, selectedFilter]);

	useEffect(() => {
		if (!api || filteredProducts.length <= 1) return;
		const intervalId = window.setInterval(() => {
			api.scrollNext();
		}, 3000);

		return () => window.clearInterval(intervalId);
	}, [api, filteredProducts.length]);

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
					{isFiltersLoading
						? Array.from({ length: 5 }).map((_, index) => (
								<Skeleton
									key={`filter-skeleton-${index}`}
									className="h-11.5 w-24 rounded-full"
								/>
							))
						: filters.map((filter) => (
								<Button
									key={filter.value}
									variant={
										filter.value === selectedFilter ? "default" : "outline"
									}
									onClick={() => onFilterChange(filter.value)}
									className="rounded-full h-11.5 border-none gap-2"
								>
									<span>{filter.label}</span>
									{filterCounts[filter.value] && (
										<span className="size-8.75 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
											<span className="relative font-medium">
												{filterCounts[filter.value].toString().padStart(2, "0")}
											</span>
										</span>
									)}
								</Button>
							))}
					{showMoreTo && <ShowMore to={showMoreTo} />}
				</div>
			</div>

			{isLoading ? (
				<Carousel
					plugins={[Autoplay()]}
					setApi={setApi}
					opts={{ align: "start", loop: true }}
				>
					<CarouselContent className="py-2">
						{Array.from({ length: 6 }).map((_, index) => (
							<CarouselItem
								key={`product-skeleton-${index}`}
								className="basis-full min-[460px]:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/6"
							>
								<Skeleton className="h-[280px] w-full rounded-3xl" />
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			) : filteredProducts.length === 0 ? (
				<EmptyCard 
					title={emptyTitle}
					description={emptyDescription}
					className="py-8" 
				/>
			) : (
				<Carousel
					plugins={[Autoplay()]}
					setApi={setApi}
					opts={{ align: "start", loop: true }}
				>
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
