import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import {
  productKeys,
  fetchProductDetail,
  fetchProductSchema,
} from "@/features/products/services/productService";
import ProductDetailsView from "@/features/products/components/ProductDetailsView";
import HelpCard from "@/components/shared/cards/HelpCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { generateSeoMetadata } from "@/lib/seo";
import { getPublicApiBaseUrl } from "@/lib/apiBase";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

function toAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;

  try {
    return new URL(url, getPublicApiBaseUrl()).toString();
  } catch {
    return url;
  }
}

function buildFallbackProductJsonLd(product: Awaited<ReturnType<typeof fetchProductDetail>>["product"]) {
  const images = [product.image, ...(product.images ?? [])]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((image) => toAbsoluteUrl(image));

  const currentPrice = typeof product.offer_price === "number" ? product.offer_price : product.price;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    sku: `PRD-${product.id}`,
    image: images,
    brand: {
      "@type": "Brand",
      name: product.size || "Sahar",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: typeof currentPrice === "number" ? currentPrice.toFixed(2) : undefined,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

/**
 * Dynamic Metadata for Product Details
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  let data: Awaited<ReturnType<typeof fetchProductDetail>> | null = null;
  try {
    data = await fetchProductDetail(slug);
  } catch {
    data = null;
  }

  if (!data?.product) {
    return generateSeoMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      lang,
      path: `/products/${slug}`,
    });
  }

  const seoWithSettings = data.product.seo as
    | (typeof data.product.seo & {
        settings?: {
          meta_title?: string | null;
          meta_description?: string | null;
        } | null;
      })
    | null
    | undefined;
  const seoSettings = seoWithSettings?.settings;
  const settingsMetaTitle = typeof seoSettings?.meta_title === "string" ? seoSettings.meta_title.trim() : "";
  const settingsMetaDescription =
    typeof seoSettings?.meta_description === "string" ? seoSettings.meta_description.trim() : "";
  const seoMetaTitle = data.product.seo?.meta_title?.trim() || "";
  const seoMetaDescription = data.product.seo?.meta_description?.trim() || "";
  const seoMetaKeywords = data.product.seo?.meta_keywords?.trim() || "";

  return generateSeoMetadata({
    title: settingsMetaTitle || seoMetaTitle || data.product.name,
    description: settingsMetaDescription || seoMetaDescription || data.product.description || "",
    keywords: seoMetaKeywords || undefined,
    lang,
    path: `/products/${slug}`,
    image: data.product.image || data.product.images?.[0],
  });
}

/**
 * Product Details Page - RSC (Server Component)
 */
export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  let data: Awaited<ReturnType<typeof fetchProductDetail>> | null = null;
  try {
    data = await queryClient.fetchQuery({
      queryKey: productKeys.detail(slug),
      queryFn: () => fetchProductDetail(slug),
    });
  } catch {
    notFound();
  }
  if (!data?.product) {
    notFound();
  }

  let schemaFromApi: Record<string, unknown> | null = null;
  try {
    schemaFromApi = await fetchProductSchema(data.product.id);
  } catch {
    schemaFromApi = null;
  }

  const jsonLd = schemaFromApi ?? buildFallbackProductJsonLd(data.product);

  return (
    <main className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDetailsView
          product={data.product}
          relatedProducts={data.related_products || []}
        />
      </HydrationBoundary>

      <HelpCard className="border-t border-gray/5" />
    </main>
  );
}
