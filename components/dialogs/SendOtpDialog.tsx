"use client";

import { useForm } from "react-hook-form";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import AppMobileInput from "@/components/forms/AppMobileInput";
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
	otp: string;
	mobile: string;
}

interface SendOtpDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onOtpSent?: (data: DataSent) => void;
}

export default function SendOtpDialog({
	open,
	onOpenChange,
	onOtpSent,
}: SendOtpDialogProps) {
	const { register, handleSubmit, formState: { errors }, reset } = useForm<{ mobile: string }>({
		defaultValues: { mobile: "" },
	});

	const onSubmit = async (data: { mobile: string }) => {
		const mobile = data.mobile || "";
		if (!mobile.trim()) {
			toast.error("يرجى إدخال رقم الهاتف");
			return;
		}

        try {
            // OTP sending is handled by the auth flow upstream (VerifyOtpDialog)
            onOpenChange(false);
            onOtpSent?.({ otp: "0000", mobile });
            reset();
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || "حدث خطأ أثناء إرسال رمز OTP");
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
							نسيت كلمة المرور؟
						</DialogTitle>
						<DialogClose asChild>
							<button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                <XIcon size={24} />
                            </button>
						</DialogClose>
					</div>
					<DialogDescription className="text-sm text-gray-500 mt-2 text-start font-medium">
					أدخل رقم هاتفك المسجل لدينا، وسنرسل لك رمز لإعادة تعيين كلمة المرور.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<AppMobileInput
							{...register("mobile", {
								required: "Mobile is required",
								minLength: { value: 6, message: "Must be at least 6 digits" },
								pattern: { value: /^\d+$/, message: "Only numbers allowed" },
							})}
						/>
						{errors.mobile && (
							<p className="text-destructive text-xs mt-2 font-bold ps-2">
								{errors.mobile.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all"
					>
					إرسال رمز OTP
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
