import type { Product } from "@/types";
import { getPublicApiBaseUrl } from "@/lib/apiBase";

const API_BASE = getPublicApiBaseUrl();

export const PAGE_ROUTES = [
  "",
  "/products",
  "/products-list",
  "/about",
  "/faq",
  "/blogs",
  "/contact",
  "/business-partnerships",
  "/privacy",
  "/terms",
  "/brands",
  "/best-selling-products",
  "/best-selling-accessories",
] as const;

type ApiResponse<T> = { data?: T };
type SlugItem = { id: number; slug: string; locale?: "ar" | "en" };
type SlugsGrouped = {
  products?: SlugItem[];
  pages?: SlugItem[];
  brands?: SlugItem[];
  blogs?: SlugItem[];
};
type SlugsApiResponse = {
  data?: {
    grouped?: SlugsGrouped;
  };
};

async function fetchJson<T>(route: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${route}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error: any) {
    console.error(`[fetchJson] Failed to fetch ${route}:`, error.message);
    return null;
  }
}

function sanitizeSlug(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  return encodeURIComponent(value);
}

function uniquePaths(paths: string[]): string[] {
  return Array.from(new Set(paths));
}

function collectProductPathsFromList(products: Product[] | undefined): string[] {
  if (!products?.length) return [];
  return products
    .map((product) => {
      const slug = product?.seo?.slug?.trim();
      if (slug) return `/products/${slug}`;
      if (product?.id) return `/products/${product.id}`;
      return null;
    })
    .filter((path): path is string => Boolean(path));
}

export async function getDynamicProductPaths(): Promise<string[]> {
  const [home, bestSelling, accessories, bard, rathath] = await Promise.all([
    fetchJson<ApiResponse<{ most_sold_products?: Product[]; most_ordered_products?: Product[] }>>("/home"),
    fetchJson<ApiResponse<Product[]>>("/products/best-selling"),
    fetchJson<ApiResponse<Product[]>>("/products-accessories"),
    fetchJson<ApiResponse<Product[]>>("/brands/bard/products"),
    fetchJson<ApiResponse<Product[]>>("/brands/rathath/products"),
  ]);

  const all = [
    ...collectProductPathsFromList(home?.data?.most_sold_products),
    ...collectProductPathsFromList(home?.data?.most_ordered_products),
    ...collectProductPathsFromList(bestSelling?.data),
    ...collectProductPathsFromList(accessories?.data),
    ...collectProductPathsFromList(bard?.data),
    ...collectProductPathsFromList(rathath?.data),
  ];

  return uniquePaths(all);
}

async function getGroupedSlugs(): Promise<SlugsGrouped> {
  const response = await fetchJson<SlugsApiResponse>("/slugs");
  return response?.data?.grouped ?? {};
}

export async function getDynamicProductSlugPaths(): Promise<string[]> {
  const grouped = await getGroupedSlugs();
  const productPaths = (grouped.products ?? [])
    .map((item) => sanitizeSlug(item.slug))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/products/${slug}`);

  return uniquePaths(productPaths);
}

export async function getDynamicPageLikePaths(locale: "ar" | "en"): Promise<string[]> {
  const grouped = await getGroupedSlugs();

  const brandPaths = (grouped.brands ?? [])
    .map((item) => sanitizeSlug(item.slug))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/brands/${slug}`);

  const blogPaths = (grouped.blogs ?? [])
    .filter((item) => !item.locale || item.locale === locale)
    .map((item) => sanitizeSlug(item.slug))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/blogs/${slug}`);

  return uniquePaths([...brandPaths, ...blogPaths]);
}

export function withLocalePath(route: string, locale: "ar" | "en"): string {
  if (!route) return locale === "ar" ? "/" : "/en";
  return locale === "ar" ? route : `/en${route}`;
}
