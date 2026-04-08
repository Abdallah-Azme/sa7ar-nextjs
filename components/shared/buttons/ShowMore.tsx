import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

/**
 * ShowMore - Client Component
 * Used as a "View All" or "Read More" button link
 */
export default function ShowMore({ to }: { to?: string }) {
    const t = useTranslations("common");

	return (
		<Button asChild className="bg-gray h-13 rounded-xl">
			<Link href={to ?? "#"} className="flex items-center gap-3" aria-label={t("showMore")}>
				<div className="bg-white text-gray rounded-lg p-2">
					<Eye size={10} />
				</div>
				<span>{t("showMore")}</span>
				<ArrowRight className="rtl:rotate-180" />
			</Link>
		</Button>
	);
}
