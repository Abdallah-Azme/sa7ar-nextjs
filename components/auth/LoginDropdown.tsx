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
						<div className="text-xs text-gray-500 mb-1">{tCommon("language")}</div>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => switchLocale("en")}
								className={`rounded-md px-3 py-2 text-sm text-center border ${
									locale === "en"
										? "bg-primary text-white border-primary"
										: "bg-white text-gray-700 border-gray-200"
								}`}
							>
								English
							</button>
							<button
								type="button"
								onClick={() => switchLocale("ar")}
								className={`rounded-md px-3 py-2 text-sm text-center border ${
									locale === "ar"
										? "bg-primary text-white border-primary"
										: "bg-white text-gray-700 border-gray-200"
								}`}
							>
								العربية
							</button>
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
