import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { 
    fetchBrandProducts, 
    fetchBestSellingProducts, 
    fetchBestSellingAccessories,
    productKeys 
} from "@/features/products/services/productService";
import ProductsListPageContent from "@/features/products/components/ProductsListPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import { fetchSeoSettings } from "@/features/settings/services/settingsService";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import { getTranslations } from "next-intl/server";

function buildProductsListJsonLd({
  lang,
  section,
  sizeId,
  title,
  description,
  products,
}: {
  lang: string;
  section: string;
  sizeId?: string;
  title: string;
  description: string;
  products: Product[];
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const listPath = lang === "ar" ? "/products-list" : `/${lang}/products-list`;
  const listUrl = new URL(listPath, baseUrl);
  if (section && section !== "most-sold") listUrl.searchParams.set("section", section);
  if (sizeId) listUrl.searchParams.set("size_id", sizeId);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: listUrl.toString(),
    mainEntity: {
      "@type": "ItemList",
      name: title,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => {
        const slug = product.seo?.slug || String(product.id);
        const productPath = lang === "ar" ? `/products/${slug}` : `/${lang}/products/${slug}`;
        const currentPrice =
          typeof product.offer_price === "number" ? product.offer_price : product.price;

        return {
          "@type": "ListItem",
          position: index + 1,
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

/**
 * Dynamic Metadata for Products List
 */
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  const tSeo = await getTranslations({ locale: lang, namespace: "seo.products" });
  const tProducts = await getTranslations({ locale: lang, namespace: "products" });
  const seoSettings = await fetchSeoSettings();
  const seoPages = seoSettings?.pages;
  const sParams = await searchParams;
  const section = (sParams.section as string) || "most-sold";
  
  try {
    let titleSegment = "";
    if (section === "most-sold") {
      titleSegment = tProducts("mostSold");
    } else if (section === "rathath") {
      titleSegment = tProducts("sections.rathath");
    } else if (section === "bard") {
      titleSegment = tProducts("sections.bard");
    } else {
      titleSegment = tSeo("title").split("|")[0].trim();
    }

    const seoPage =
      section === "most-sold"
        ? seoPages?.most_sold_products
        : section === "rathath"
          ? seoPages?.razar_products ?? seoPages?.brand_product
          : section === "bard"
            ? seoPages?.brad ?? seoPages?.brand_product
            : section === "accessories"
              ? seoPages?.accessory_products
              : seoPages?.products;

    return generateSeoMetadata({
      title:
        seoPage?.meta_title ||
        `${titleSegment} | ${tSeo("title").split("|")[1]?.trim() || "Sohar"}`,
      description: seoPage?.meta_description || tSeo("description"),
      lang,
      path: "/products-list",
    });
  } catch (error) {
    console.error("Error in products-list metadata:", error);
    return generateSeoMetadata({
      title: tSeo("title"),
      description: tSeo("description"),
      lang,
      path: "/products-list",
    });
  }
}

/**
 * Products List Page - RSC (Server Component)
 */
export default async function ProductsListPage({ params, searchParams }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const searchValues = await searchParams;
  const section = (searchValues.section as string) || "most-sold";
  const sizeId = searchValues.size_id as string;
  const sizeIds = sizeId ? sizeId.split(",").map(Number) : [];
  const tSeo = await getTranslations({ locale: lang, namespace: "seo.products" });
  const tProducts = await getTranslations({ locale: lang, namespace: "products" });

  const queryClient = makeQueryClient();
  
  // Prefetch based on the active section to avoid unneeded server requests
  if (section === "most-sold") {
    await queryClient.prefetchQuery({ queryKey: productKeys.bestSelling(), queryFn: fetchBestSellingProducts });
  } else if (section === "rathath") {
    await queryClient.prefetchQuery({ queryKey: [...productKeys.brand("rathath"), sizeIds], queryFn: () => fetchBrandProducts("rathath", sizeIds) });
  } else if (section === "bard") {
    await queryClient.prefetchQuery({ queryKey: [...productKeys.brand("bard"), sizeIds], queryFn: () => fetchBrandProducts("bard", sizeIds) });
  } else if (section === "accessories") {
    await queryClient.prefetchQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories });
  }

  const products =
    section === "most-sold"
      ? ((queryClient.getQueryData(productKeys.bestSelling()) ?? []) as Product[])
      : section === "rathath"
        ? ((queryClient.getQueryData([...productKeys.brand("rathath"), sizeIds]) ?? []) as Product[])
        : section === "bard"
          ? ((queryClient.getQueryData([...productKeys.brand("bard"), sizeIds]) ?? []) as Product[])
          : section === "accessories"
            ? ((queryClient.getQueryData(productKeys.accessories()) ?? []) as Product[])
            : [];

  const titleSegment =
    section === "most-sold"
      ? tProducts("mostSold")
      : section === "rathath"
        ? tProducts("sections.rathath")
        : section === "bard"
          ? tProducts("sections.bard")
          : tSeo("title").split("|")[0].trim();

  const jsonLd = buildProductsListJsonLd({
    lang,
    section,
    sizeId,
    title: `${titleSegment} | ${tSeo("title").split("|")[1]?.trim() || "Sohar"}`,
    description: tSeo("description"),
    products,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductsListPageContent />
    </HydrationBoundary>
  );
}
