import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchFaqs, homeKeys } from "@/features/home/services/homeService";
import Banner from "@/components/shared/Banner";
import FAQ from "@/features/home/components/FAQ";
import HelpCard from "@/components/shared/cards/HelpCard";
import ContactUsSection from "@/components/shared/ContactUsSection";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | مياه صحار",
  description: "الأسئلة الشائعة حول منتجات مياه صحار وخدمات التوصيل ومعايير الجودة.",
};

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: homeKeys.faqs(),
    queryFn: fetchFaqs,
  });

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 -z-1 inset-s-20 size-72 bg-accent/5 rounded-full blur-[100px]" />
      <div className="absolute top-[40%] -z-1 inset-e-20 size-72 bg-secondary/5 rounded-full blur-[100px]" />

      <Banner
        title="الأسئلة الشائعة"
        desc="كل ما تحتاج معرفته حول منتجاتنا وخدماتنا."
        bannerUrl="/images/placeholder/hero.webp"
      />

      <div className="py-20">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FAQ isSection={false} />
        </HydrationBoundary>
      </div>

      <div className="container pb-20">
        <ContactUsSection />
      </div>

      <HelpCard />
    </main>
  );
}
