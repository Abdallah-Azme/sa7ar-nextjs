import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchHomeData, fetchFaqs, homeKeys } from "@/features/home/services/homeService";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import { fetchBestSellingAccessories, productKeys } from "@/features/products/services/productService";
import HomePageContent from "@/features/home/components/HomePageContent";
import { setRequestLocale } from "next-intl/server";

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

  // 1. Parallel prefetching to seed the server-side cache
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: homeKeys.data(),    queryFn: fetchHomeData }),
    queryClient.prefetchQuery({ queryKey: settingsKeys.global(), queryFn: fetchGlobalSettings }),
    queryClient.prefetchQuery({ queryKey: homeKeys.faqs(),    queryFn: fetchFaqs }),
    queryClient.prefetchQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageContent />
    </HydrationBoundary>
  );
}
