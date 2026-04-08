import CheckoutPageContent from "@/features/checkout/components/CheckoutPageContent";
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
  const t = await getTranslations({ locale: lang, namespace: "seo.checkout" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/checkout",
    noIndex: true,
  });
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);
	return <CheckoutPageContent />;
}


