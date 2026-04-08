export * from "./services/settingsService";
import { fetchGlobalSettings, type SettingResponse } from "./services/settingsService";
import { Facebook, Instagram, Snapchat, Tiktok, Whatsapp, X } from "@/components/icons/SocialIcons";

/**
 * Deprecated: Use fetchGlobalSettings or the useSettings hook instead.
 */
export const getGlobalSettings = fetchGlobalSettings;

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
