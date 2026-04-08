"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
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
import apiClient from "@/lib/apiClient";

interface DataSent {
	temp_token: string;
}

interface VerifyOtpDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mobile: string;
	onOtpVerified?: (data: DataSent) => void;
	/** Override the verify API route. Defaults to /verify-otp */
	verifyRoute?: string;
	/** Whether the verify route requires an auth token */
	verifyTokenRequire?: boolean;
	title?: string;
	description?: string;
}

export default function VerifyOtpDialog({
	open,
	onOpenChange,
	mobile,
	onOtpVerified,
	verifyRoute = "/verify-otp",
	verifyTokenRequire = false,
	title,
	description,
}: VerifyOtpDialogProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<{ code: string }>({ defaultValues: { code: "" } });

	const [resendCooldown, setResendCooldown] = useState(60);
	const [isLoading, setIsLoading] = useState(false);
	const [isResending, setIsResending] = useState(false);

	// Countdown timer for resend button
	useEffect(() => {
		if (!open || resendCooldown <= 0) return;
		const timer = setInterval(() => {
			setResendCooldown((prev) => {
				if (prev <= 1) { clearInterval(timer); return 0; }
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, [open, resendCooldown]);

	const onSubmit = async (values: { code: string }) => {
		if (!mobile.trim()) return;

		setIsLoading(true);
		try {
			const res = await apiClient<{ message?: string; data: DataSent }>({
				route: verifyRoute,
				method: "POST",
				body: JSON.stringify({ mobile, code: values.code }),
				tokenRequire: verifyTokenRequire,
			});
			toast.success(res.message || "تم التحقق بنجاح");
			onOtpVerified?.(res.data);
			reset({ code: "" });
			onOpenChange(false);
		} catch (err: unknown) {
			const error = err as { message?: string };
			toast.error(error?.message || "رمز التحقق غير صحيح");
		} finally {
			setIsLoading(false);
		}
	};

	const onResendOtp = async () => {
		if (resendCooldown > 0 || isResending || !mobile.trim()) return;

		setIsResending(true);
		try {
			const res = await apiClient<{ message: string }>({
				route: "/resend-otp",
				method: "POST",
				body: JSON.stringify({ mobile }),
			});
			toast.success(res.message || "تم إعادة إرسال الرمز");
			setResendCooldown(60);
		} catch (err: unknown) {
			const error = err as { message?: string };
			toast.error(error?.message || "فشل إعادة إرسال الرمز");
		} finally {
			setIsResending(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="lg:px-20 lg:py-15 lg:rounded-[40px] max-w-xl mx-auto"
			>
				<DialogHeader className="mb-6">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-start text-2xl font-bold text-primary">
							{title ?? "أدخل رمز التحقق"}
						</DialogTitle>
						<DialogClose asChild>
							<button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
								<XIcon size={24} />
							</button>
						</DialogClose>
					</div>
					<DialogDescription className="text-sm text-gray-500 mt-2 text-start font-medium">
						{description ?? `أرسلنا رمز تحقق مكوّن من 4 أرقام إلى +968 ${mobile}. أدخله أدناه.`}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<AppInput
							inputMode="numeric"
							maxLength={4}
							placeholder="أدخل الرمز المكوّن من 4 أرقام"
							className="tracking-widest text-lg font-bold text-center"
							{...register("code", {
								required: "هذا الحقل مطلوب",
								pattern: { value: /^\d{4}$/, message: "يجب أن يكون رمزاً مكوّناً من 4 أرقام" },
							})}
						/>
						{errors.code && (
							<p className="text-destructive text-sm mt-2 font-bold text-center">
								{errors.code.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all"
					>
						{isLoading ? "جارٍ التحقق..." : "تحقق من الرمز"}
					</Button>

					<Button
						type="button"
						variant="link"
						onClick={onResendOtp}
						disabled={resendCooldown > 0 || isResending}
						className="w-full text-accent font-bold mt-4"
					>
						{isResending ? "جارٍ الإرسال..." : "إعادة إرسال الرمز"}
						{resendCooldown > 0 && ` (${resendCooldown}s)`}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
