"use client";

import { UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthDialog from "@/components/dialogs/AuthDialog";
import { useState } from "react";

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
	const [authMode, setAuthMode] = useState<"login" | "signup">("login");
	const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

	return (
		<>
			<DropdownMenu open={open} onOpenChange={onOpenChange}>
				<DropdownMenuTrigger asChild>
					<Button
						size={"icon-lg"}
						variant="secondary"
						className="rounded-full size-12 flex place-content-center"
					>
						<UserRoundIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem asChild>
						<button
							onClick={() => {
								setAuthMode("login");
								setIsAuthDialogOpen(true);
							}}
							type="button"
							className="w-full"
						>
							تسجيل الدخول
						</button>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<button
							onClick={() => {
								setAuthMode("signup");
								setIsAuthDialogOpen(true);
							}}
							type="button"
							className="w-full"
						>
							إنشاء حساب
						</button>
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
