import { getGlobalSettings } from "@/features/settings/queries";
import SearchDialog from "@/components/shared/SearchDialog";
import { ReactNode } from "react";

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
	const setting = await getGlobalSettings();
	// React uses t("header.notice") — here we use app_title from API as the notice
	const content = text ?? setting?.app_title ?? "مياه صحار";

	return (
		<header className="relative">
			<p className="w-full min-h-13 text-xs/13 text-center bg-accent text-white">
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
