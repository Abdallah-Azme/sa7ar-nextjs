import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { productKeys, fetchProductDetail } from "@/features/products/services/productService";
import ProductDetailsView from "@/features/products/components/ProductDetailsView";
import HelpCard from "@/components/shared/cards/HelpCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

/**
 * Dynamic Metadata for Product Details
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchProductDetail(id);

  if (!data?.product) return { title: "المنتج غير موجود | سحر" };

  return {
    title: `${data.product.name} | سحر`,
    description: data.product.description,
    openGraph: {
      images: [data.product.image || data.product.images?.[0]],
    },
  };
}

/**
 * Product Details Page - RSC (Server Component)
 */
export default async function ProductPage({ params }: Props) {
  const { lang, id } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  const data = await queryClient.fetchQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductDetail(id),
  });

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
