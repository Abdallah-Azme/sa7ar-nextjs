import Banner from "@/components/shared/Banner";
import FAQ from "@/features/home/components/FAQ";
import HelpCard from "@/components/shared/cards/HelpCard";
import ContactUsSection from "@/components/shared/ContactUsSection";
import { getFaqData } from "@/features/home/queries";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | مياه صحار",
  description: "الأسئلة الشائعة حول منتجات مياه صحار وخدمات التوصيل ومعايير الجودة.",
};

/**
 * FAQ Page - RSC (Server Component)
 * Full parity with React's Faq.tsx:
 *   - Arabic banner title and description
 *   - Correct hero image
 *   - ContactUsSection after FAQ (matches React)
 *   - HelpCard
 */
export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const faqs = await getFaqData();

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden">
      
      {/* Visual background lights — matches React's .light absolute divs */}
      <div className="absolute top-1/4 -z-1 start-20 size-72 bg-accent/5 rounded-full blur-[100px]" />
      <div className="absolute top-[40%] -z-1 end-20 size-72 bg-secondary/5 rounded-full blur-[100px]" />

      <Banner
        title="الأسئلة الشائعة"
        desc="كل ما تحتاج معرفته حول منتجاتنا وخدماتنا."
        bannerUrl="/images/placeholder/hero.webp"
      />

      <div className="py-20">
        <FAQ faqs={faqs} />
      </div>

      {/* ContactUsSection — present in React, was missing in Next */}
      <div className="container pb-20">
        <ContactUsSection />
      </div>

      <HelpCard />
    </main>
  );
}
