import { getBestSellingProducts, getBrandProducts, getBrandSizes } from "@/features/products/queries";
import ProductsCarouselSection, { ProductFilterOption } from "@/features/products/components/ProductsCarouselSection";
import Banner from "@/components/shared/Banner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Products | منتجاتنا",
  description: "Browse the full collection of Sohar Water products, including Bard and Rathath brands.",
};

/**
 * Products Page - RSC (Server Component)
 * Secondary most visited page showing brand-specific collections with size filtering.
 */
export default async function ProductsPage() {
  // 1. Parallel data fetching for all sections
  const [bestSellers, bardSizes, rathathSizes, bardProducts, rathathProducts] = await Promise.all([
    getBestSellingProducts(),
    getBrandSizes("bard"),
    getBrandSizes("rathath"),
    getBrandProducts("bard"),
    getBrandProducts("rathath"),
  ]);

  // Helper to build filter options from sizes
  const buildFilters = (sizes: { size: string }[]): ProductFilterOption[] => {
    const filters: ProductFilterOption[] = [{ value: "all", label: "All Sizes" }];
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
        title="Refresh Your Life" 
        desc="Choose from our wide range of premium water products." 
        bannerUrl="/images/products-hero.webp"
      />

      <div className="container space-y-20">
        
        {/* 2. Best Sellers */}
        {bestSellers.length > 0 && (
            <ProductsCarouselSection
                label="Best Sellers"
                title="Our Most Popular"
                filters={[]}
                products={bestSellers}
                showMoreTo="/products?section=most-sold"
            />
        )}

        {/* 3. Bard Brand Section */}
        <ProductsCarouselSection
          label="Our Brands"
          title="Bard Products"
          filters={buildFilters(bardSizes)}
          products={bardProducts}
          showMoreTo="/products?brand=bard"
        />

        {/* 4. Rathath Brand Section */}
        <ProductsCarouselSection
          label="Our Brands"
          title="Rathath Products"
          filters={buildFilters(rathathSizes)}
          products={rathathProducts}
          showMoreTo="/products?brand=rathath"
        />

      </div>
    </main>
  );
}
