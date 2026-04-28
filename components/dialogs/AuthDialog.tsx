"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserRound, XIcon, LockIcon, MailIcon, ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
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
import { useCmsPagesQuery } from "@/features/about/hooks/useCms";
import { getCmsPagePathByKey } from "@/features/about/services/cmsService";

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
	const t = useTranslations("authDialog.login");
	const tForm = useTranslations("form");
    const tAuthErrors = useTranslations("auth.errors");
	const { login, isLoading: isAuthLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

	const { register, handleSubmit, formState: { errors }, reset } = useForm<{ mobile: string; password: string }>({
		defaultValues: { mobile: "", password: "" },
	});

	const onSubmit = async (data: { mobile: string; password: string }) => {
        setIsSubmitting(true);
        try {
            const res = await apiClient<{ data?: { token?: string; user?: Profile } }>({
                route: "/login",
                method: "POST",
                body: JSON.stringify(data),
            });
            
            const token = res?.data?.token;
            const user = res?.data?.user;

            if (token && user) {
                await login(token, user);
                onOpenChange(false);
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || tAuthErrors("errorLoggingIn"));
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
				<DialogContent showCloseButton={false} className="lg:px-20 lg:py-15 lg:rounded-[40px] max-w-2xl mx-auto">
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
							{t("title")}
						</DialogTitle>
						<DialogDescription className="text-center text-sm text-gray-500 mt-2 font-medium">
							{t("description")}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
						<div>
							<AppMobileInput
								{...register("mobile", {
									required: tForm("errors.required"),
									minLength: { value: 6, message: tForm("errors.tooShort", { count: 6 }) },
								})}
							/>
							{errors.mobile && <p className="text-destructive text-xs mt-1 font-bold ps-2">{String(errors.mobile.message)}</p>}
						</div>

						<div className="space-y-3">
							<label className="font-bold text-gray-700">
								{t("password")} <span className="text-destructive">*</span>
							</label>
							<AppInput
								type="password"
								placeholder={t("passwordPlaceholder")}
								Icon={<LockIcon size={18} className="text-gray-400" />}
								{...register("password", {
									required: tForm("errors.required"),
									minLength: { value: 8, message: tForm("errors.tooShort", { count: 8 }) },
								})}
							/>
							{errors.password && <p className="text-destructive text-xs mt-1 font-bold ps-2">{String(errors.password.message)}</p>}
						</div>

						<div className="flex items-center justify-between text-xs font-bold text-gray-500 px-2">
							<label className="flex items-center gap-2 cursor-pointer hover:text-primary">
								<input type="checkbox" className="size-4 rounded accent-primary" />
								{t("rememberMe")}
							</label>
							<button
								type="button"
								onClick={() => {
									onOpenChange(false);
									setShowResetPasswordDialog(true);
								}}
								className="text-accent hover:underline"
							>
								{t("forgotPassword")}
							</button>
						</div>

						<Button
							type="submit"
							disabled={isSubmitting || isAuthLoading}
							className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all"
						>
							{isSubmitting ? tForm("labels.loggingIn") : t("submit")}
						</Button>
					</form>

					<div className="text-center text-sm font-medium text-gray-500 mt-6 pb-2">
						{t("noAccount")}
						<button
							className="text-accent ms-2 font-extrabold hover:underline"
							onClick={() => setActiveDialogOverride("signup")}
						>
							{t("createNew")}
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
	const t = useTranslations("authDialog.signup");
	const tForm = useTranslations("form");
	const { data: cmsPages } = useCmsPagesQuery();
	const termsPath = getCmsPagePathByKey(cmsPages, "terms_and_conditions");
	const privacyPath = getCmsPagePathByKey(cmsPages, "privacy_policy");
	const [showOtpDialog, setShowOtpDialog] = useState(false);
	const [otpMobile, setOtpMobile] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

	const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
		defaultValues: { name: "", email: "", mobile: "", password: "", confirmPassword: "", consent: false },
	});
    const password = watch("password");

	const tAuthErrors = useTranslations("auth.errors");
	const onSubmit = async (data: { name: string; email: string; mobile: string; password: string; confirmPassword: string; consent: boolean }) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                password_confirmation: data.confirmPassword,
            };
            
            await apiClient({
                route: "/signup",
                method: "POST",
                body: JSON.stringify(payload)
            });

            setOtpMobile(data.mobile);
            onOpenChange(false);
            setShowOtpDialog(true);
            reset();
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || tAuthErrors("errorSigningUp"));
        } finally {
            setIsSubmitting(false);
        }
	};

	return (
		<>
			<Dialog open={open && !showOtpDialog} onOpenChange={(open) => { reset(); onOpenChange(open); }}>
				<DialogContent showCloseButton={false} className="lg:px-20 lg:py-15 lg:rounded-[40px] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
					<DialogHeader className="mb-6 relative">
                        <DialogTitle className="text-start text-xl font-bold text-primary flex items-center gap-3">
                            <button onClick={onBackToLogin} className="hover:-translate-x-1 transition-transform bg-gray-100 p-2 rounded-full rtl:rotate-180">
                                <ArrowLeftIcon size={16} />
                            </button>
                            {t("title")}
                        </DialogTitle>
                        <DialogClose asChild>
                            <button className="absolute -top-2 inset-e-0 transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                                <XIcon size={24} />
                            </button>
                        </DialogClose>
					</DialogHeader>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700">{t("fullName")} <span className="text-destructive">*</span></label>
							<AppInput
								placeholder={t("fullNamePlaceholder")}
								Icon={<UserRound size={17} className="text-gray-400" />}
								{...register("name", { required: tForm("errors.required") })}
							/>
                            {errors.name && <p className="text-destructive text-xs font-bold ps-2">{String(errors.name.message)}</p>}
						</div>

						<div>
							<AppMobileInput
                                withoutLabel
								{...register("mobile", {
									required: tForm("errors.required"),
									minLength: { value: 6, message: tForm("errors.tooShort", { count: 6 }) },
								})}
							/>
                            {errors.mobile && <p className="text-destructive text-xs font-bold ps-2">{String(errors.mobile.message)}</p>}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700">{t("email")} <span className="text-destructive">*</span></label>
							<AppInput
								type="email"
								placeholder={t("emailPlaceholder")}
								Icon={<MailIcon size={17} className="text-gray-400" />}
								{...register("email", { 
                                    required: tForm("errors.required"),
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: tForm("errors.invalidEmail") }
                                })}
							/>
                            {errors.email && <p className="text-destructive text-xs font-bold ps-2">{String(errors.email.message)}</p>}
						</div>

						<div className="space-y-2 relative">
							<label className="text-sm font-bold text-gray-700">{t("password")} <span className="text-destructive">*</span></label>
							<AppInput
								type="password"
								placeholder={t("passwordPlaceholder")}
								Icon={<LockIcon size={17} className="text-gray-400" />}
								{...register("password", { required: tForm("errors.required"), minLength: { value: 8, message: tForm("errors.tooShort", { count: 8 }) } })}
							/>
                            {errors.password && <p className="text-destructive text-xs font-bold ps-2">{String(errors.password.message)}</p>}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700">{t("confirmPassword")} <span className="text-destructive">*</span></label>
							<AppInput
								type="password"
								placeholder={t("confirmPasswordPlaceholder")}
								Icon={<LockIcon size={17} className="text-gray-400" />}
								{...register("confirmPassword", { 
                                    required: tForm("errors.required"),
                                    validate: value => value === password || tForm("errors.passwordsDoNotMatch") 
                                })}
							/>
                            {errors.confirmPassword && <p className="text-destructive text-xs font-bold ps-2">{String(errors.confirmPassword.message)}</p>}
						</div>

						<div className="pt-2">
							<div className="flex gap-3 text-xs items-start">
								<input
									type="checkbox"
									className="size-5 shrink-0 rounded accent-accent mt-0.5"
									{...register("consent", { required: tForm("errors.mustAcceptTerms") })}
								/>
								<p className="text-gray-500 font-medium leading-relaxed">
									{t("consentPrefix")}
                                    <Link href={termsPath} className="font-extrabold text-primary hover:underline mx-1">{t("consentTerms")}</Link>
                                    {useTranslations("common")("and")}
                                    <Link href={privacyPath} className="font-extrabold text-primary hover:underline ms-1">{t("consentPrivacy")}</Link>.
								</p>
							</div>
							{errors.consent && <p className="text-destructive text-xs font-bold ps-2 mt-1">{String(errors.consent.message)}</p>}
						</div>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all mt-4"
						>
							{isSubmitting ? tForm("labels.creatingAccount") : t("submit")}
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
