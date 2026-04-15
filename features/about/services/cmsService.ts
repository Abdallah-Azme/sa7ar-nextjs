import apiClient from "@/lib/apiClient";
import { CmsPage } from "../queries/cms";

export const cmsKeys = {
  all: ["cms"] as const,
  detail: (id: string | number) => [...cmsKeys.all, "detail", String(id)] as const,
  pages: () => [...cmsKeys.all, "pages"] as const,
};

export type CmsPageKey = "about_us" | "terms_and_conditions" | "privacy_policy";

export const CMS_PAGE_FALLBACK_PATHS: Record<CmsPageKey, string> = {
  about_us: "/about",
  terms_and_conditions: "/terms",
  privacy_policy: "/privacy",
};

export async function fetchCmsPage(id: string | number) {
  const res = await apiClient<{ data: CmsPage }>({
    route: `/pages?page_id=${id}`,
    next: { revalidate: 86400 },
  });
  return res.data;
}

export async function fetchCmsPages() {
  const res = await apiClient<{ data: CmsPage[] }>({
    route: "/pages",
    next: { revalidate: 86400 },
  });
  return res.data;
}

export function getCmsPagePathByKey(
  pages: CmsPage[] | undefined,
  key: CmsPageKey,
): string {
  const fallbackPath = CMS_PAGE_FALLBACK_PATHS[key];
  const slug = pages?.find((page) => page.key === key)?.seo?.slug?.trim();
  if (!slug) return fallbackPath;
  return `/${slug.replace(/^\/+/, "")}`;
}
