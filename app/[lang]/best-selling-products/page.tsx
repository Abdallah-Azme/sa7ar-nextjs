import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchMostSoldProducts, productKeys } from "@/features/products/services/productService";
import MostSoldProductsPageContent from "@/features/products/components/MostSoldProductsPageContent";
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

export default async function BestSellingProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const searchValues = await searchParams;
  const pageValue = Number(searchValues.page);
  const page = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: productKeys.mostSold(page),
    queryFn: () => fetchMostSoldProducts(page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MostSoldProductsPageContent />
    </HydrationBoundary>
  );
}
