"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserRound, XIcon, LockIcon, MailIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import ImageFallback from "@/components/shared/ImageFallback";
import AppInput from "@/components/forms/AppInput";
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
import { useAuth } from "@/contexts/AuthContext";
import ResetPasswordDialog from "./ResetPasswordDialog";
import VerifyOtpDialog from "./VerifyOtpDialog";
import apiClient from "@/lib/apiClient";
import type { Profile } from "@/types";

type DialogMode = "login" | "signup";

export default function AuthDialog({
	open,
	onOpenChange,
	mode = "login",
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode?: DialogMode;
}) {
	const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
	const [activeDialogOverride, setActiveDialogOverride] = useState<DialogMode | null>(null);
	const activeDialog = activeDialogOverride ?? mode;
	const { login, isLoading: isAuthLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

	const { register, handleSubmit, formState: { errors }, reset } = useForm({
		defaultValues: { mobile: "", password: "" },
	});

	const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await apiClient<{ token: string; user: Profile }>({
                route: "/login",
                method: "POST",
                body: JSON.stringify(data),
            });
            
            if (res.data?.token) {
                await login(res.data.token, res.data.user);
                onOpenChange(false);
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || "حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setIsSubmitting(false);
        }
	};

	const handleClose = (nextOpen: boolean) => {
		reset();
		if (!nextOpen) {
			setActiveDialogOverride(null);
			onOpenChange(false);
		}
	};

	return (
		<>
			<Dialog open={open && activeDialog === "login"} onOpenChange={handleClose}>
				<DialogContent showCloseButton={false} className="lg:px-20 lg:py-15 lg:rounded-[40px] max-w-xl mx-auto">
					<DialogHeader>
                        <div className="absolute top-6 inset-e-6">
                            <DialogClose asChild>
                                <button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                    <XIcon size={24} />
                                </button>
                            </DialogClose>
                        </div>
						<ImageFallback
							src="/images/logo-titled.svg"
							className="w-19 h-28 mx-auto"
							alt="Sohar Water"
							width={76}
							height={112}
						/>
						<DialogTitle className="text-center text-2xl font-bold mt-4 text-primary">
							Welcome Back!
						</DialogTitle>
						<DialogDescription className="text-center text-sm text-gray-500 mt-2 font-medium">
							Please enter your credentials to log in.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
						<div>
							<AppMobileInput
								{...register("mobile", {
									required: "Phone is required",
									minLength: { value: 6, message: "Too short" },
								})}
							/>
							{errors.mobile && <p className="text-destructive text-xs mt-1 font-bold ps-2">{String(errors.mobile.message)}</p>}
						</div>

						<div className="space-y-3">
							<label className="font-bold text-gray-700">
								Password <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder="Enter your password"
								Icon={<LockIcon size={18} className="text-gray-400" />}
								{...register("password", {
									required: "Password is required",
									minLength: { value: 8, message: "Min 8 characters" },
								})}
							/>
							{errors.password && <p className="text-destructive text-xs mt-1 font-bold ps-2">{String(errors.password.message)}</p>}
						</div>

						<div className="flex items-center justify-between text-xs font-bold text-gray-500 px-2">
							<label className="flex items-center gap-2 cursor-pointer hover:text-primary">
								<input type="checkbox" className="size-4 rounded accent-primary" />
								Remember me
							</label>
							<button
								type="button"
								onClick={() => {
									onOpenChange(false);
									setShowResetPasswordDialog(true);
								}}
								className="text-accent hover:underline"
							>
								Forgot Password?
							</button>
						</div>

						<Button
							type="submit"
							disabled={isSubmitting || isAuthLoading}
							className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all"
						>
							{isSubmitting ? "Logging in..." : "Login"}
						</Button>
					</form>

					<div className="text-center text-sm font-medium text-gray-500 mt-6 pb-2">
						Don't have an account?
						<button
							className="text-accent ms-2 font-extrabold hover:underline"
							onClick={() => setActiveDialogOverride("signup")}
						>
							Create New
						</button>
					</div>
				</DialogContent>
			</Dialog>

			<SignupDialog
				open={open && activeDialog === "signup"}
				onOpenChange={handleClose}
				onBackToLogin={() => setActiveDialogOverride("login")}
			/>

			<ResetPasswordDialog
				open={showResetPasswordDialog}
				onOpenChange={setShowResetPasswordDialog}
			/>
		</>
	);
}

