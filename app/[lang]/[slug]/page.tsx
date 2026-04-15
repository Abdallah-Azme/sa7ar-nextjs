import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { makeQueryClient } from "@/lib/queryClient";
import { generateSeoMetadata } from "@/lib/seo";
import AboutPageContent from "@/features/about/components/AboutPageContent";
import CmsPageContent from "@/features/about/components/CmsPageContent";
import HelpCard from "@/components/shared/cards/HelpCard";
import { fetchAboutPageData, aboutKeys } from "@/features/about/services/aboutService";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import { fetchCmsPage, fetchCmsPages, cmsKeys } from "@/features/about/services/cmsService";
import { getCmsSeoMetadataInput } from "@/features/about/queries/cms";

type CmsKey = "about_us" | "terms_and_conditions" | "privacy_policy";
type CmsRouteConfig = {
  key: CmsKey;
  seoNamespace: "seo.about" | "seo.terms" | "seo.privacy";
  seoFallbackPath: string;
  contentNamespace: "seo.about" | "termsPage" | "privacyPage";
  iconType?: "terms" | "privacy";
};

const CMS_ROUTE_CONFIGS: CmsRouteConfig[] = [
  {
    key: "about_us",
    seoNamespace: "seo.about",
    seoFallbackPath: "/about",
    contentNamespace: "seo.about",
  },
  {
    key: "terms_and_conditions",
    seoNamespace: "seo.terms",
    seoFallbackPath: "/terms",
    contentNamespace: "termsPage",
    iconType: "terms",
  },
  {
    key: "privacy_policy",
    seoNamespace: "seo.privacy",
    seoFallbackPath: "/privacy",
    contentNamespace: "privacyPage",
    iconType: "privacy",
  },
];

async function getCmsSlugConfig(slug: string) {
  const pages = await fetchCmsPages().catch(() => []);
  const matchedPage = pages.find((page) => page.seo?.slug?.trim() === slug);
  if (!matchedPage) return null;

  const config = CMS_ROUTE_CONFIGS.find((item) => item.key === matchedPage.key);
  if (!config) return null;

  return { config, page: matchedPage };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const resolved = await getCmsSlugConfig(slug);
  if (!resolved) return {};

  const t = await getTranslations({ locale: lang, namespace: resolved.config.seoNamespace });
  const seo = getCmsSeoMetadataInput(resolved.page, {
    title: t("title"),
    description: t("description"),
    path: resolved.config.seoFallbackPath,
  });

  return generateSeoMetadata({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    lang,
    path: seo.path,
    image: seo.image,
  });
}

export default async function CmsSlugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const resolved = await getCmsSlugConfig(slug);
  if (!resolved) notFound();

  const { config, page } = resolved;
  const queryClient = makeQueryClient();

  if (config.key === "about_us") {
    const t = await getTranslations({ locale: lang, namespace: "seo.about" });

    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: aboutKeys.pageData(),
        queryFn: fetchAboutPageData,
      }),
      queryClient.prefetchQuery({
        queryKey: settingsKeys.global(),
        queryFn: fetchGlobalSettings,
      }),
    ]);

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h1 className="sr-only">{t("title")}</h1>
        <AboutPageContent />
      </HydrationBoundary>
    );
  }

  const t = await getTranslations({ locale: lang, namespace: config.contentNamespace });

  await queryClient.prefetchQuery({
    queryKey: cmsKeys.detail(page.id),
    queryFn: () => fetchCmsPage(page.id),
  });

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden bg-white/50">
      <div className="absolute top-1/2 inset-s-0 -z-1 size-[600px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 inset-e-0 -z-1 size-[500px] bg-secondary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4" />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CmsPageContent
          id={page.id}
          title={t("title")}
          subtitle={t("subtitle")}
          iconType={config.iconType!}
        />
      </HydrationBoundary>

      <HelpCard className="py-20 bg-background-cu/30" />
    </main>
  );
}
