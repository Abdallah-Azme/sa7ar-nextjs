import { useQuery } from "@tanstack/react-query";
import { fetchAboutPageData, aboutKeys } from "../services/aboutService";

export function useAboutDataQuery() {
  return useQuery({
    queryKey: aboutKeys.pageData(),
    queryFn: fetchAboutPageData,
  });
}
