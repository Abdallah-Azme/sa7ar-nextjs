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
import { fetchSeoSettings } from "@/features/settings/services/settingsService";
import type { Product } from "@/types";

function buildBestSellingAccessoriesJsonLd({
  lang,
  page,
  title,
  description,
  products,
}: {
  lang: string;
  page: number;
  title: string;
  description: string;
  products: Product[];
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const listPath = lang === "ar" ? "/best-selling-accessories" : `/${lang}/best-selling-accessories`;
  const listUrl = new URL(
    page > 1 ? `${listPath}?page=${page}` : listPath,
    baseUrl,
  ).toString();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: listUrl,
    mainEntity: {
      "@type": "ItemList",
      name: title,
      numberOfItems: products.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: products.map((product, index) => {
        const slug = product.seo?.slug || String(product.id);
        const productPath = lang === "ar" ? `/products/${slug}` : `/${lang}/products/${slug}`;
        const currentPrice =
          typeof product.offer_price === "number" ? product.offer_price : product.price;

        return {
          "@type": "ListItem",
          position: (page - 1) * products.length + index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            image: product.image || undefined,
            sku: `PRD-${product.id}`,
            url: new URL(productPath, baseUrl).toString(),
            offers: {
              "@type": "Offer",
              priceCurrency: "SAR",
              price: typeof currentPrice === "number" ? currentPrice.toFixed(2) : undefined,
              availability: "https://schema.org/InStock",
            },
          },
        };
      }),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.bestSellingAccessories" });
  const seoSettings = await fetchSeoSettings();
  const seoPage = seoSettings?.pages?.accessory_products;

  return generateSeoMetadata({
    title: seoPage?.meta_title || t("title"),
    description: seoPage?.meta_description || t("description"),
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

  const t = await getTranslations({ locale: lang, namespace: "seo.bestSellingAccessories" });
  const accessories = await queryClient.ensureQueryData({
    queryKey: productKeys.accessoriesPaged(page),
    queryFn: () => fetchBestSellingAccessoriesPaginated(page),
  });

  const jsonLd = buildBestSellingAccessoriesJsonLd({
    lang,
    page,
    title: t("title"),
    description: t("description"),
    products: accessories.products,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PaginatedProductsPageContent source="accessories" titleKey="bestSellingAccessories.title" />
    </HydrationBoundary>
  );
}
