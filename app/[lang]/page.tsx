import { getHomeData, getFaqData } from "@/features/home/queries";
import { getGlobalSettings } from "@/features/settings/queries";
import { getBestSellingAccessories } from "@/features/products/queries";
import Hero from "@/features/home/components/Hero";
import About from "@/features/home/components/About";
import Products from "@/features/home/components/Products";
import Partners from "@/features/home/components/Partners";
import Mobile from "@/features/home/components/Mobile";
import RequestPartnership from "@/features/home/components/RequestPartnership";
import FAQ from "@/features/home/components/FAQ";
import BestSellingAccessories from "@/features/home/components/BestSellingAccessories";
import type { Metadata } from "next";

import { generateSeoMetadata } from "@/lib/seo";

/**
 * Dynamic SEO metadata for Home Page
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const setting = await getGlobalSettings();
  const title = setting?.meta_title || "Sohar Water | مياه صحار";
  const description = setting?.meta_description || "Premium natural water from Sohar, Oman.";

  return generateSeoMetadata({
    title,
    description,
    lang,
    path: "/",
    image: setting?.app_logo,
  });
}

/**
 * Home Page - RSC (Server Component)
 * The main landing entry point of sa7ar-next.
 * Implements full Server-First architecture with pre-fetched data.
 */
export default async function HomePage() {
  // 1. Parallel data fetching for best performance
  const [homeData, settings, faqs, accessories] = await Promise.all([
    getHomeData(),
    getGlobalSettings(),
    getFaqData(),
    getBestSellingAccessories(),
  ]);

  return (
    <div className="flex flex-col gap-20 pb-20">
      
      {/* 1. Hero Section */}
      <Hero 
        sliders={homeData?.sliders} 
        appleStoreLink={settings?.apple_store_link}
        googlePlayLink={settings?.google_play_link}
        whatsappNumber={settings?.whatsapp}
      />

      {/* 2. About Us Section */}
      <About />

      {/* 3. Products Section (Most Sold) */}
      <Products 
        title="الأكثر مبيعاً" 
        mostSold={homeData?.most_sold_products} 
        queryKey="most-sold"
      />

      {/* 4. Best Selling Accessories Section */}
      <BestSellingAccessories accessories={accessories} />

      {/* 5. Partners Showcase */}
      <Partners />

      {/* 6. Mobile App CTA */}
      <Mobile 
        appleStoreLink={settings?.apple_store_link}
        googlePlayLink={settings?.google_play_link}
      />

      {/* 7. B2B Partnership CTA */}
      <RequestPartnership />

      {/* 8. FAQ Section */}
      <FAQ faqs={faqs} isSection={true} />

    </div>
  );
}
