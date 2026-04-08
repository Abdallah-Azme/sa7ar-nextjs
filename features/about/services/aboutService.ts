import apiClient from "@/lib/apiClient";
import { AboutPageData } from "../queries";

export const aboutKeys = {
  all: ["about"] as const,
  pageData: () => [...aboutKeys.all, "pageData"] as const,
};

export async function fetchAboutPageData() {
  const res = await apiClient<{ data: AboutPageData }>({
    route: "/about-us",
    next: { revalidate: 3600 },
  });
  return res.data;
}
