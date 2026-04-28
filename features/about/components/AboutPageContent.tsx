"use client";

import OurStory from "@/features/about/components/OurStory";
import AboutSection from "@/features/about/components/AboutSection";
import Banner from "@/components/shared/Banner";
import AboutCard from "@/components/shared/cards/AboutCard";
import HelpCard from "@/components/shared/cards/HelpCard";
import Mobile from "@/features/home/components/Mobile";
import ContactUsSection from "@/components/shared/ContactUsSection";
import AboutTrustCardsSection from "@/features/about/components/AboutTrustCardsSection";
import type { AboutTrustCardsSectionData } from "@/features/about/components/AboutTrustCardsSection";
import AboutExcellenceSection from "@/features/about/components/AboutExcellenceSection";
import type { AboutExcellenceSectionData } from "@/features/about/components/AboutExcellenceSection";
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
  const apiTrustSection = data?.trust_cards_section;
  const apiExcellenceSection = data?.excellence_section;

  const defaultIcons = [
    <BadgeCheck key="1" className="size-8 text-secondary" />,
    <Truck key="2" className="size-8 text-secondary" />,
    <Leaf key="3" className="size-8 text-secondary" />,
    <BadgeCheck key="4" className="size-8 text-secondary" />,
  ];

  const fallbackTrustSectionData: AboutTrustCardsSectionData = {
    title: "في واحة عمان نفخر بكوننا علامة تجارية تتمتع بثقة كبيرة من قبل مستهلكينا.",
    description:
      "نواصل توفير مياه عالية الجودة تواكب أسلوب الحياة الصحي والرياضي، مع التزام دائم بمعايير السلامة والموثوقية.",
    cards: [
      {
        id: "trust-1",
        image: "/images/placeholder/our-story.webp",
        title: "تساهم شراكاتنا برفع تعزيز النشاط البدني والرياضة",
        description: "اللياقة البدنية، الصحة والرفاهية.",
      },
      {
        id: "trust-2",
        image: "/images/placeholder/our-story.webp",
        title: "العلامة التجارية رقم واحد في عمان",
        description: "نحافظ على ثقة المستهلك عبر الجودة والاستمرارية.",
      },
      {
        id: "trust-3",
        image: "/images/placeholder/our-story.webp",
        title: "إنتاج متوافق مع معايير الجودة الدولية",
        description: "لدعم الصحة والرفاهية بأساليب تصنيع موثوقة.",
      },
    ],
  };

  const trustSectionData: AboutTrustCardsSectionData = apiTrustSection?.cards?.length
    ? {
        title: apiTrustSection.title || fallbackTrustSectionData.title,
        description: apiTrustSection.description || fallbackTrustSectionData.description,
        cards: apiTrustSection.cards.map((card, idx) => ({
          id: card.id?.toString() || `trust-api-${idx + 1}`,
          image: card.image || "/images/placeholder/our-story.webp",
          title: card.title || "",
          description: card.description || "",
          imageAlt: card.image_alt || card.title || undefined,
        })),
      }
    : fallbackTrustSectionData;

  const fallbackExcellenceSectionData: AboutExcellenceSectionData = {
    title: "العلامة التجارية الرائدة الأكثر ثقة للمياه المعبأة في عمان",
    description:
      "تلتزم واحة عمان بأن تكون المورد الأول للمياه المعبأة الآمنة والفاخرة في جميع أنحاء عمان، وهذا ما نلبي احتياجات عملائنا باستمرار مع الحفاظ على البيئة وتعزيز رفاهية مجتمعنا.",
    badgeImage: "/images/om.svg",
    badgeImageAlt: "No.1 Oman badge",
    items: [
      {
        id: "excellence-1",
        title: "التميز في التصنيع",
        description: "حصلت شركة واحة عمان على شهادة التميز في التصنيع من ABWA لمدة عشر سنوات متتالية.",
        image: "/images/logo.svg",
        imageAlt: "Manufacturing excellence certificate",
      },
      {
        id: "excellence-2",
        title: "المعايير العالمية للجودة والسلامة",
        description:
          "حاصلون على شهادات ISO 9001:2015 وإدارة سلامة الغذاء ISO 22000:2005 وHACCP/OHSAS لإدارة الجودة.",
        image: "/images/logo.svg",
        imageAlt: "Global quality standards badge",
      },
      {
        id: "excellence-3",
        title: "موثوقية الجودة والامتثال",
        description:
          "نفخر بحصولنا على شهادات الجودة الوطنية والدولية بما يضمن أعلى المعايير لإدارة الغذاء والمياه المعبأة.",
        image: "/images/logo.svg",
        imageAlt: "Compliance and trust mark",
      },
      {
        id: "excellence-4",
        title: "مرافق الإنتاج الحائزة على جوائز",
        description: "مصانعنا حققت جوائز متتالية تقديرًا لالتزامها بالجودة والاستدامة في عمليات الإنتاج.",
        image: "/images/logo.svg",
        imageAlt: "Awarded production facility badge",
      },
    ],
  };

  const excellenceSectionData: AboutExcellenceSectionData = apiExcellenceSection?.items?.length
    ? {
        title: apiExcellenceSection.title || fallbackExcellenceSectionData.title,
        description: apiExcellenceSection.description || fallbackExcellenceSectionData.description,
        badgeImage: apiExcellenceSection.badge_image || fallbackExcellenceSectionData.badgeImage,
        badgeImageAlt: apiExcellenceSection.badge_image_alt || fallbackExcellenceSectionData.badgeImageAlt,
        items: apiExcellenceSection.items.map((item, idx) => ({
          id: item.id?.toString() || `excellence-api-${idx + 1}`,
          title: item.title || "",
          description: item.description || "",
          image: item.image || "/images/logo.svg",
          imageAlt: item.image_alt || item.title || undefined,
        })),
      }
    : fallbackExcellenceSectionData;

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
        {/* <AboutTrustCardsSection data={trustSectionData} /> */}

        <AboutExcellenceSection data={excellenceSectionData} />

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
