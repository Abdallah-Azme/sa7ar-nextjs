"use client";

import { useQuery } from "@tanstack/react-query";
import { 
    productKeys, 
    fetchBestSellingProducts, 
    fetchBrandSizes, 
    fetchBrandProducts, 
    fetchBestSellingAccessories 
} from "../services/productService";
import ProductsCarouselSection, { type ProductFilterOption } from "./ProductsCarouselSection";
import Banner from "@/components/shared/Banner";
import BestSellingAccessories from "@/features/home/components/BestSellingAccessories";

export default function ProductsPageContent() {
  const { data: bestSellers = [] } = useQuery({ queryKey: productKeys.bestSelling(), queryFn: fetchBestSellingProducts });
  const { data: bardSizes = [] } = useQuery({ queryKey: productKeys.brandSizes("bard"), queryFn: () => fetchBrandSizes("bard") });
  const { data: rathathSizes = [] } = useQuery({ queryKey: productKeys.brandSizes("rathath"), queryFn: () => fetchBrandSizes("rathath") });
  const { data: bardProducts = [] } = useQuery({ queryKey: productKeys.brand("bard"), queryFn: () => fetchBrandProducts("bard") });
  const { data: rathathProducts = [] } = useQuery({ queryKey: productKeys.brand("rathath"), queryFn: () => fetchBrandProducts("rathath") });
  const { data: accessories = [] } = useQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories });

  // Helper to build filter options from sizes
  const buildFilters = (sizes: { size: string }[]): ProductFilterOption[] => {
    const filters: ProductFilterOption[] = [{ value: "all", label: "الكل" }];
    const seen = new Set();
    sizes.forEach(s => {
        if (!seen.has(s.size)) {
            seen.add(s.size);
            filters.push({ value: s.size, label: s.size });
        }
    });
    return filters;
  };

  return (
    <main className="space-y-16 pb-20">
      {/* 1. Header Banner */}
      <Banner 
        title="منتجاتنا" 
        desc="اختر من تشكيلتنا الواسعة من منتجات المياه الممتازة." 
        bannerUrl="/images/products-hero.webp"
      />

      <div className="container space-y-20">
        {/* 2. Best Sellers */}
        {bestSellers.length > 0 && (
            <ProductsCarouselSection
                label="منتجاتنا"
                title="الأكثر مبيعاً"
                filters={[]}
                products={bestSellers}
                showMoreTo="/products-list?section=most-sold"
            />
        )}

        {/* 3. Bard Brand Section */}
        <ProductsCarouselSection
          label="منتجاتنا"
          title="منتجات برد"
          filters={buildFilters(bardSizes)}
          products={bardProducts}
          showMoreTo="/products-list?section=bard"
        />

        {/* 4. Rathath Brand Section */}
        <ProductsCarouselSection
          label="منتجاتنا"
          title="منتجات رذاذ"
          filters={buildFilters(rathathSizes)}
          products={rathathProducts}
          showMoreTo="/products-list?section=rathath"
        />
      </div>

      {/* 5. Best Selling Accessories */}
      <BestSellingAccessories accessories={accessories} />
    </main>
  );
}
