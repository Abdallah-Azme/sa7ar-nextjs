import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchBrandProducts, productKeys } from "@/features/products/services/productService";
import ProductsGrid from "@/features/products/components/ProductsGrid";
import { generateSeoMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type BrandSlug = "bard" | "rathath";

const BRAND_COPY: Record<BrandSlug, { title: string; seoKey: "bard" | "rathath" }> = {
  bard: { title: "Bard", seoKey: "bard" },
  rathath: { title: "Sohar", seoKey: "rathath" },
};

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const brand = BRAND_COPY[slug as BrandSlug];
  const t = await getTranslations({ locale: lang, namespace: "seo.brands" });

  if (!brand) {
    return generateSeoMetadata({
      title: t("title"),
      description: t("description"),
      lang,
      path: `/brands/${slug}`,
      noIndex: true,
    });
  }

  return generateSeoMetadata({
    title: `${brand.title} | ${t("title")}`,
    description: t("description"),
    lang,
    path: `/brands/${slug}`,
  });
}

export default async function BrandDetailsPage({ params }: Props) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const brand = slug as BrandSlug;
  if (!BRAND_COPY[brand]) {
    notFound();
  }

  const t = await getTranslations("brandPage");
  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: productKeys.brand(brand),
    queryFn: () => fetchBrandProducts(brand),
  });

  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">
        {t("title")} - {BRAND_COPY[brand].title}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsGrid queryKey={["products", "brand", brand]} source="brand" brand={brand} />
      </HydrationBoundary>
    </div>
  );
}
