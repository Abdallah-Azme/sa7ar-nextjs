import { cn } from "@/lib/utils";
import { MessageCircleMoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface HelpCardProps {
	className?: string;
	withContainer?: boolean;
	contactPage?: boolean;
}

/**
 * HelpCard
 * Call to action for support, used at the bottom of many pages.
 */
export default function HelpCard({
	className,
	withContainer = true,
	contactPage = false,
}: HelpCardProps) {
	const t = useTranslations("helpCard");
	const tActions = useTranslations("actions");

	return (
		<div
			className={cn(
				"flex items-center justify-between py-10",
				withContainer && "container",
				className,
			)}
		>
			<div className="space-y-3">
				<h3 className="text-xl sm:text-2xl font-extrabold">
					{t("title")}
				</h3>
				<p className="font-light text-gray">{t("description")}</p>
			</div>
			<Button
				asChild
				className="rounded-4xl min-w-[200px] text-white h-13 text-sm font-medium bg-black hover:bg-black/90"
			>
				<Link
					href={contactPage ? "/contact" : "/contact"}
					className="flex items-center gap-2"
				>
					<MessageCircleMoreIcon
						size={20}
						className="fill-white text-black"
					/>
					{tActions("contactUs")}
				</Link>
			</Button>
		</div>
	);
}
