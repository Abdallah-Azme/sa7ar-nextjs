import { getBrandProducts, getBestSellingProducts, getBestSellingAccessories } from "@/features/products/queries";
import ProductCard from "@/components/shared/cards/ProductCard";
import AppPagination from "@/components/shared/AppPagination";
import EmptyCard from "@/components/shared/EmptyCard";
import SectionLabel from "@/components/shared/SectionLabel";
import HelpCard from "@/components/shared/cards/HelpCard";
import SearchDialog from "@/components/shared/SearchDialog";
import { ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const sectionConfig: Record<string, { title: string; fetcher: (sizeIds?: number[]) => Promise<import("@/types").Product[]> }> = {
  "most-sold": {
    title: "الأكثر مبيعاً",
    fetcher: getBestSellingProducts,
  },
  "rathath": {
    title: "منتجات رذاذ",
    fetcher: (sizeIds) => getBrandProducts("rathath", sizeIds),
  },
  "bard": {
    title: "منتجات برد",
    fetcher: (sizeIds) => getBrandProducts("bard", sizeIds),
  },
  "accessories": {
    title: "الإكسسوارات الأكثر مبيعاً",
    fetcher: getBestSellingAccessories,
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
    title: `${title} | مياه صحار`,
    description: `تصفح جميع المنتجات في قسم ${title}. مياه نقية وطبيعية لحياتك اليومية.`,
  };
}

/**
 * Products List Page - RSC (Server Component)
 * Handles paginated and filtered product lists for different categories.
 */
export default async function ProductsListPage({ params, searchParams }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const searchValues = await searchParams;
  const section = (searchValues.section as string) || "most-sold";
  const sizeId = searchValues.size_id as string;

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
              text="منتجاتنا" 
              Icon={<ShoppingBagIcon size={15} />} 
            />
            <div className="flex items-center gap-2">
              <ShoppingBasketIcon size={30} className="text-secondary" />
                <h1 className="text-xl sm:text-2xl lg:text-5xl font-medium">
                    {resolvedSection.title}
                </h1>
            </div>
          </div>
          <div className="w-full sm:w-80">
            <SearchDialog />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full py-20">
                <EmptyCard />
            </div>
          ) : (
            products.map((product: import("@/types").Product) => (
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
