import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchBestSellingProducts, productKeys } from "@/features/products/services/productService";
import ProductsGrid from "@/features/products/components/ProductsGrid";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.bestSelling" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/best-selling-products",
  });
}

export default async function BestSellingProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations("bestSelling");

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({ 
    queryKey: productKeys.bestSelling(), 
    queryFn: fetchBestSellingProducts 
  });

  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsGrid queryKey={["products", "best-selling"]} source="best-selling" />
      </HydrationBoundary>
    </div>
  );
}
