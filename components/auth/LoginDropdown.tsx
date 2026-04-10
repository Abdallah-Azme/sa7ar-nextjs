"use client";

import { Suspense, useState, useEffect } from "react";
import { Globe, UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthDialog from "@/components/dialogs/AuthDialog";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import LanguageSwitcher from "@/components/shared/header/LanguageSwitcher";

/**
 * Inner component that uses useSearchParams — must be wrapped in <Suspense>.
 * Next.js App Router requires all components using useSearchParams to be
 * inside a Suspense boundary, otherwise it throws during static rendering.
 */
function AuthRequiredWatcher({
	onOpen,
}: {
	onOpen: (mode: "login" | "signup") => void;
}) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (searchParams.get("auth_required") === "1") {
			setTimeout(() => {
				onOpen("login");
				router.replace(pathname, { scroll: false });
			}, 0);
		}
	}, [searchParams, pathname, router, onOpen]);

	return null;
}

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
	const [authMode, setAuthMode] = useState<"login" | "signup">("login");
	const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

	const handleOpen = (mode: "login" | "signup") => {
		setAuthMode(mode);
		setIsAuthDialogOpen(true);
	};

	return (
		<>
			{/* Suspense boundary required for useSearchParams */}
			<Suspense fallback={null}>
				<AuthRequiredWatcher onOpen={handleOpen} />
			</Suspense>

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

			<AuthDialog
				open={isAuthDialogOpen}
				onOpenChange={setIsAuthDialogOpen}
				mode={authMode}
			/>
		</>
	);
}
