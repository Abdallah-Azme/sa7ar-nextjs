import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import {
  fetchHomeData,
  fetchFaqs,
  homeKeys,
} from "@/features/home/services/homeService";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import { fetchBestSellingAccessories, productKeys } from "@/features/products/services/productService";
import HomePageContent from "@/features/home/components/HomePageContent";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { fetchSeoSettings } from "@/features/settings/services/settingsService";
import type { SettingResponse } from "@/features/settings/services/settingsService";

function buildHomeJsonLd({
  lang,
  siteTitle,
  siteDescription,
  settings,
}: {
  lang: string;
  siteTitle: string;
  siteDescription: string;
  settings: SettingResponse | null;
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const homePath = lang === "ar" ? "/" : `/${lang}`;
  const homeUrl = new URL(homePath, baseUrl).toString();
  const logoUrl = settings?.app_logo
    ? new URL(settings.app_logo, baseUrl).toString()
    : undefined;

  const sameAs = [
    settings?.social_links?.instagram?.url || settings?.instagram_follow || settings?.instagram,
    settings?.social_links?.facebook?.url || settings?.facebook_follow || settings?.facebook,
    settings?.social_links?.x?.url || settings?.x_follow || settings?.x,
    settings?.social_links?.tiktok?.url || settings?.tiktok_follow || settings?.tiktok,
    settings?.social_links?.snapchat?.url || settings?.snapchat_follow || settings?.snapchat,
    settings?.social_links?.whatsapp?.url || settings?.whatsapp_follow || settings?.whatsapp,
  ].filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        url: baseUrl,
        name: siteTitle,
        description: siteDescription,
        inLanguage: lang,
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: settings?.app_title || siteTitle,
        url: baseUrl,
        logo: logoUrl
          ? {
              "@type": "ImageObject",
              url: logoUrl,
            }
          : undefined,
        sameAs: sameAs.length > 0 ? sameAs : undefined,
        email: settings?.email || undefined,
      },
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: siteTitle,
        description: siteDescription,
        isPartOf: {
          "@id": `${baseUrl}#website`,
        },
        about: {
          "@id": `${baseUrl}#organization`,
        },
        breadcrumb: {
          "@id": `${homeUrl}#breadcrumb`,
        },
        inLanguage: lang,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${homeUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteTitle,
            item: homeUrl,
          },
        ],
      },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.home" });
  const seoSettings = await fetchSeoSettings();
  const seoPage = seoSettings?.pages?.home;

  return generateSeoMetadata({
    title: seoPage?.meta_title || t("title"),
    description: seoPage?.meta_description || t("description"),
    lang,
    path: "/",
  });
}

/**
 * Home Page - RSC (Server Component)
 * The main landing entry point of sa7ar-next.
 * Implements full Server-First architecture with pre-fetched data.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "seo.home" });
  const seoSettings = await fetchSeoSettings();
  const siteTitle = seoSettings?.pages?.home?.meta_title || t("title");
  const siteDescription = seoSettings?.pages?.home?.meta_description || t("description");

  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: homeKeys.data(), queryFn: fetchHomeData }),
    queryClient.prefetchQuery({ queryKey: homeKeys.faqs(), queryFn: fetchFaqs }),
    queryClient.prefetchQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories }),
  ]);
  const settings = await queryClient.ensureQueryData({
    queryKey: settingsKeys.global(),
    queryFn: fetchGlobalSettings,
  });
  const jsonLd = buildHomeJsonLd({
    lang,
    siteTitle,
    siteDescription,
    settings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePageContent />
    </HydrationBoundary>
  );
}
