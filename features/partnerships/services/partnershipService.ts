import apiClient from "@/lib/apiClient";
import { InstitutionType } from "../queries";

export const partnershipKeys = {
  all: ["partnerships"] as const,
  types: () => [...partnershipKeys.all, "types"] as const,
};

export async function fetchInstitutionTypes() {
  const res = await apiClient<{ data: InstitutionType[] }>({
    route: "/institution-types",
    next: { revalidate: 86400 },
  });
  return res.data || [];
}
