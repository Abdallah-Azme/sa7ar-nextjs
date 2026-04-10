import SearchDialog from "@/components/shared/SearchDialog";
import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

/**
 * Header - RSC (Server Component)
 * Mirrors React's Header:
 * - Accent banner bar with notice text (from API settings)
 * - Optional showSearch prop that renders SearchDialog
 * - Passes children (Navbar) below the banner
 */
export default async function Header({
	children,
	text,
	showSearch = false,
}: {
	text?: string;
	children?: ReactNode;
	showSearch?: boolean;
}) {
	const t = await getTranslations("header");
	const content = text ?? t("notice");

	return (
		<header className="relative">
			<p className="w-full min-h-13 text-xs/13 text-center bg-primary text-white">
				{content}
			</p>
			{children}
			{showSearch && (
				<div className="absolute inset-x-2 bottom-8 z-20 sm:inset-x-auto sm:inset-e-8 sm:w-full sm:max-w-sm">
					<SearchDialog />
				</div>
			)}
		</header>
	);
}
