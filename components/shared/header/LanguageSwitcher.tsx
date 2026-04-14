"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

type LanguageSwitcherProps = {
  onLanguageChange?: (locale: string) => void;
};

export default function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const t = useTranslations();
  const locale = useLocale();
  // usePathname from next-intl routing returns path WITHOUT the locale prefix
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (nextLocale: string) => {
    if (nextLocale === locale) {
      return;
    }

    // router.replace handles locale-prefixing automatically based on routing config
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: nextLocale });
    onLanguageChange?.(nextLocale);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 transition-all h-10 px-3 gap-2 flex items-center justify-between min-w-28">
      <select
        value={locale}
        onChange={(event) => switchLanguage(event.target.value)}
        className="bg-transparent text-[#005573] font-bold text-sm outline-none border-none appearance-none cursor-pointer pe-1"
        aria-label={t("common.language")}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
      <Globe className="h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
