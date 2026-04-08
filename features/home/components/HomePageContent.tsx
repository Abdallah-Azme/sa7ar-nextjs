"use client";

import { useQuery } from "@tanstack/react-query";
import { homeKeys, fetchHomeData, fetchFaqs } from "../services/homeService";
import { settingsKeys, fetchGlobalSettings } from "@/features/settings/services/settingsService";
import { productKeys, fetchBestSellingAccessories } from "@/features/products/services/productService";

import Hero from "./Hero";
import About from "./About";
import Products from "./Products";
import Partners from "./Partners";
import Mobile from "./Mobile";
import RequestPartnership from "./RequestPartnership";
import FAQ from "./FAQ";
import BestSellingAccessories from "./BestSellingAccessories";

export default function HomePageContent() {
  // useQuery reads from the pre-seeded cache — NO network request on first render
  const { data: homeData }    = useQuery({ queryKey: homeKeys.data(),    queryFn: fetchHomeData });
  const { data: settings }    = useQuery({ queryKey: settingsKeys.global(), queryFn: fetchGlobalSettings });
  const { data: faqs }        = useQuery({ queryKey: homeKeys.faqs(),    queryFn: fetchFaqs });
  const { data: accessories } = useQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories });

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
      <BestSellingAccessories accessories={accessories ?? []} />

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
      <FAQ faqs={faqs ?? []} isSection={true} />
    </div>
  );
}
