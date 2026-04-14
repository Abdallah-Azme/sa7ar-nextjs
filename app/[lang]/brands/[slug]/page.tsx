import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import {
  fetchBrandProductsPaginated,
  productKeys,
} from "@/features/products/services/productService";
import PaginatedProductsPageContent from "@/features/products/components/PaginatedProductsPageContent";
import { generateSeoMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchSeoSettings } from "@/features/settings/services/settingsService";

type BrandSlug = "bard" | "rathath";

const BRAND_COPY: Record<BrandSlug, { title: string; seoKey: "bard" | "rathath" }> = {
  bard: { title: "Bard", seoKey: "bard" },
  rathath: { title: "Rathath", seoKey: "rathath" },
};

interface Props {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const brand = BRAND_COPY[slug as BrandSlug];
  const t = await getTranslations({ locale: lang, namespace: "seo.brands" });
  const seoSettings = await fetchSeoSettings();
  const seoPage = seoSettings?.pages?.brand_product;



  if (!brand) {
    return generateSeoMetadata({
      title: seoPage?.meta_title || t("title"),
      description: seoPage?.meta_description || t("description"),
      lang,
      path: `/brands/${slug}`,
      noIndex: true,
    });
  }

  const fallbackTitle = `${brand.title} | ${t("title")}`;

  return generateSeoMetadata({
    title: seoPage?.meta_title || fallbackTitle,
    description: seoPage?.meta_description || t("description"),
    lang,
    path: `/brands/${slug}`,
  });
}

export default async function BrandDetailsPage({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  const searchValues = await searchParams;
  const pageValue = Number(searchValues.page);
  const page = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;
  setRequestLocale(lang);

  const brand = slug as BrandSlug;
  if (!BRAND_COPY[brand]) {
    notFound();
  }

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: productKeys.brandPaged(brand, page),
    queryFn: () => fetchBrandProductsPaginated(brand, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaginatedProductsPageContent
        source="brand"
        brand={brand}
        titleKey={`brandProductsPage.${brand}`}
      />
    </HydrationBoundary>
  );
}
