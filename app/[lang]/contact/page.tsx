import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import ContactPageContent from "@/features/contact/components/ContactPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";

import { getTranslations } from "next-intl/server";

function buildContactPageJsonLd({
  lang,
  title,
  description,
}: {
  lang: string;
  title: string;
  description: string;
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const contactPath = lang === "ar" ? "/contact" : `/${lang}/contact`;
  const url = new URL(contactPath, baseUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: title,
    description,
    inLanguage: lang,
    url,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.contact" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/contact",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);
    const t = await getTranslations({ locale: lang, namespace: "seo.contact" });
    const jsonLd = buildContactPageJsonLd({
      lang,
      title: t("title"),
      description: t("description"),
    });

    const queryClient = makeQueryClient();
    await queryClient.prefetchQuery({
        queryKey: settingsKeys.global(),
        queryFn: fetchGlobalSettings,
    });

	return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
              }}
            />
            <h1 className="sr-only">{t("title")}</h1>
            <ContactPageContent />
        </HydrationBoundary>
    );
}
