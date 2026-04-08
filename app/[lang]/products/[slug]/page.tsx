import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { productKeys, fetchProductDetail } from "@/features/products/services/productService";
import ProductDetailsView from "@/features/products/components/ProductDetailsView";
import HelpCard from "@/components/shared/cards/HelpCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { generateSeoMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
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

  return generateSeoMetadata({
    title: data.product.seo?.meta_title || data.product.name,
    description: data.product.seo?.meta_description || data.product.description || "",
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

  return (
    <main className="flex flex-col min-h-screen">
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
