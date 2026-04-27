"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

import { useQuery } from "@tanstack/react-query";
import {
  homeKeys,
  fetchHomeData,
  fetchFaqs,
} from "../services/homeService";
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
import Rewards from "./Rewards";
import type { RewardsSectionData, QualityMarkSectionData } from "../types";
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
const QualityMark = dynamic(() => import("./QualityMark"), {
  ssr: false,
  loading: () => null,
});
const BestSellingAccessories = dynamic(
  () => import("./BestSellingAccessories"),
  { ssr: false, loading: () => null },
);

const rewardsSectionData: RewardsSectionData = {
  title: "إنجازاتنا وجوائزنا",
  description:
    "تمتلك الشركة العديد من الشهادات والاعتمادات الوطنية والدولية كدليل على التزامها الصارم بمراقبة الجودة.",
  items: [
    {
      id: "gold-award",
      image: "/images/rewards/reward-1.png",
      alt: "جائزة التميز الذهبية",
    },
    {
      id: "national-quality",
      image: "/images/rewards/reward-2.png",
      alt: "وسام الجودة الوطني",
    },
    {
      id: "ibwa",
      image: "/images/rewards/reward-3.png",
      alt: "اعتماد IBWA",
    },
    {
      id: "abu-award",
      image: "/images/rewards/reward-4.png",
      alt: "جائزة أبو للتميز",
    },
    {
      id: "nsf",
      image: "/images/rewards/reward-5.png",
      alt: "اعتماد NSF",
    },
  ],
};

const qualityMarkSectionData: QualityMarkSectionData = {
  title: "علامة الجودة العمانية",
  description:
    "حصلت الشركة على علامة الجودة العمانية في خطوة تعكس التزامها بتقديم منتجات مطابقة لأعلى معايير الجودة المحلية.",
  image: "/images/om.svg",
  imageAlt: "شعار علامة الجودة العمانية",
};

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
  const rewardsData =
    homeData?.rewards_section && homeData.rewards_section.items?.length > 0
      ? homeData.rewards_section
      : rewardsSectionData;
  const qualityMarkData =
    homeData?.quality_mark_section &&
    homeData.quality_mark_section.title &&
    homeData.quality_mark_section.description &&
    homeData.quality_mark_section.image &&
    homeData.quality_mark_section.imageAlt
      ? homeData.quality_mark_section
      : qualityMarkSectionData;

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

          {/* 8. Rewards Section */}
          <Rewards data={rewardsData} />

          {/* 9. Omani Quality Mark */}
          <QualityMark data={qualityMarkData} />

          {/* 10. FAQ Section */}
          <FAQ faqs={faqs ?? []} isSection={true} />
        </>
      ) : (
        <div className="container h-24" aria-hidden="true" />
      )}
    </div>
  );
}
