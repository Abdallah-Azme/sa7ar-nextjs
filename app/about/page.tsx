import { getAboutPageData } from "@/features/about/queries";
import { getGlobalSettings } from "@/features/settings/queries";
import OurStory from "@/features/about/components/OurStory";
import AboutSection from "@/features/about/components/AboutSection";
import Header from "@/components/shared/header/Header";
import Banner from "@/components/shared/Banner";
import AboutCard from "@/components/shared/cards/AboutCard";
import HelpCard from "@/components/shared/cards/HelpCard";
import Footer from "@/components/shared/footer/Footer";
import Mobile from "@/features/home/components/Mobile";
import ContactUsSection from "@/components/shared/ContactUsSection";
import { BadgeCheck, Leaf, Truck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Sohar Water",
  description: "Learn about our journey, vision, and mission to deliver pure refreshment to every home in Oman.",
};

/**
 * About Us Page - RSC (Server Component)
 * Dynamically fetches company info, vision and mission statements on the server.
 */
export default async function AboutPage() {
  const [data, settings] = await Promise.all([
    getAboutPageData(),
    getGlobalSettings(),
  ]);

  const aboutUs = data?.about_us;
  const features = data?.about_us_values_cards || [];
  
  // Handing nested vision/mission logic consistent with legacy CMS format
  const vision = data?.our_vision?.[0]?.[0];
  const mission = data?.our_sms?.[0]?.[0];

  const defaultIcons = [
    <BadgeCheck key="1" className="size-8 text-secondary" />,
    <Truck key="2" className="size-8 text-secondary" />,
    <Leaf key="3" className="size-8 text-secondary" />,
    <BadgeCheck key="4" className="size-8 text-secondary" />,
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      
      <Banner 
        title={aboutUs?.title || "Crafting Pure Refreshment"} 
        desc={aboutUs?.description?.replace(/<[^>]*>/g, "").substring(0, 160) || "Learn more about our commitment to excellence and quality."} 
        bannerUrl={aboutUs?.first_image || "/images/about-hero.webp"} 
      />

      <div className="container py-20 space-y-32">
        
        {/* 1. Our Story Section */}
        <OurStory 
          title={aboutUs?.title}
          descriptionHtml={aboutUs?.description}
          imageUrl={aboutUs?.second_image || aboutUs?.first_image}
          numberOfWorkers={aboutUs?.number_of_workers}
          numberOfProducts={aboutUs?.number_of_products}
        />

        {/* 2. Vision Section (Alternating Image Side) */}
        {vision && (
            <AboutSection 
                side="end"
                label="رؤيتنا"
                title={vision.title}
                description={vision.description?.replace(/<[^>]*>/g, "")}
                imageUrl={vision.icon || "/images/placeholder/our-story.webp"}
            />
        )}

        {/* 3. Mission Section */}
        {mission && (
            <AboutSection 
                side="start"
                label="مهمتنا"
                title={mission.title}
                description={mission.description?.replace(/<[^>]*>/g, "")}
                imageUrl={mission.icon || "/images/placeholder/our-story.webp"}
            />
        )}

        {/* 4. Values Cards Grid */}
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

      {/* 5. Mobile App CTA — matches React About page */}
      <div className="container py-10">
        <Mobile
          appleStoreLink={settings?.apple_store_link}
          googlePlayLink={settings?.google_play_link}
        />
      </div>

      {/* 6. Contact Us CTA — matches React About page */}
      <div className="container py-10">
        <ContactUsSection />
      </div>

      <HelpCard className="py-20 bg-gray-50/50" />
      <Footer />
    </main>
  );
}
