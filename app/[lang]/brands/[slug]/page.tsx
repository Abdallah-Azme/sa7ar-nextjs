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
import type { Product } from "@/types";

type BrandSlug = "bard" | "rathath";

const BRAND_COPY: Record<BrandSlug, { title: string; seoKey: "bard" | "rathath" }> = {
  bard: { title: "Bard", seoKey: "bard" },
  rathath: { title: "Rathath", seoKey: "rathath" },
};

interface Props {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function buildBrandProductsJsonLd({
  lang,
  brand,
  page,
  title,
  description,
  products,
}: {
  lang: string;
  brand: BrandSlug;
  page: number;
  title: string;
  description: string;
  products: Product[];
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const listPath = lang === "ar" ? `/brands/${brand}` : `/${lang}/brands/${brand}`;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const brand = BRAND_COPY[slug as BrandSlug];
  const t = await getTranslations({ locale: lang, namespace: "seo.brands" });
  const seoSettings = await fetchSeoSettings();
  const seoPages = seoSettings?.pages;
  const seoPage =
    slug === "rathath"
      ? seoPages?.razar_products ?? seoPages?.brand_product
      : slug === "bard"
        ? seoPages?.brad ?? seoPages?.brand_product
        : seoPages?.brand_product;



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

  const tSeo = await getTranslations({ locale: lang, namespace: "seo.brands" });
  const productsResponse = await queryClient.ensureQueryData({
    queryKey: productKeys.brandPaged(brand, page),
    queryFn: () => fetchBrandProductsPaginated(brand, page),
  });

  const pageTitle = `${BRAND_COPY[brand].title} | ${tSeo("title")}`;
  const jsonLd = buildBrandProductsJsonLd({
    lang,
    brand,
    page,
    title: pageTitle,
    description: tSeo("description"),
    products: productsResponse.products,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PaginatedProductsPageContent
        source="brand"
        brand={brand}
        titleKey={`brandProductsPage.${brand}`}
      />
    </HydrationBoundary>
  );
}
