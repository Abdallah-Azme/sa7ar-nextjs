import CartPageContent from "@/features/cart/components/CartPageContent";
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
  const t = await getTranslations({ locale: lang, namespace: "seo.cart" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/cart",
    noIndex: true,
  });
}

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);
	return <CartPageContent />;
}
