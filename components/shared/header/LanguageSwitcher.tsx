"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LanguageSwitcherProps = {
  onLanguageChange?: (locale: string) => void;
};

export default function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (nextLocale: string) => {
    if (!pathname) return;
    router.replace(pathname, { locale: nextLocale as "ar" | "en" });
    onLanguageChange?.(nextLocale);
  };

  return (
    <Select value={locale} onValueChange={switchLanguage}>
      <SelectTrigger
        className="bg-white! text-[#005573]! border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50! transition-all h-10 px-3 gap-2 flex items-center justify-between min-w-28"
        aria-label={t("common.language")}
      >
        <SelectValue className="text-[#005573]! font-bold text-sm" />
        <Globe className="h-4 w-4 text-gray-400" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}
