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

export default function AboutPageContent() {
  const { data } = useAboutDataQuery();
  const { data: settings } = useGlobalSettingsQuery();

  const aboutUs = data?.about_us;
  const features = data?.about_us_values_cards || [];
  const vision = data?.our_vision;
  const mission = data?.our_sms;

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
        desc={aboutUs?.description?.replace(/<[^>]*>/g, "").substring(0, 160) || "Learn more about our commitment to excellence and quality."} 
        bannerUrl={aboutUs?.first_image || "/images/about-hero.webp"} 
      />

      <div className="container py-20 space-y-32">
        <OurStory 
          title={aboutUs?.title}
          descriptionHtml={aboutUs?.description}
          imageUrl={aboutUs?.second_image || aboutUs?.first_image}
          numberOfWorkers={aboutUs?.number_of_workers}
          numberOfProducts={aboutUs?.number_of_products}
        />

        {vision && (
            <AboutSection 
                side="end"
                label="رؤيتنا"
                title={vision.title || ""}
                description={vision.description?.replace(/<[^>]*>/g, "") || ""}
                imageUrl={vision.icon || "/images/placeholder/our-story.webp"}
            />
        )}

        {mission && (
            <AboutSection 
                side="start"
                label="مهمتنا"
                title={mission.title || ""}
                description={mission.description?.replace(/<[^>]*>/g, "") || ""}
                imageUrl={mission.icon || "/images/placeholder/our-story.webp"}
            />
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
                <AboutCard 
                    key={idx}
                    index={idx}
                    title={feature.title}
                    description={feature.description?.replace(/<[^>]*>/g, "")}
                    icon={feature.icon || defaultIcons[idx % 4]}
                />
            ))}
        </div>
      </div>

      <div className="container py-10">
        <Mobile
          appleStoreLink={settings?.apple_store_link}
          googlePlayLink={settings?.google_play_link}
        />
      </div>

      <div className="container py-10">
        <ContactUsSection />
      </div>

      <HelpCard className="py-20 bg-gray-50/50" />
    </>
  );
}
