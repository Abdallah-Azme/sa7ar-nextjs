import { ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import ShowMore from "@/components/shared/buttons/ShowMore";
import ProductCard from "@/components/shared/cards/ProductCard";
import type { Product } from "@/types";

/**
 * BestSellingAccessories - RSC
 * Ported from React BestSellingAccessories.tsx
 * Fetches accessories on the server side instead of useQuery.
 */
export default function BestSellingAccessories({
	accessories = [],
	showMoreTo = "/products-list?section=accessories",
}: {
	accessories?: Product[];
	showMoreTo?: string;
}) {
	if (!accessories || accessories.length === 0) return null;

	return (
		<section className="bg-accent/20 py-10">
			<div className="container space-y-10">
				<div className="space-y-6 text-center">
					<SectionLabel
						text="منتجاتنا"
						Icon={<ShoppingBagIcon size={15} />}
						center
						white
					/>
					<div className="flex items-center justify-center text-center gap-2">
						<ShoppingBasketIcon size={30} />
						<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
							الإكسسوارات الأكثر مبيعاً
						</h2>
					</div>
				</div>

				<div className="grid min-[460px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
					{accessories.map((product) => (
						<ProductCard key={product.id} item={product} />
					))}
				</div>

				<div className="flex justify-center">
					{accessories.length > 6 && <ShowMore to={showMoreTo} />}
				</div>
			</div>
		</section>
	);
}
