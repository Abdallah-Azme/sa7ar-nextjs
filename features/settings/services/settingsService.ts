import apiClient from "@/lib/apiClient";

export interface SettingResponse {
	app_title: string;
	app_logo: string;
	footer_text: string;
	about_us_title: string;
	about_us_description: string;
	about_us_first_image: string;
	email: string;
	whatsapp: string;
	tiktok: string;
	snapchat: string;
	instagram: string;
	facebook: string;
	x: string;
	meta_title: string | null;
	meta_description: string | null;
  address: string;
  apple_store_link: string | null;
  google_play_link: string | null;
}

export const settingsKeys = {
  all: ["settings"] as const,
  global: () => [...settingsKeys.all, "global"] as const,
};

export async function fetchGlobalSettings() {
  try {
    const res = await apiClient<{ data: SettingResponse }>({
      route: "/settings",
      next: { revalidate: 3600 },
    });
    return (res as unknown as { data: SettingResponse }).data ?? null;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    return null;
  }
}
