"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    if (!pathname) return;
    const nextLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: nextLocale });
  };

  const nextLang = locale === "ar" ? t("en") : t("ar");

  return (
    <Button
      variant="outline"
      size="icon-lg"
      onClick={toggleLanguage}
      className="rounded-full flex justify-center items-center h-12 w-12 gap-1 text-sm font-semibold"
      title={t("switchTo", { lang: nextLang })}
      aria-label={t("switchTo", { lang: nextLang })}
    >
      {locale === "ar" ? "EN" : t("ar")}
    </Button>
  );
}