// ==========================================
// Signup Dialog Component Internal
// ==========================================
function SignupDialog({
	open,
	onOpenChange,
	onBackToLogin,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onBackToLogin: () => void;
}) {
	const [showOtpDialog, setShowOtpDialog] = useState(false);
	const [otpMobile, setOtpMobile] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

	const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
		defaultValues: { name: "", email: "", mobile: "", password: "", confirmPassword: "", consent: false },
	});
    const password = watch("password");

	const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                password_confirmation: data.confirmPassword,
            };
            
            await apiClient({
                route: "/register",
                method: "POST",
                body: JSON.stringify(payload)
            });

            setOtpMobile(data.mobile);
            onOpenChange(false);
            setShowOtpDialog(true);
            reset();
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || "حدث خطأ أثناء إنشاء الحساب");
        } finally {
            setIsSubmitting(false);
        }
	};

	return (
		<>
			<Dialog open={open && !showOtpDialog} onOpenChange={(open) => { reset(); onOpenChange(open); }}>
				<DialogContent showCloseButton={false} className="lg:px-20 lg:py-15 lg:rounded-[40px] max-w-xl mx-auto max-h-[90vh] overflow-y-auto">
					<DialogHeader className="mb-6 relative">
                        <DialogTitle className="text-start text-xl font-bold text-primary flex items-center gap-3">
                            <button onClick={onBackToLogin} className="hover:-translate-x-1 transition-transform bg-gray-100 p-2 rounded-full">
                                <ArrowLeftIcon size={16} />
                            </button>
                            Join Our Family
                        </DialogTitle>
                        <DialogClose asChild>
                            <button className="absolute -top-2 inset-e-0 transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                <XIcon size={24} />
                            </button>
                        </DialogClose>
					</DialogHeader>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700">Full Name <span className="text-destructive">*</span></label>
							<AppInput
								placeholder="e.g. Abdullah Ahmed"
								Icon={<UserRound size={17} className="text-gray-400" />}
								{...register("name", { required: "Name is required" })}
							/>
                            {errors.name && <p className="text-destructive text-xs font-bold ps-2">{String(errors.name.message)}</p>}
						</div>

						<div>
							<AppMobileInput
                                withoutLabel
								{...register("mobile", {
									required: "Phone is required",
									minLength: { value: 6, message: "Too short" },
								})}
							/>
                            {errors.mobile && <p className="text-destructive text-xs font-bold ps-2">{String(errors.mobile.message)}</p>}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700">Email Address <span className="text-destructive">*</span></label>
							<AppInput
								type="email"
								placeholder="yourname@gmail.com"
								Icon={<MailIcon size={17} className="text-gray-400" />}
								{...register("email", { required: "Email is required" })}
							/>
                            {errors.email && <p className="text-destructive text-xs font-bold ps-2">{String(errors.email.message)}</p>}
						</div>

						<div className="space-y-2 relative">
							<label className="text-sm font-bold text-gray-700">Password <span className="text-destructive">*</span></label>
							<AppInput
								type="password"
								placeholder="Create a strong password"
								Icon={<LockIcon size={17} className="text-gray-400" />}
								{...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 chars" } })}
							/>
                            {errors.password && <p className="text-destructive text-xs font-bold ps-2">{String(errors.password.message)}</p>}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700">Confirm Password <span className="text-destructive">*</span></label>
							<AppInput
								type="password"
								placeholder="Re-enter password"
								Icon={<LockIcon size={17} className="text-gray-400" />}
								{...register("confirmPassword", { 
                                    validate: value => value === password || "Passwords do not match" 
                                })}
							/>
                            {errors.confirmPassword && <p className="text-destructive text-xs font-bold ps-2">{String(errors.confirmPassword.message)}</p>}
						</div>

						<div className="pt-2">
							<div className="flex gap-3 text-xs items-start">
								<input
									type="checkbox"
									className="size-5 shrink-0 rounded accent-accent mt-0.5"
									{...register("consent", { required: "You must accept our terms" })}
								/>
								<p className="text-gray-500 font-medium leading-relaxed">
									By clicking "Submit", I acknowledge that I have read and agree to the 
                                    <Link href="/terms" className="font-extrabold text-primary hover:underline mx-1">Terms & Conditions</Link> 
                                    and 
                                    <Link href="/privacy" className="font-extrabold text-primary hover:underline ms-1">Privacy Policy</Link>.
								</p>
							</div>
							{errors.consent && <p className="text-destructive text-xs font-bold ps-2 mt-1">{String(errors.consent.message)}</p>}
						</div>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all mt-4"
						>
							{isSubmitting ? "Creating Account..." : "Create Account"}
						</Button>
					</form>
				</DialogContent>
			</Dialog>

			<VerifyOtpDialog
				open={showOtpDialog}
				onOpenChange={setShowOtpDialog}
				mobile={otpMobile}
			/>
		</>
	);
}
