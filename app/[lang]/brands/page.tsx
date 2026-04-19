import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { fetchSeoSettings } from "@/features/settings/services/settingsService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.brands" });
  const seoSettings = await fetchSeoSettings();
  const seoPage = seoSettings?.pages?.brand_product;

  return generateSeoMetadata({
    title: seoPage?.meta_title || t("title"),
    description: seoPage?.meta_description || t("description"),
    lang,
    path: "/brands",
  });
}

export default async function BrandsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations("brandPage");

  const brands = [
    { id: "rathath", slug: "rathath", image: "/images/sohar-logo.png" },
    { id: "bard", slug: "bard", image: "/images/bard-logo.png" },
  ] as const;

  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-gray-600 max-w-2xl">{t("description")}</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {brands.map((brand) => (
          <Link 
            key={brand.id} 
            href={`/brands/${brand.slug}`}
            className="group block bg-accent/5 rounded-3xl p-8 transition-transform hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center text-center gap-4">
               {/* Display Brand Image/Logo */}
              <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                {t(`brandNames.${brand.id}`)}
              </div>
              <span className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-full">
                {t("viewCollection")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
