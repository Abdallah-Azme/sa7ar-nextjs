import apiClient from "@/lib/apiClient";
import { CmsPage } from "../queries/cms";

export const cmsKeys = {
  all: ["cms"] as const,
  detail: (id: string | number) => [...cmsKeys.all, "detail", String(id)] as const,
};

export async function fetchCmsPage(id: string | number) {
  const res = await apiClient<{ data: CmsPage }>({
    route: `/pages?page_id=${id}`,
    next: { revalidate: 86400 },
  });
  return res.data;
}
