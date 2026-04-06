import apiClient from "@/lib/apiClient";
import { Facebook, Instagram, Snapchat, Tiktok, Whatsapp, X } from "@/components/icons/SocialIcons";

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

/**
 * Server-side function to fetch global settings
 * Uses Next.js caching (force-cache or revalidate)
 */
export async function getGlobalSettings() {
  try {
    const res = await apiClient<SettingResponse>({
      route: "/settings",
      // Caching for 1 hour by default
      next: { revalidate: 3600 }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    return null;
  }
}

/**
 * Helper to get social media links with icons
 */
export function getSocialLinks(settings: SettingResponse | null) {
  if (!settings) return [];
  return [
		{ id: 1, name: "facebook", url: settings.facebook, Icon: Facebook },
		{ id: 2, name: "instagram", url: settings.instagram, Icon: Instagram },
		{ id: 3, name: "tiktok", url: settings.tiktok, Icon: Tiktok },
		{ id: 4, name: "x", url: settings.x, Icon: X },
		{ id: 5, name: "whatsapp", url: settings.whatsapp, Icon: Whatsapp },
		{ id: 6, name: "snapchat", url: settings.snapchat, Icon: Snapchat },
	].filter(link => !!link.url);
}
