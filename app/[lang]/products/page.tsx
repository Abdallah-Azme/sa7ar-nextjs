import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { 
    fetchBestSellingProducts, 
    fetchBrandSizes, 
    fetchBrandProducts, 
    fetchBestSellingAccessories, 
    productKeys 
} from "@/features/products/services/productService";
import ProductsPageContent from "@/features/products/components/ProductsPageContent";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { fetchSeoSettings } from "@/features/settings/services/settingsService";
import type { Product } from "@/types";

function buildProductsPageJsonLd({
  lang,
  pageTitle,
  pageDescription,
  products,
}: {
  lang: string;
  pageTitle: string;
  pageDescription: string;
  products: Product[];
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const productsPath = lang === "ar" ? "/products" : `/${lang}/products`;
  const pageUrl = new URL(productsPath, baseUrl).toString();

  const uniqueProducts = Array.from(new Map(products.map((product) => [product.id, product])).values());

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      name: pageTitle,
      numberOfItems: uniqueProducts.length,
      itemListElement: uniqueProducts.map((product, index) => {
        const slug = product.seo?.slug || String(product.id);
        const productPath = lang === "ar" ? `/products/${slug}` : `/${lang}/products/${slug}`;
        const price =
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
              price: typeof price === "number" ? price.toFixed(2) : undefined,
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
  const t = await getTranslations({ locale: lang, namespace: "seo.products" });
  const seoSettings = await fetchSeoSettings();
  const seoPage = seoSettings?.pages?.products;

  return generateSeoMetadata({
    title: seoPage?.meta_title || t("title"),
    description: seoPage?.meta_description || t("description"),
    lang,
    path: "/products",
  });
}

/**
 * Products Page - RSC (Server Component)
 * Secondary most visited page showing brand-specific collections with size filtering.
 */
export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "seo.products" });

  const queryClient = makeQueryClient();

  // 1. Parallel data prefetching for all sections
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: productKeys.bestSelling(),         queryFn: fetchBestSellingProducts }),
    queryClient.prefetchQuery({ queryKey: productKeys.brandSizes("bard"),    queryFn: () => fetchBrandSizes("bard") }),
    queryClient.prefetchQuery({ queryKey: productKeys.brandSizes("rathath"), queryFn: () => fetchBrandSizes("rathath") }),
    queryClient.prefetchQuery({ queryKey: productKeys.brand("bard"),         queryFn: () => fetchBrandProducts("bard") }),
    queryClient.prefetchQuery({ queryKey: productKeys.brand("rathath"),      queryFn: () => fetchBrandProducts("rathath") }),
    queryClient.prefetchQuery({ queryKey: productKeys.accessories(),         queryFn: fetchBestSellingAccessories }),
  ]);

  const bestSellers = (queryClient.getQueryData(productKeys.bestSelling()) ?? []) as Product[];
  const bardProducts = (queryClient.getQueryData(productKeys.brand("bard")) ?? []) as Product[];
  const rathathProducts = (queryClient.getQueryData(productKeys.brand("rathath")) ?? []) as Product[];
  const accessories = (queryClient.getQueryData(productKeys.accessories()) ?? []) as Product[];

  const jsonLd = buildProductsPageJsonLd({
    lang,
    pageTitle: t("title"),
    pageDescription: t("description"),
    products: [...bestSellers, ...bardProducts, ...rathathProducts, ...accessories],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className="sr-only">{t("title")}</h1>
      <ProductsPageContent />
    </HydrationBoundary>
  );
}
