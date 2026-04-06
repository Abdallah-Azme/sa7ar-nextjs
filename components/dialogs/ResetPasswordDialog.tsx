"use client";

import { useState } from "react";
import { XIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
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
			toast.error("يرجى تعبئة حقلي كلمة المرور");
			return;
		}
		if (values.password.length < 8) {
			toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
			return;
		}
		if (values.password !== values.passwordConfirmation) {
			toast.error("كلمتا المرور غير متطابقتين");
			return;
		}

		if (!resetPasswordToken) {
			toast.error("رمز إعادة التعيين غير صالح. يرجى إعادة المحاولة");
			return;
		}

        setIsLoading(true);
        try {
            const res = await apiClient({
                route: "/reset-password",
                method: "POST",
                body: JSON.stringify({
                    temp_token: resetPasswordToken,
                    password: values.password,
                    password_confirmation: values.passwordConfirmation,
                }),
            });
            toast.success(res.message || "تم تغيير كلمة المرور بنجاح");
            setValues({ password: "", passwordConfirmation: "" });
            setResetPasswordToken(null);
            setShowResetPasswordDialog(false);
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
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
								تعيين كلمة مرور جديدة
							</DialogTitle>
							<DialogClose asChild>
								<button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                    <XIcon size={24} />
                                </button>
							</DialogClose>
						</div>
						<DialogDescription className="text-sm text-gray-500 mt-2 text-start font-medium">
							اختر كلمة مرور قوية لم تستخدمها من قبل.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={onSubmit} className="space-y-6">
						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">
								كلمة المرور الجديدة <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder="أدخل كلمة المرور الجديدة"
								value={values.password}
								onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
								Icon={<LockIcon size={18} className="text-gray-400" />}
							/>
						</div>

						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">
								تأكيد كلمة المرور <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder="أعد إدخال كلمة المرور"
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
							{isLoading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
