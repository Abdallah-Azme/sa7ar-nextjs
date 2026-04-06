import { getBrandProducts, getBestSellingProducts } from "@/features/products/queries";
import ProductCard from "@/components/shared/cards/ProductCard";
import AppPagination from "@/components/shared/AppPagination";
import EmptyCard from "@/components/shared/EmptyCard";
import SectionLabel from "@/components/shared/SectionLabel";
import HelpCard from "@/components/shared/cards/HelpCard";
import { ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const sectionConfig: Record<string, { title: string; fetcher: (sizeIds?: number[]) => Promise<import("@/types").Product[]> }> = {
  "most-sold": {
    title: "Most Sold Products",
    fetcher: getBestSellingProducts,
  },
  "rathath": {
    title: "Rathath Products",
    fetcher: (sizeIds) => getBrandProducts("rathath", sizeIds),
  },
  "bard": {
    title: "Bard Products",
    fetcher: (sizeIds) => getBrandProducts("bard", sizeIds),
  },
};

/**
 * Dynamic Metadata for Products List
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const section = (params.section as string) || "most-sold";
  const title = sectionConfig[section]?.title || "Products List";

  return {
    title: `${title} | Sohar Water`,
    description: `Browse all products in our ${title} collection. Pure and natural water for your daily life.`,
  };
}

/**
 * Products List Page - RSC (Server Component)
 * Handles paginated and filtered product lists for different categories.
 */
export default async function ProductsListPage({ searchParams }: Props) {
  const params = await searchParams;
  const section = (params.section as string) || "most-sold";
  const sizeId = params.size_id as string;

  const sizeIds = sizeId ? sizeId.split(",").map(Number) : [];
  const resolvedSection = sectionConfig[section] || sectionConfig["most-sold"];
  
  // Fetch products on the server
  const products = await resolvedSection.fetcher(sizeIds);
  
  // Mocking pagination for now as API response format needs careful check later
  const totalPages = 1; 

  return (
    <div className="flex flex-col min-h-screen">
      <section className="container space-y-10 py-20">
        
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <SectionLabel 
              text="Our Products" 
              Icon={<ShoppingBagIcon size={15} />} 
            />
            <div className="flex items-center gap-2">
              <ShoppingBasketIcon size={30} className="text-secondary" />
                <h1 className="text-xl sm:text-2xl lg:text-5xl font-medium">
                    {resolvedSection.title}
                </h1>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full py-20">
                <EmptyCard />
            </div>
          ) : (
            products.map((product: any) => (
              <ProductCard key={product.id} item={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        <AppPagination totalPages={totalPages} />

      </section>

      {/* Support Section */}
      <HelpCard className="border-t border-gray/5" />

    </div>
  );
}
