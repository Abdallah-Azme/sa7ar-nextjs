import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import ContactPageContent from "@/features/contact/components/ContactPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";

import { getTranslations } from "next-intl/server";

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

    const queryClient = makeQueryClient();
    await queryClient.prefetchQuery({
        queryKey: settingsKeys.global(),
        queryFn: fetchGlobalSettings,
    });

	return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ContactPageContent />
        </HydrationBoundary>
    );
}
