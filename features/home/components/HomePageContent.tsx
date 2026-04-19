"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

import { useQuery } from "@tanstack/react-query";
import { homeKeys, fetchHomeData, fetchFaqs } from "../services/homeService";
import {
  settingsKeys,
  fetchGlobalSettings,
} from "@/features/settings/services/settingsService";
import {
  productKeys,
  fetchBestSellingAccessories,
} from "@/features/products/services/productService";

import Hero from "./Hero";
import Products from "./Products";
const About = dynamic(() => import("./About"));
const Partners = dynamic(() => import("./Partners"), {
  ssr: false,
  loading: () => null,
});
const Mobile = dynamic(() => import("./Mobile"), {
  ssr: false,
  loading: () => null,
});
const RequestPartnership = dynamic(() => import("./RequestPartnership"), {
  ssr: false,
  loading: () => null,
});
const FAQ = dynamic(() => import("./FAQ"), { ssr: false, loading: () => null });
const BestSellingAccessories = dynamic(
  () => import("./BestSellingAccessories"),
  { ssr: false, loading: () => null },
);

export default function HomePageContent() {
  const t = useTranslations("products");
  const tCheckout = useTranslations("account.checkout");
  const { refreshCart } = useCart();
  const searchParams = useSearchParams();
  const [deferBelowFold, setDeferBelowFold] = useState(false);
  // Check for payment success params
  useEffect(() => {
    if (searchParams.get("status") === "success" || searchParams.get("session_id")) {
      import("sonner").then(({ toast }) => {
        toast.success(tCheckout("success"));
      });
      refreshCart();
      // Clean up URL to avoid repeated toasts on refresh
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams, tCheckout, refreshCart]);

  useEffect(() => {
    // Defer non-critical sections to reduce initial main-thread work (TBT)
    const ric = (
      window as Window & { requestIdleCallback?: (cb: () => void) => number }
    ).requestIdleCallback;
    if (ric) {
      ric(() => setDeferBelowFold(true));
      return;
    }
    const timer = window.setTimeout(() => setDeferBelowFold(true), 900);
    return () => window.clearTimeout(timer);
  }, []);
  // useQuery reads from the pre-seeded cache — NO network request on first render
  const { data: homeData } = useQuery({
    queryKey: homeKeys.data(),
    queryFn: fetchHomeData,
  });

  
  const { data: settings } = useQuery({
    queryKey: settingsKeys.global(),
    queryFn: fetchGlobalSettings,
  });
  const { data: faqs } = useQuery({
    queryKey: homeKeys.faqs(),
    queryFn: fetchFaqs,
  });
  const { data: accessories } = useQuery({
    queryKey: productKeys.accessories(),
    queryFn: fetchBestSellingAccessories,
  });

   return (
    <div className="flex flex-col gap-20 pb-20">
      {/* 1. Hero Section */}
      <Hero
        sliders={homeData?.sliders ?? homeData?.home_sliders}
        appleStoreLink={settings?.apple_store_link}
        googlePlayLink={settings?.google_play_link}
        whatsappNumber={settings?.whatsapp}
      />

      {/* 2. About Us Section */}
      <About />

      {/* 3. Products Section (Most Sold) */}
      <Products
        title={t("mostSold")}
        mostSold={homeData?.most_sold_products}
        queryKey="most-sold"
      />

      {/* 4. Best Selling Accessories Section */}
      {deferBelowFold ? (
        <>
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
        </>
      ) : (
        <div className="container h-24" aria-hidden="true" />
      )}
    </div>
  );
}
