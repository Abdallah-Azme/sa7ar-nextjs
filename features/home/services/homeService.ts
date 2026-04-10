import apiClient from "@/lib/apiClient";
import type { HomeResponse } from "@/features/home/types";

export const homeKeys = {
  all: ["home"] as const,
  data: () => [...homeKeys.all, "data"] as const,
  faqs: () => [...homeKeys.all, "faqs"] as const,
};

export async function fetchHomeData(): Promise<HomeResponse | null> {
  try {
    const res = await apiClient<{
      data: HomeResponse & { home_sliders?: HomeResponse["sliders"] };
    }>({
      route: "/home",
    });
    const data = res.data;
    if (!data) return null;

    return {
      ...data,
      // Backend can send either sliders or home_sliders depending on API version.
      sliders: data.sliders ?? data.home_sliders ?? [],
    };
  } catch (e) {
    console.error("[homeService] fetchHomeData:", e);
    return null;
  }
}

export async function fetchFaqs() {
  try {
    const res = await apiClient<{ data: { id: number; question: string; answer: string }[] }>({
      route: "/faqs",
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}
