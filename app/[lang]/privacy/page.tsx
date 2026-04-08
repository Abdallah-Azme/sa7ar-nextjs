import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchCmsPage, cmsKeys } from "@/features/about/services/cmsService";
import CmsPageContent from "@/features/about/components/CmsPageContent";
import HelpCard from "@/components/shared/cards/HelpCard";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const PRIVACY_PAGE_ID = 3;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.privacy" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("privacyPage");

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: cmsKeys.detail(PRIVACY_PAGE_ID),
    queryFn: () => fetchCmsPage(PRIVACY_PAGE_ID),
  });

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden bg-white/50">
      <div className="absolute top-1/2 inset-s-0 -z-1 size-[600px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 inset-e-0 -z-1 size-[500px] bg-secondary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4" />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CmsPageContent 
          id={PRIVACY_PAGE_ID} 
          title={t("title")}
          subtitle={t("subtitle")}
          iconType="privacy"
        />
      </HydrationBoundary>

      <HelpCard className="py-20 bg-background-cu/30" />
    </main>
  );
}
