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
  whatsapp_follow?: string | null;
  tiktok_follow?: string | null;
  snapchat_follow?: string | null;
  instagram_follow?: string | null;
  facebook_follow?: string | null;
  x_follow?: string | null;
  social_links?: {
    whatsapp?: { url?: string | null; rel?: string | null };
    tiktok?: { url?: string | null; rel?: string | null };
    snapchat?: { url?: string | null; rel?: string | null };
    instagram?: { url?: string | null; rel?: string | null };
    facebook?: { url?: string | null; rel?: string | null };
    x?: { url?: string | null; rel?: string | null };
  };
	meta_title: string | null;
	meta_description: string | null;
  address: string;
  apple_store_link: string | null;
  google_play_link: string | null;
}

export interface SeoPageMetadata {
  meta_title: string | null;
  meta_description: string | null;
}

export interface SeoSettingsResponse {
  seo: {
    title: string | null;
    description: string | null;
    canonical_url: string | null;
    robots: string | null;
    alternates: string[];
  };
  open_graph: {
    og_title: string | null;
    og_description: string | null;
    og_type: string | null;
    og_url: string | null;
    og_image: string | null;
    og_image_alt: string | null;
    og_site_name: string | null;
  };
  twitter: {
    twitter_card: string | null;
    twitter_site: string | null;
    twitter_creator: string | null;
    twitter_title: string | null;
    twitter_description: string | null;
    twitter_image: string | null;
  };
  structured_data: unknown[];
  pages: {
    products?: SeoPageMetadata;
    brand_product?: SeoPageMetadata;
    razar_products?: SeoPageMetadata;
    accessory_products?: SeoPageMetadata;
    blog?: SeoPageMetadata;
    [key: string]: SeoPageMetadata | undefined;
  };
}

export const settingsKeys = {
  all: ["settings"] as const,
  global: () => [...settingsKeys.all, "global"] as const,
};

export async function fetchGlobalSettings() {
  try {
    const res = await apiClient<{ data: SettingResponse }>({
      route: "/settings",
    });
    return (res as unknown as { data: SettingResponse }).data ?? null;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    return null;
  }
}

export async function fetchSeoSettings() {
  try {
    const res = await apiClient<{ data: SeoSettingsResponse }>({
      route: "/settings/seo",
      next: { revalidate: 300 },
    });
    return (res as unknown as { data: SeoSettingsResponse }).data ?? null;
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return null;
  }
}
