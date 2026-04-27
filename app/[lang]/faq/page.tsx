import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchFaqs, homeKeys } from "@/features/home/services/homeService";
import Banner from "@/components/shared/Banner";
import FAQ from "@/features/home/components/FAQ";
import HelpCard from "@/components/shared/cards/HelpCard";
import ContactUsSection from "@/components/shared/ContactUsSection";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";

import { getTranslations } from "next-intl/server";

function buildFaqJsonLd({
  lang,
  pageTitle,
  pageDescription,
  faqs,
}: {
  lang: string;
  pageTitle: string;
  pageDescription: string;
  faqs: { id: number; question: string; answer: string }[];
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const faqPath = lang === "ar" ? "/faq" : `/${lang}/faq`;
  const faqUrl = new URL(faqPath, baseUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: pageTitle,
    description: pageDescription,
    url: faqUrl,
    mainEntity: faqs
      .filter((item) => item.question?.trim() && item.answer?.trim())
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.faq" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/faq",
  });
}

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations("faq");
  const tSeo = await getTranslations({ locale: lang, namespace: "seo.faq" });

  const queryClient = makeQueryClient();
  const faqs = await queryClient.ensureQueryData({
    queryKey: homeKeys.faqs(),
    queryFn: fetchFaqs,
  });
  const jsonLd = buildFaqJsonLd({
    lang,
    pageTitle: tSeo("title"),
    pageDescription: tSeo("description"),
    faqs,
  });

  return (
    <main className="space-y-20 relative overflow-hidden pb-10">
      <h1 className="sr-only">{tSeo("title")}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="light absolute top-1/4 -z-1 start-20 size-72" />
      <div className="light absolute top-[40%] -z-1 end-20 size-72" />

      <Banner
        title={t("label")}
        desc={t("help.description")}
        bannerUrl="/images/placeholder/hero.webp"
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <FAQ isSection={false} />
      </HydrationBoundary>

      <ContactUsSection />
      
      <HelpCard withContainer />
    </main>
  );
}
