import { useQuery } from "@tanstack/react-query";
import { fetchInstitutionTypes, partnershipKeys } from "../services/partnershipService";

export function useInstitutionTypesQuery() {
  return useQuery({
    queryKey: partnershipKeys.types(),
    queryFn: fetchInstitutionTypes,
  });
}
