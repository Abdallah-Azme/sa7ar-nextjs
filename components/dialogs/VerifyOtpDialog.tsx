"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { XIcon } from "lucide-react";
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

interface DataSent {
	temp_token: string;
}

interface VerifyOtpDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mobile: string;
	onOtpVerified?: (data: DataSent) => void;
	title?: string;
	description?: string;
}

export default function VerifyOtpDialog({
	open,
	onOpenChange,
	mobile,
	onOtpVerified,
	title,
	description,
}: VerifyOtpDialogProps) {
	const { register, handleSubmit, formState: { errors }, reset } = useForm<{ code: string }>({
		defaultValues: { code: "" },
	});
	
    const [resendCooldown, setResendCooldown] = useState(60);
    const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!open || resendCooldown <= 0) return;

		const timer = setInterval(() => {
			setResendCooldown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [open, resendCooldown]);

	const onSubmit = async (values: { code: string }) => {
		if (!mobile.trim()) return;

        setIsLoading(true);
        try {
            console.log("Verifying OTP:", values.code, "for mobile:", mobile);
            // Simulate API logic to replace TanStack mutation
            setTimeout(() => {
                onOtpVerified?.({ temp_token: "mock-temp-token-123" });
                reset({ code: "" });
                onOpenChange(false);
                setIsLoading(false);
            }, 1000);
        } catch (err) {
            console.error("OTP Verification failed", err);
            setIsLoading(false);
        }
	};

	const onResendOtp = () => {
		if (resendCooldown > 0 || isLoading) return;
        setResendCooldown(60);
        // Dispatch to Server Action natively
        console.log("Resending OTP for:", mobile);
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
							{title ?? "Enter Security Code"}
						</DialogTitle>
						<DialogClose asChild>
							<button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                <XIcon size={24} />
                            </button>
						</DialogClose>
					</div>
					<DialogDescription className="text-sm text-gray-500 mt-2 text-start font-medium">
						{description ?? `We've sent a 4-digit verification code to +968 ${mobile}. Please enter it below.`}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<AppInput
							inputMode="numeric"
							maxLength={4}
							placeholder="Enter 4-digit code"
                            className="tracking-widest text-lg font-bold text-center"
							{...register("code", {
								required: "Code is required",
								pattern: { value: /^\d{4}$/, message: "Must be a 4-digit number" },
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
						Verify Code
					</Button>

					<Button
						type="button"
						variant="link"
						onClick={onResendOtp}
						disabled={resendCooldown > 0}
						className="w-full text-accent font-bold mt-4"
					>
						Re-send Code
						{resendCooldown > 0 && ` (${resendCooldown}s)`}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
