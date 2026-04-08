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
import { generateSeoMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.products" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/products",
  });
}

/**
 * Products Page - RSC (Server Component)
 * Secondary most visited page showing brand-specific collections with size filtering.
 */
export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "seo.products" });

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
      <h1 className="sr-only">{t("title")}</h1>
      <ProductsPageContent />
    </HydrationBoundary>
  );
}
