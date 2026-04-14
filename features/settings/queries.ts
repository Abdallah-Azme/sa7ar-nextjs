export * from "./services/settingsService";
import { fetchGlobalSettings, type SettingResponse } from "./services/settingsService";
import { Facebook, Instagram, Snapchat, Tiktok, Whatsapp, X } from "@/components/icons/SocialIcons";

/**
 * Deprecated: Use fetchGlobalSettings or the useSettings hook instead.
 */
export const getGlobalSettings = fetchGlobalSettings;

function normalizeSocialRel(rel: string | null | undefined): "follow" | "nofollow" {
  return rel === "nofollow" ? "nofollow" : "follow";
}

/**
 * Helper to get social media links with icons
 */
export function getSocialLinks(settings: SettingResponse | null) {
  if (!settings) return [];
  return [
		{
      id: 1,
      name: "facebook",
      url: settings.facebook,
      rel: normalizeSocialRel(settings.social_links?.facebook?.rel ?? settings.facebook_follow),
      Icon: Facebook,
    },
		{
      id: 2,
      name: "instagram",
      url: settings.instagram,
      rel: normalizeSocialRel(settings.social_links?.instagram?.rel ?? settings.instagram_follow),
      Icon: Instagram,
    },
		{
      id: 3,
      name: "tiktok",
      url: settings.tiktok,
      rel: normalizeSocialRel(settings.social_links?.tiktok?.rel ?? settings.tiktok_follow),
      Icon: Tiktok,
    },
		{
      id: 4,
      name: "x",
      url: settings.x,
      rel: normalizeSocialRel(settings.social_links?.x?.rel ?? settings.x_follow),
      Icon: X,
    },
		{
      id: 5,
      name: "whatsapp",
      url: settings.whatsapp,
      rel: normalizeSocialRel(settings.social_links?.whatsapp?.rel ?? settings.whatsapp_follow),
      Icon: Whatsapp,
    },
		{
      id: 6,
      name: "snapchat",
      url: settings.snapchat,
      rel: normalizeSocialRel(settings.social_links?.snapchat?.rel ?? settings.snapchat_follow),
      Icon: Snapchat,
    },
	].filter(link => !!link.url);
}
