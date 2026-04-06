"use client";

import { useState } from "react";
import { XIcon, LockIcon } from "lucide-react";
import AppInput from "@/components/forms/AppInput";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import SendOtpDialog from "./SendOtpDialog";
import VerifyOtpDialog from "./VerifyOtpDialog";

export default function ResetPasswordDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
	const [showVerifyOtpDialog, setShowVerifyOtpDialog] = useState(false);
	const [values, setValues] = useState({ password: "", passwordConfirmation: "" });
	const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(null);
	const [mobile, setMobile] = useState("");
    const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!values.password || !values.passwordConfirmation) {
			alert("Please fill in both fields");
			return;
		}
		if (values.password.length < 8) {
            alert("Password must be at least 8 characters");
			return;
		}
		if (values.password !== values.passwordConfirmation) {
            alert("Passwords do not match");
			return;
		}

        setIsLoading(true);
        try {
            console.log("Resetting password with token:", resetPasswordToken);
            // Simulate mutation logic to replace TanStack
            setTimeout(() => {
                setValues({ password: "", passwordConfirmation: "" });
                setResetPasswordToken(null);
                setShowResetPasswordDialog(false);
                setIsLoading(false);
                alert("Password reset successfully!");
            }, 1500);
        } catch (err) {
            console.error("Failed to reset password", err);
            setIsLoading(false);
        }
	};

	return (
		<>
			{/* Step 1: Request Mobile Number to send OTP */}
			<SendOtpDialog
				open={open}
				onOpenChange={onOpenChange}
				onOtpSent={(data) => {
					setMobile(data.mobile);
					setShowVerifyOtpDialog(true);
				}}
			/>

			{/* Step 2: Verify the OTP that was received */}
			<VerifyOtpDialog
				mobile={mobile}
				open={showVerifyOtpDialog}
				onOpenChange={setShowVerifyOtpDialog}
				onOtpVerified={(data) => {
					setResetPasswordToken(data.temp_token);
					setShowResetPasswordDialog(true);
				}}
			/>

			{/* Step 3: Enter new Password */}
			<Dialog
				open={showResetPasswordDialog}
				onOpenChange={setShowResetPasswordDialog}
			>
				<DialogContent
					showCloseButton={false}
					className="lg:px-20 lg:py-15 lg:rounded-[40px] max-w-xl mx-auto"
				>
					<DialogHeader className="mb-6">
						<div className="flex items-center justify-between">
							<DialogTitle className="text-start text-2xl font-bold text-primary">
								Set New Password
							</DialogTitle>
							<DialogClose asChild>
								<button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                    <XIcon size={24} />
                                </button>
							</DialogClose>
						</div>
						<DialogDescription className="text-sm text-gray-500 mt-2 text-start font-medium">
							Please choose a strong password that you haven't used before.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={onSubmit} className="space-y-6">
						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">
								New Password <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder="Enter your new password"
								value={values.password}
								onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
								Icon={<LockIcon size={18} className="text-gray-400" />}
							/>
						</div>

						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">
								Confirm Password <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder="Re-enter your new password"
								value={values.passwordConfirmation}
								onChange={(e) => setValues((prev) => ({ ...prev, passwordConfirmation: e.target.value }))}
								Icon={<LockIcon size={18} className="text-gray-400" />}
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all"
						>
							Update Password
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
