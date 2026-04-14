"use client";

import { UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { usePathname, useRouter } from "@/i18n/routing";

/**
 * LoginDropdown - Client Component
 * Mirrors React's LoginDropdown: dropdown with Login/Signup items + AuthDialog trigger
 */
export default function LoginDropdown({
	open,
	onOpenChange,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const tAuth = useTranslations("auth");
	const tCommon = useTranslations("common");
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const { openAuth } = useAuthDialog();

	const switchLocale = (nextLocale: string) => {
		if (nextLocale !== locale) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			router.replace(pathname as any, { locale: nextLocale });
		}
	};

	const handleOpen = (mode: "login" | "signup") => {
		openAuth(mode);
	};

	return (
		<>
			<DropdownMenu open={open} onOpenChange={onOpenChange}>
				<DropdownMenuTrigger asChild>
					<Button
						size={"icon-lg"}
						variant="secondary"
						className="rounded-full size-12 flex place-content-center"
						aria-label={tAuth("login")}
					>
						<UserRoundIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-auto min-w-52 overflow-visible">
					<DropdownMenuItem asChild>
						<button
							onClick={() => handleOpen("login")}
							type="button"
							className="w-full"
						>
							{tAuth("login")}
						</button>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<button
							onClick={() => handleOpen("signup")}
							type="button"
							className="w-full"
						>
							{tAuth("signup")}
						</button>
					</DropdownMenuItem>
					<div className="h-px bg-gray-100 my-2 mx-2" />
					<div className="px-2 pb-1">
						<div className="text-xs text-gray-400 mb-1 px-1">{tCommon("language")}</div>
						<div className="flex flex-col">
							<button
								type="button"
								onClick={() => switchLocale("en")}
								className={`flex items-center justify-between gap-3 px-2 py-1.5 rounded-md text-sm transition-colors w-full text-start ${
									locale === "en" ? "bg-[#51A1B1] text-white font-semibold" : "hover:bg-gray-50 text-gray-600"
								}`}
							>
								<span>English</span>
								{locale === "en" && <span className="text-gray-500 text-base leading-none">✓</span>}
							</button>
							<button
								type="button"
								onClick={() => switchLocale("ar")}
								className={`flex items-center justify-between gap-3 px-2 py-1.5 rounded-md text-sm transition-colors w-full text-start ${
									locale === "ar" ? "bg-[#51A1B1] text-white font-semibold" : "hover:bg-gray-50 text-gray-600"
								}`}
							>
								<span>العربية</span>
								{locale === "ar" && <span className="text-gray-500 text-base leading-none">✓</span>}
							</button>
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
