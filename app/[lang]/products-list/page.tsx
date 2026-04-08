import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { 
    fetchBrandProducts, 
    fetchBestSellingProducts, 
    fetchBestSellingAccessories,
    productKeys 
} from "@/features/products/services/productService";
import ProductsListPageContent from "@/features/products/components/ProductsListPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const titles: Record<string, string> = {
  "most-sold": "الأكثر مبيعاً",
  "rathath": "منتجات رذاذ",
  "bard": "منتجات برد",
  "accessories": "الإكسسوارات الأكثر مبيعاً",
};

/**
 * Dynamic Metadata for Products List
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const section = (params.section as string) || "most-sold";
  const title = titles[section] || "Products List";

  return {
    title: `${title} | مياه صحار`,
    description: `تصفح جميع المنتجات في قسم ${title}. مياه نقية وطبيعية لحياتك اليومية.`,
  };
}

/**
 * Products List Page - RSC (Server Component)
 */
export default async function ProductsListPage({ params, searchParams }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const searchValues = await searchParams;
  const section = (searchValues.section as string) || "most-sold";
  const sizeId = searchValues.size_id as string;
  const sizeIds = sizeId ? sizeId.split(",").map(Number) : [];

  const queryClient = makeQueryClient();
  
  // Prefetch based on the active section to avoid unneeded server requests
  if (section === "most-sold") {
    await queryClient.prefetchQuery({ queryKey: productKeys.bestSelling(), queryFn: fetchBestSellingProducts });
  } else if (section === "rathath") {
    await queryClient.prefetchQuery({ queryKey: [...productKeys.brand("rathath"), sizeIds], queryFn: () => fetchBrandProducts("rathath", sizeIds) });
  } else if (section === "bard") {
    await queryClient.prefetchQuery({ queryKey: [...productKeys.brand("bard"), sizeIds], queryFn: () => fetchBrandProducts("bard", sizeIds) });
  } else if (section === "accessories") {
    await queryClient.prefetchQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsListPageContent />
    </HydrationBoundary>
  );
}
