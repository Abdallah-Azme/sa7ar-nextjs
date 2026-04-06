"use client";

import { UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";

/**
 * Account links matching React's `accountLinks` from data/index.ts
 * React routes: /account/details, /account/orders, /account/addresses
 */
const accountLinks = [
	{ to: "/account/details", name: "حسابي" },
	{ to: "/account/orders", name: "طلباتي" },
	{ to: "/account/addresses", name: "عناويني" },
];

export default function AccountDropdown({
	open,
	onOpenChange,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
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
					<div className="rounded-full h-12 px-3 cursor-pointer flex bg-accent/10! gap-3 items-center text-nowrap min-w-40">
						<Button
							size="icon-lg"
							variant="link"
							className="rounded-full flex place-content-center"
							asChild
						>
							<span>
								{user?.image ? (
									<img
										src={user.image}
										alt={user?.name}
										className="rounded-full"
									/>
								) : (
									<UserRoundIcon />
								)}
							</span>
						</Button>
						<div>
							<h2 className="text-secondary font-bold line-clamp-1 text-xs">
								{user?.name}
							</h2>
							<span className="text-gray text-[10px]">
								{(user?.points ?? 0).toFixed(0)} نقطة
							</span>
						</div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{accountLinks.map((link) => (
						<DropdownMenuItem asChild key={link.to}>
							<Link href={link.to} className="w-full">
								{link.name}
							</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuItem
						onSelect={(event) => {
							event.preventDefault();
							handleOpenLogoutDialog();
						}}
						variant="destructive"
					>
						تسجيل الخروج
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Logout Confirmation Dialog */}
			<Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<DialogContent className="sm:max-w-md p-6 rounded-3xl">
					<DialogHeader>
						<DialogTitle>تسجيل الخروج</DialogTitle>
						<DialogDescription>
							هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-5">
						<div className="flex items-center justify-center gap-2">
							<Button
								variant="secondary"
								onClick={() => setShowLogoutDialog(false)}
							>
								إلغاء
							</Button>
							<Button
								variant="destructive"
								onClick={handleConfirmLogout}
								disabled={isLoading}
							>
								تسجيل الخروج {isLoading && "..."}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
