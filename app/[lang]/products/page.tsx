import { getBestSellingProducts, getBrandProducts, getBrandSizes, getBestSellingAccessories } from "@/features/products/queries";
import ProductsCarouselSection, { ProductFilterOption } from "@/features/products/components/ProductsCarouselSection";
import Banner from "@/components/shared/Banner";
import BestSellingAccessories from "@/features/home/components/BestSellingAccessories";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "المنتجات | منتجاتنا",
  description: "تصفح التشكيلة الكاملة من مياه صحار، بما في ذلك العلامات التجارية برد ورذاذ.",
};

/**
 * Products Page - RSC (Server Component)
 * Secondary most visited page showing brand-specific collections with size filtering.
 */
export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  // 1. Parallel data fetching for all sections
  const [bestSellers, bardSizes, rathathSizes, bardProducts, rathathProducts, accessories] = await Promise.all([
    getBestSellingProducts(),
    getBrandSizes("bard"),
    getBrandSizes("rathath"),
    getBrandProducts("bard"),
    getBrandProducts("rathath"),
    getBestSellingAccessories(),
  ]);

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
