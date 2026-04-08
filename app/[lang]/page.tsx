import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchHomeData, fetchFaqs, homeKeys } from "@/features/home/services/homeService";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import { fetchBestSellingAccessories, productKeys } from "@/features/products/services/productService";
import HomePageContent from "@/features/home/components/HomePageContent";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.home" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
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

  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: homeKeys.data(), queryFn: fetchHomeData }),
    queryClient.prefetchQuery({ queryKey: settingsKeys.global(), queryFn: fetchGlobalSettings }),
    queryClient.prefetchQuery({ queryKey: homeKeys.faqs(), queryFn: fetchFaqs }),
    queryClient.prefetchQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageContent />
    </HydrationBoundary>
  );
}
