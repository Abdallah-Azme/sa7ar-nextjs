"use client";

import ProductCard from "@/components/shared/cards/ProductCard";
import AppPagination from "@/components/shared/AppPagination";
import EmptyCard from "@/components/shared/EmptyCard";
import SectionLabel from "@/components/shared/SectionLabel";
import HelpCard from "@/components/shared/cards/HelpCard";
import SearchDialog from "@/components/shared/SearchDialog";
import { ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";
import { useBrandProducts, useBestSellingProducts } from "../hooks/useProducts";
import { useSearchParams } from "next/navigation";
import { fetchBestSellingAccessories } from "../services/productService";
import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../services/productService";

const useBestSellingAccessories = () => {
    return useQuery({
        queryKey: productKeys.accessories(),
        queryFn: fetchBestSellingAccessories,
    });
};

export default function ProductsListPageContent() {
    const searchParams = useSearchParams();
    const section = searchParams.get("section") || "most-sold";
    const sizeId = searchParams.get("size_id");
    const sizeIds = sizeId ? sizeId.split(",").map(Number) : [];

    // Hooks for all potential sections
    const bestSelling = useBestSellingProducts();
    const rathath = useBrandProducts("rathath", sizeIds);
    const bard = useBrandProducts("bard", sizeIds);
    const accessories = useBestSellingAccessories();

    let products: import("@/types").Product[] = [];
    let title = "";
    
    switch (section) {
        case "most-sold":
            products = bestSelling.data || [];
            title = "الأكثر مبيعاً";
            break;
        case "rathath":
            products = rathath.data || [];
            title = "منتجات رذاذ";
            break;
        case "bard":
            products = bard.data || [];
            title = "منتجات برد";
            break;
        case "accessories":
            products = accessories.data || [];
            title = "الإكسسوارات الأكثر مبيعاً";
            break;
        default:
            products = bestSelling.data || [];
            title = "الأكثر مبيعاً";
    }

    const totalPages = 1;

    return (
        <div className="flex flex-col min-h-screen">
            <section className="container space-y-10 py-20">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
                    <div className="space-y-4">
                        <SectionLabel 
                            text="منتجاتنا" 
                            Icon={<ShoppingBagIcon size={15} />} 
                        />
                        <div className="flex items-center gap-2">
                            <ShoppingBasketIcon size={30} className="text-secondary" />
                            <h1 className="text-xl sm:text-2xl lg:text-5xl font-medium">
                                {title}
                            </h1>
                        </div>
                    </div>
                    <div className="w-full sm:w-80">
                        <SearchDialog />
                    </div>
                </div>

                <div className="grid min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {products.length === 0 ? (
                        <div className="col-span-full py-20">
                            <EmptyCard />
                        </div>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} item={product} />
                        ))
                    )}
                </div>

                <AppPagination totalPages={totalPages} />
            </section>

            <HelpCard className="border-t border-gray/5" />
        </div>
    );
}
