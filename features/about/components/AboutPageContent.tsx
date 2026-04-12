"use client";

import OurStory from "@/features/about/components/OurStory";
import AboutSection from "@/features/about/components/AboutSection";
import Banner from "@/components/shared/Banner";
import AboutCard from "@/components/shared/cards/AboutCard";
import HelpCard from "@/components/shared/cards/HelpCard";
import Mobile from "@/features/home/components/Mobile";
import ContactUsSection from "@/components/shared/ContactUsSection";
import { BadgeCheck, Leaf, Truck } from "lucide-react";
import { useAboutDataQuery } from "../hooks/useAbout";
import { useGlobalSettingsQuery } from "@/features/settings/hooks/useSettings";

import { useTranslations } from "next-intl";
import { htmlToPlainText } from "@/lib/utils";

/** API sometimes returns vision/mission as nested arrays e.g. [[{ title, ... }]] */
function unwrapAboutSection<T extends { title?: string; description?: string; icon?: string | null }>(
  value: unknown
): T | null {
  if (value == null) return null;
  let v: unknown = value;
  while (Array.isArray(v) && v.length > 0) {
    v = v[0];
  }
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return v as T;
  }
  return null;
}

export default function AboutPageContent() {
  const t = useTranslations("aboutPage");
  const { data } = useAboutDataQuery();
  const { data: settings } = useGlobalSettingsQuery();

  const aboutUs = data?.about_us;
  const features = data?.about_us_values_cards || [];
  const vision = unwrapAboutSection(data?.our_vision);
  const mission = unwrapAboutSection(data?.our_sms);

  const defaultIcons = [
    <BadgeCheck key="1" className="size-8 text-secondary" />,
    <Truck key="2" className="size-8 text-secondary" />,
    <Leaf key="3" className="size-8 text-secondary" />,
    <BadgeCheck key="4" className="size-8 text-secondary" />,
  ];

  return (
    <>
      <Banner 
        title={aboutUs?.title || "Crafting Pure Refreshment"} 
        desc={
          (aboutUs?.description && htmlToPlainText(aboutUs.description).substring(0, 160)) ||
          "Learn more about our commitment to excellence and quality."
        } 
        bannerUrl={aboutUs?.first_image || "/images/about-hero.webp"} 
      />

      <main className="container space-y-24 py-24">
        <OurStory 
          title={aboutUs?.title}
          descriptionHtml={aboutUs?.description}
          imageUrl={aboutUs?.first_image}
          numberOfWorkers={aboutUs?.number_of_workers}
          numberOfProducts={aboutUs?.number_of_products}
        />

        {vision && (
            <AboutSection 
                side="end"
                label={t("sections.vision.label")}
                title={vision.title || ""}
                description={vision.description ? htmlToPlainText(vision.description) : ""}
                imageUrl={vision.icon || "/images/placeholder/our-story.webp"}
            />
        )}

        {mission && (
            <AboutSection 
                side="start"
                label={t("sections.mission.label")}
                title={mission.title || ""}
                description={mission.description ? htmlToPlainText(mission.description) : ""}
                imageUrl={mission.icon || "/images/placeholder/our-story.webp"}
            />
        )}

        <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
                <AboutCard 
                    key={idx}
                    index={idx}
                    title={feature.title}
                    description={feature.description ? htmlToPlainText(feature.description) : ""}
                    icon={feature.icon || defaultIcons[idx % 4]}
                />
            ))}
        </div>

        <Mobile
          appleStoreLink={settings?.apple_store_link}
          googlePlayLink={settings?.google_play_link}
        />
      </main>

      <div className="space-y-24 mt-12 pb-24">
        <ContactUsSection />
        <HelpCard />
      </div>
    </>
  );
}
