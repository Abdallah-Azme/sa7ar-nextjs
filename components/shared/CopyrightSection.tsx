"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useCmsPagesQuery } from "@/features/about/hooks/useCms";
import { getCmsPagePathByKey } from "@/features/about/services/cmsService";

/**
 * CopyrightSection - Client Component
 * Standardized footer copyright row used on specific checkout/auth pages.
 */
export default function CopyrightSection({ className }: { className?: string }) {
	const year = new Date().getFullYear();
	const t = useTranslations("footer");
	const { data: cmsPages } = useCmsPagesQuery();
	const termsPath = getCmsPagePathByKey(cmsPages, "terms_and_conditions");
	const privacyPath = getCmsPagePathByKey(cmsPages, "privacy_policy");

	return (
		<div className={cn("py-14 container border-t mt-6 flex font-bold items-center justify-between text-sm text-gray flex-col sm:flex-row gap-4", className)}>
			<span>{t("copyright", { year })}</span>
			<span className="flex items-center gap-2">
				<Link href={termsPath} className="hover:text-primary transition-colors">{t("terms")}</Link>
				<span aria-hidden>·</span>
				<Link href={privacyPath} className="hover:text-primary transition-colors">{t("privacy")}</Link>
			</span>
		</div>
	);
}
