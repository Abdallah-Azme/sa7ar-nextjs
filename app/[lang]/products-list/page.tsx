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

import { getTranslations } from "next-intl/server";

/**
 * Dynamic Metadata for Products List
 */
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  const tSeo = await getTranslations({ locale: lang, namespace: "seo.products" });
  const tProducts = await getTranslations({ locale: lang, namespace: "products" });
  const sParams = await searchParams;
  const section = (sParams.section as string) || "most-sold";
  
  try {
    let titleSegment = "";
    if (section === "most-sold") {
      titleSegment = tProducts("mostSold");
    } else if (section === "rathath") {
      titleSegment = tProducts("sections.rathath");
    } else if (section === "bard") {
      titleSegment = tProducts("sections.bard");
    } else {
      titleSegment = tSeo("title").split("|")[0].trim();
    }

    return {
      title: `${titleSegment} | ${tSeo("title").split("|")[1]?.trim() || "Sohar"}`,
      description: tSeo("description"),
    };
  } catch (error) {
    console.error("Error in products-list metadata:", error);
    return {
      title: tSeo("title"),
      description: tSeo("description"),
    };
  }
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
