"use client";

import { useTranslations } from "next-intl";
import { ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";
import ShowMore from "@/components/shared/buttons/ShowMore";
import SectionLabel from "@/components/shared/SectionLabel";
import ProductCard from "@/components/shared/cards/ProductCard";
import type { Product } from "@/types";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

export default function Products({
	mostSold = [],
    title,
    queryKey
}: {
	mostSold?: Product[];
    title: string;
    queryKey: string;
}) {
	const t = useTranslations("common");
	return (
		<section className="container space-y-10">
			<div className="flex items-center justify-between">
				{/* Title */}
				<div className="space-y-6">
					<SectionLabel
						text={t("ourProducts")}
						Icon={<ShoppingBagIcon size={15} />}
					/>
					<div className="flex items-center gap-2">
						<ShoppingBasketIcon size={30} />
						<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
							{title}
						</h2>
					</div>
				</div>
				{mostSold.length > 5 && (
					<ShowMore to={`/products-list?section=${queryKey}`} />
				)}
			</div>

            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                    {mostSold.map((product) => (
                        <CarouselItem
                            key={product.id}
                            className="basis-full min-[460px]:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                        >
                            <ProductCard item={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
		</section>
	);
}
