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
    const hasDestination = Boolean(to && to.trim().length > 0);

	return (
		<Button asChild={hasDestination} className="bg-gray h-13 rounded-xl" disabled={!hasDestination}>
            {hasDestination ? (
			    <Link href={to as string} className="flex items-center gap-3" aria-label={t("showMore")}>
				    <div className="bg-white text-gray rounded-lg p-2">
					    <Eye size={10} />
				    </div>
				    <span>{t("showMore")}</span>
				    <ArrowRight className="rtl:rotate-180" />
			    </Link>
            ) : (
                <span className="flex items-center gap-3">
                    <div className="bg-white text-gray rounded-lg p-2">
                        <Eye size={10} />
                    </div>
                    <span>{t("showMore")}</span>
                    <ArrowRight className="rtl:rotate-180" />
                </span>
            )}
        </Button>
	);
}
