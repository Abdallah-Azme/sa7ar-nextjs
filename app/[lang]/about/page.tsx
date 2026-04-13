import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchAboutPageData, aboutKeys } from "@/features/about/services/aboutService";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import AboutPageContent from "@/features/about/components/AboutPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";

import { getCmsPage } from "@/features/about/queries/cms";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.about" });
  const pageData = await getCmsPage(1); // About Us page ID is 1

  return generateSeoMetadata({
    title: pageData?.seo?.meta_title || pageData?.name || t("title"),
    description: pageData?.seo?.meta_description || t("description"),
    keywords: pageData?.seo?.meta_keywords,
    lang,
    path: "/about",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "seo.about" });

  const queryClient = makeQueryClient();
  
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
