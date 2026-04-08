"use client";

import { useState } from "react";
import { XIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import AppInput from "@/components/forms/AppInput";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("authDialog.resetPassword");
	const tForm = useTranslations("form");
	const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
	const [showVerifyOtpDialog, setShowVerifyOtpDialog] = useState(false);
	const [values, setValues] = useState({ password: "", passwordConfirmation: "" });
	const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(null);
	const [mobile, setMobile] = useState("");
    const [isLoading, setIsLoading] = useState(false);

	const tAuthErrors = useTranslations("auth.errors");
	const tAuthMessages = useTranslations("auth.messages");

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!values.password || !values.passwordConfirmation) {
			toast.error(tForm("errors.requiredFields"));
			return;
		}
		if (values.password.length < 8) {
			toast.error(tForm("errors.tooShort", { count: 8 }));
			return;
		}
		if (values.password !== values.passwordConfirmation) {
			toast.error(tForm("errors.passwordsDoNotMatch"));
			return;
		}

		if (!resetPasswordToken) {
			toast.error(t("invalidToken"));
			return;
		}

        setIsLoading(true);
        try {
            const res = await apiClient<{ message: string }>({
                route: "/reset-password",
                method: "POST",
                body: JSON.stringify({
                    temp_token: resetPasswordToken,
                    password: values.password,
                    password_confirmation: values.passwordConfirmation,
                }),
            });
            toast.success(res.message || tAuthMessages("passwordResetSuccess"));
            setValues({ password: "", passwordConfirmation: "" });
            setResetPasswordToken(null);
            setShowResetPasswordDialog(false);
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || tAuthErrors("errorResettingPassword"));
        } finally {
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
								{t("title")}
							</DialogTitle>
							<DialogClose asChild>
								<button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                    <XIcon size={24} />
                                </button>
							</DialogClose>
						</div>
						<DialogDescription className="text-sm text-gray-500 mt-2 text-start font-medium">
							{t("description")}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={onSubmit} className="space-y-6">
						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">
								{t("newPassword")} <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder={t("newPasswordPlaceholder")}
								value={values.password}
								onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
								Icon={<LockIcon size={18} className="text-gray-400" />}
							/>
						</div>

						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">
								{t("confirmPassword")} <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder={t("confirmPasswordPlaceholder")}
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
							{isLoading ? tForm("labels.savingChanges") : t("submit")}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
