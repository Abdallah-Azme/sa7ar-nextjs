import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchCmsPage, cmsKeys } from "@/features/about/services/cmsService";
import CmsPageContent from "@/features/about/components/CmsPageContent";
import HelpCard from "@/components/shared/cards/HelpCard";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

const TERMS_PAGE_ID = 2;

export const metadata: Metadata = {
  title: "Terms & Conditions | Sohar Water",
  description: "Review our service terms, conditions, and usage guidelines at Sohar Water.",
};

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: cmsKeys.detail(TERMS_PAGE_ID),
    queryFn: () => fetchCmsPage(TERMS_PAGE_ID),
  });

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden bg-white/50">
      <div className="absolute top-1/2 inset-s-0 -z-1 size-[600px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 inset-e-0 -z-1 size-[500px] bg-secondary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4" />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CmsPageContent 
          id={TERMS_PAGE_ID} 
          title="Terms & Conditions" 
          subtitle="By using our services, you agree to the guidelines listed below."
          iconType="terms"
        />
      </HydrationBoundary>

      <HelpCard className="py-20 bg-background-cu/30" />
    </main>
  );
}
