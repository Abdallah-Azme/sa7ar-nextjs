import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { 
    fetchBestSellingProducts, 
    fetchBrandSizes, 
    fetchBrandProducts, 
    fetchBestSellingAccessories, 
    productKeys 
} from "@/features/products/services/productService";
import ProductsPageContent from "@/features/products/components/ProductsPageContent";
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

  const queryClient = makeQueryClient();

  // 1. Parallel data prefetching for all sections
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: productKeys.bestSelling(),         queryFn: fetchBestSellingProducts }),
    queryClient.prefetchQuery({ queryKey: productKeys.brandSizes("bard"),    queryFn: () => fetchBrandSizes("bard") }),
    queryClient.prefetchQuery({ queryKey: productKeys.brandSizes("rathath"), queryFn: () => fetchBrandSizes("rathath") }),
    queryClient.prefetchQuery({ queryKey: productKeys.brand("bard"),         queryFn: () => fetchBrandProducts("bard") }),
    queryClient.prefetchQuery({ queryKey: productKeys.brand("rathath"),      queryFn: () => fetchBrandProducts("rathath") }),
    queryClient.prefetchQuery({ queryKey: productKeys.accessories(),         queryFn: fetchBestSellingAccessories }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsPageContent />
    </HydrationBoundary>
  );
}
