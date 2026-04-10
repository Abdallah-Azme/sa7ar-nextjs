"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LockIcon, XIcon } from "lucide-react";

import AppInput from "@/components/forms/AppInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";

interface ChangePasswordInputs {
	currentPassword: string;
	password: string;
	confirmPassword: string;
}

export default function ChangePasswordDialog() {
	const t = useTranslations("account.changePassword");
	const tForm = useTranslations("form");
	const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

	const {
		handleSubmit,
		register,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordInputs>({
		defaultValues: {
			currentPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit: SubmitHandler<ChangePasswordInputs> = async (values) => {
        setIsPending(true);
        try {
            const res = await apiClient<{ message: string }>({
                route: "/change-password",
                method: "POST",
                body: JSON.stringify({
                    current_password: values.currentPassword,
                    password: values.password,
                    password_confirmation: values.confirmPassword,
                }),
                tokenRequire: true,
            });
            toast.success(res.message);
            reset();
            setOpen(false);
        } catch (err: any) {
            toast.error(err.message || tForm("errors.errorOccurred"));
        } finally {
            setIsPending(false);
        }
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button type="button" variant="outline" className="rounded-full">
					{t("trigger")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg rounded-[32px] p-8">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-xl font-bold text-primary">
                        {t("dialog.heading")}
                    </DialogTitle>
                    <DialogClose asChild>
                        <button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
                            <XIcon size={24} />
                        </button>
                    </DialogClose>
                </DialogHeader>

				<form
					onSubmit={(e) => {
						e.stopPropagation();
						void handleSubmit(onSubmit)(e);
					}}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="current-password" title={t("fields.currentPassword")}>
							{t("fields.currentPassword")}
						</Label>
						<AppInput
							id="current-password"
							type="password"
							placeholder={t("placeholders.currentPassword")}
							Icon={<LockIcon size={18} className="text-secondary" />}
							{...register("currentPassword", {
								required: tForm("errors.requiredFields"),
								minLength: {
									value: 8,
									message: tForm("errors.tooShort", { count: 8 }),
								},
							})}
						/>
						{errors.currentPassword && <p className="text-destructive text-xs font-bold">{errors.currentPassword.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="new-password" title={t("fields.password")}>
							{t("fields.password")}
						</Label>
						<AppInput
							id="new-password"
							type="password"
							placeholder={t("placeholders.password")}
							Icon={<LockIcon size={18} className="text-secondary" />}
							{...register("password", {
								required: tForm("errors.requiredFields"),
								minLength: {
									value: 8,
									message: tForm("errors.tooShort", { count: 8 }),
								},
								maxLength: {
									value: 128,
									message: tForm("errors.tooLong", { count: 128 }),
								},
							})}
						/>
						{errors.password && <p className="text-destructive text-xs font-bold">{errors.password.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirm-new-password" title={t("fields.confirmPassword")}>
							{t("fields.confirmPassword")}
						</Label>
						<AppInput
							id="confirm-new-password"
							type="password"
							placeholder={t("placeholders.confirmPassword")}
							Icon={<LockIcon size={18} className="text-secondary" />}
							{...register("confirmPassword", {
								required: tForm("errors.requiredFields"),
								validate: (value, formValues) =>
									value === formValues.password ||
									tForm("errors.passwordsDoNotMatch"),
							})}
						/>
						{errors.confirmPassword && <p className="text-destructive text-xs font-bold">{errors.confirmPassword.message}</p>}
					</div>

					<div className="grid grid-cols-2 gap-3 pt-4">
						<Button
							type="button"
							variant="ghost"
							onClick={() => {
								reset();
								setOpen(false);
							}}
                            className="rounded-full font-bold h-12"
						>
							{t("dialog.cancel")}
						</Button>
						<Button type="submit" disabled={isPending} className="rounded-full font-bold h-12 bg-black-cu hover:bg-black-cu/90 text-white">
							{isPending
								? t("dialog.submitting")
								: t("dialog.confirm")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
