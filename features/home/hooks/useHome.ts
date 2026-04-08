import { useQuery } from "@tanstack/react-query";
import { fetchFaqs, homeKeys } from "../services/homeService";

export function useFaqsQuery() {
  return useQuery({
    queryKey: homeKeys.faqs(),
    queryFn: fetchFaqs,
  });
}
