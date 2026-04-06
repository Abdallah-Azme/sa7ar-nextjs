"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    if (!pathname) return;
    const nextLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="outline"
      size="icon-lg"
      onClick={toggleLanguage}
      className="rounded-full flex justify-center items-center h-12 w-12 gap-1 text-sm font-semibold"
      title={locale === "ar" ? "English" : "عربي"}
      aria-label={locale === "ar" ? "Switch to English" : "تغيير اللغة للعربية"}
    >
      {locale === "ar" ? "EN" : "عربي"}
    </Button>
  );
}
