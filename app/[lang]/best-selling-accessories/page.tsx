import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import {
  fetchBestSellingAccessoriesPaginated,
  productKeys,
} from "@/features/products/services/productService";
import PaginatedProductsPageContent from "@/features/products/components/PaginatedProductsPageContent";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.bestSellingAccessories" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/best-selling-accessories",
  });
}

export default async function BestSellingAccessoriesPage({
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
    queryKey: productKeys.accessoriesPaged(page),
    queryFn: () => fetchBestSellingAccessoriesPaginated(page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaginatedProductsPageContent source="accessories" titleKey="bestSellingAccessories.title" />
    </HydrationBoundary>
  );
}
