import apiClient from "@/lib/apiClient";
import type { HomeResponse } from "@/features/home/types";

export const homeKeys = {
  all: ["home"] as const,
  data: () => [...homeKeys.all, "data"] as const,
  faqs: () => [...homeKeys.all, "faqs"] as const,
};

export async function fetchHomeData(): Promise<HomeResponse | null> {
  try {
    const res = await apiClient<{ data: HomeResponse }>({
      route: "/home",
      next: { revalidate: 3600 },
    });
    return res.data ?? null;
  } catch (e) {
    console.error("[homeService] fetchHomeData:", e);
    return null;
  }
}

export async function fetchFaqs() {
  try {
    const res = await apiClient<{ data: { id: number; question: string; answer: string }[] }>({
      route: "/faqs",
      next: { revalidate: 3600 },
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}
