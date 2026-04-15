import { useQuery } from "@tanstack/react-query";
import { fetchCmsPage, fetchCmsPages, cmsKeys } from "../services/cmsService";

export function useCmsPageQuery(id: string | number) {
  return useQuery({
    queryKey: cmsKeys.detail(id),
    queryFn: () => fetchCmsPage(id),
    enabled: !!id,
  });
}

export function useCmsPagesQuery() {
  return useQuery({
    queryKey: cmsKeys.pages(),
    queryFn: fetchCmsPages,
  });
}
