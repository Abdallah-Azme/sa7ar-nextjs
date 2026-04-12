"use client";

import { Globe, UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import LanguageSwitcher from "@/components/shared/header/LanguageSwitcher";

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
	const { openAuth } = useAuthDialog();

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
					<DropdownMenuItem
						asChild
						className="focus:bg-transparent focus:text-foreground data-highlighted:bg-transparent data-highlighted:text-foreground"
					>
						<div className="flex w-full items-center justify-between gap-3 text-foreground! **:text-foreground!">
							<span className="flex items-center gap-2">
								<Globe className="h-4 w-4" />
								{tCommon("language")}
							</span>
							<LanguageSwitcher onLanguageChange={() => onOpenChange?.(false)} />
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
