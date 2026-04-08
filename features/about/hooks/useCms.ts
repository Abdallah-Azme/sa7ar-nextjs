import { useQuery } from "@tanstack/react-query";
import { fetchCmsPage, cmsKeys } from "../services/cmsService";

export function useCmsPageQuery(id: string | number) {
  return useQuery({
    queryKey: cmsKeys.detail(id),
    queryFn: () => fetchCmsPage(id),
    enabled: !!id,
  });
}
