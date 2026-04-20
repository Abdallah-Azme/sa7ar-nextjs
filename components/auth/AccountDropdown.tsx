"use client";

import { Globe, UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useState } from "react";
import ImageFallback from "@/components/shared/ImageFallback";

import { useLocale, useTranslations } from "next-intl";

export default function AccountDropdown({
	open,
	onOpenChange,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const t = useTranslations("account");
	const tCommon = useTranslations("common");
	const tPoints = useTranslations("points");
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	const switchLocale = (nextLocale: string) => {
		if (nextLocale !== locale) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			router.replace(pathname as any, { locale: nextLocale });
		}
	};

	const accountLinks = [
		{ to: "/account/details", name: t("links.profile") },
		{ to: "/account/orders", name: t("links.orders") },
		{ to: "/cart", name: t("links.cart") },
		{ to: "/account/addresses", name: t("links.addresses") },
	];

	const [_open, _onOpenChange] = useState(open ?? false);
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	const { user, logout, isLoading } = useAuth();

	const handleOpenLogoutDialog = () => {
		_onOpenChange(false);
		onOpenChange?.(false);
		setShowLogoutDialog(true);
	};

	const handleConfirmLogout = async () => {
		await logout();
		setShowLogoutDialog(false);
		_onOpenChange(false);
		onOpenChange?.(false);
	};

	return (
		<>
			<DropdownMenu open={_open} onOpenChange={_onOpenChange}>
				<DropdownMenuTrigger asChild>
					<div className="rounded-full h-14 px-4 cursor-pointer flex bg-[#F1F7F9] hover:bg-[#E9F2F5] transition-colors gap-3 items-center text-nowrap min-w-44 border border-transparent">
						<div
							className="rounded-full size-10 flex items-center justify-center bg-gray-200 overflow-hidden"
							aria-label="User Account Menu"
						>
							{user?.image ? (
								<ImageFallback
									src={user.image}
									alt={user?.name || tCommon("fallbackImageAlt")}
									width={40}
									height={40}
									className="rounded-full object-cover"
								/>
							) : (
								<UserRoundIcon className="text-gray-500 size-6" />
							)}
						</div>
						<div className="flex flex-col justify-center">
							<h2 className="text-[#005573] font-bold line-clamp-1 text-sm leading-tight">
								{user?.name}
							</h2>
							<span className="text-[#005573]/70 text-xs font-medium">
								{tPoints("label", { count: user?.points ?? 0 })}
							</span>
						</div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-gray-100">
					{accountLinks.map((link) => (
						<DropdownMenuItem asChild key={link.to} className="rounded-xl py-3 px-4 focus:bg-[#F1F7F9] focus:text-[#005573] cursor-pointer">
							<Link href={link.to} className="w-full font-medium">
								{link.name}
							</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuItem
						onSelect={(event) => {
							event.preventDefault();
							handleOpenLogoutDialog();
						}}
						className="rounded-xl py-3 px-4 text-red-500 focus:text-red-500 focus:bg-red-50 font-medium cursor-pointer"
					>
						{t("logoutDialog.trigger")}
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

			{/* Logout Confirmation Dialog */}
			<Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<DialogContent className="sm:max-w-md p-6 rounded-3xl">
					<DialogHeader>
						<DialogTitle>{t("logoutDialog.heading")}</DialogTitle>
						<DialogDescription>
							{t("logoutDialog.description")}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-5">
						<div className="flex items-center justify-center gap-2">
							<Button
								variant="secondary"
								onClick={() => setShowLogoutDialog(false)}
							>
								{t("logoutDialog.cancel")}
							</Button>
							<Button
								variant="destructive"
								onClick={handleConfirmLogout}
								disabled={isLoading}
							>
								{t("logoutDialog.confirm")} {isLoading && "..."}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
