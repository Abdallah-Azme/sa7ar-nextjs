"use client";

import { Globe, UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
				<DropdownMenuContent className="w-auto min-w-52 overflow-visible rounded-xl p-2">
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
					<DropdownMenuSeparator className="my-2" />
					<div className="px-1 pb-1">
						<p className="mb-1.5 block text-xs font-medium text-muted-foreground">
							{tCommon("language")}
						</p>
						<div className="group flex items-center gap-2 rounded-lg border border-border/80 bg-muted/30 px-2 py-1.5 transition-colors focus-within:border-primary/40 focus-within:bg-background">
							<Globe className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
							<Select value={locale} onValueChange={switchLocale}>
								<SelectTrigger
									size="default"
									className="h-8 w-full border-none bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
									aria-label={tCommon("language")}
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent position="popper" align="start" className="min-w-32 rounded-lg">
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="ar">العربية</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
