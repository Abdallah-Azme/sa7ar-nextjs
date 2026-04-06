import { getProductDetails } from "@/features/products/queries";
import ProductDetailsView from "@/features/products/components/ProductDetailsView";
import HelpCard from "@/components/shared/cards/HelpCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic Metadata for Product Details
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getProductDetails(id);

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
 * Dynamically fetches product data on the server for best SEO and LCP.
 */
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const data = await getProductDetails(id);

  if (!data?.product) {
    notFound();
  }

  return (
    <main className="flex flex-col min-h-screen">

      {/* Interactive Single Product View */}
      <ProductDetailsView
        product={data.product}
        relatedProducts={data.related_products || []}
      />

      {/* Support Call to Action */}
      <HelpCard className="border-t border-gray/5" />

    </main>
  );
}
