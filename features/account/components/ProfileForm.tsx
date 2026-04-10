"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { UserRoundIcon, CloudDownloadIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import AppInput from "@/components/forms/AppInput";
import AppMobileInput from "@/components/forms/AppMobileInput";
import AppDialog from "@/components/dialogs/AppDialog";
import ChangePasswordDialog from "@/components/dialogs/ChangePasswordDialog";
import VerifyOtpDialog from "@/components/dialogs/VerifyOtpDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfileMutation, useDeleteAccountMutation } from "@/features/auth/hooks/useAuth";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils";

interface Inputs {
	name: string;
	email: string;
	mobile: string;
}

export default function ProfileForm() {
    const { data: userRaw } = useProfile();
    const user = userRaw as Profile | undefined;

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [showVerifyMobileDialog, setShowVerifyMobileDialog] = useState(false);
	const [mobileVerificationData, setMobileVerificationData] = useState<{
		oldMobile: string;
		newMobile: string;
	} | null>(null);

    const updateProfileMutation = useUpdateProfileMutation();
    const deleteAccountMutation = useDeleteAccountMutation();

	const tAccount = useTranslations("account");
	const tForm = useTranslations("form");

	const { handleSubmit, register, reset } = useForm<Inputs>({
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			mobile: user?.mobile || "",
		},
	});

	useEffect(() => {
		reset({
			name: user?.name || "",
			email: user?.email || "",
			mobile: user?.mobile || "",
		});
	}, [reset, user]);

	const imagePreview = useMemo(() => {
		if (!imageFile) return "";
		return URL.createObjectURL(imageFile);
	}, [imageFile]);

	useEffect(() => {
		return () => {
			if (imagePreview) URL.revokeObjectURL(imagePreview);
		};
	}, [imagePreview]);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("mobile", data.mobile.trim());
        if (imageFile) formData.append("image", imageFile);

        try {
            const res = await updateProfileMutation.mutateAsync(formData);
            toast.success(res.message);
            
            const oldMobile = res.data?.old_mobile;
            const newMobile = res.data?.new_mobile;

            if (newMobile && oldMobile && newMobile !== oldMobile) {
                setMobileVerificationData({ oldMobile, newMobile });
                setShowVerifyMobileDialog(true);
            }
        } catch (err: any) {
            toast.error(err.message || tForm("errors.errorOccurred"));
        }
	};

	const onConfirmDeleteAccount = async () => {
		try {
			await deleteAccountMutation.mutateAsync();
			setDeleteDialogOpen(false);
		} catch {
			return;
		}
	};

	const userImage = user?.image ?? "";
	const displayImage = imagePreview || userImage;
	const avatarClass = "size-19 shrink-0 rounded-full border";

	return (
		<>
			<div className="space-y-5">
				<div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white rounded-2xl px-10 py-3.5 border border-black/5 shadow-sm">
					{/* Avatar */}
					<div className="flex items-center gap-3">
						{displayImage ? (
							<img
								src={displayImage}
								alt="img"
								width={75}
								height={75}
								loading="lazy"
								onError={(e) => {
									e.currentTarget.src = "/images/logo.svg";
								}}
								className={avatarClass}
							/>
						) : (
							<label
								htmlFor="avatar-upload"
								className={cn(
									avatarClass,
									"bg-background-cu flex items-center justify-center text-accent cursor-pointer",
								)}
							>
								<CloudDownloadIcon size={26} />
							</label>
						)}
						<div className="space-y-3">
							<h3 className="font-extrabold text-xs">
								<label
									htmlFor="avatar-upload"
									className="text-accent cursor-pointer hover:underline underline-offset-4"
								>
									{tForm("labels.uploadClick")}
								</label>{" "}
								{tForm("labels.uploadAvatar")}
							</h3>
							<p className="text-gray text-xs">{tForm("labels.avatarHint")}</p>
						</div>
						<input
							type="file"
							id="avatar-upload"
							className="hidden"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.[0] ?? null;
								setImageFile(file);
							}}
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-3">
						<label
							htmlFor="avatar-upload"
							className={cn(
								avatarClass,
								"bg-background-cu flex items-center text-gray justify-center size-12 cursor-pointer",
							)}
						>
							<CloudDownloadIcon size={16} />
							<span className="sr-only">
								{tForm("labels.uploadNewAvatar")}
							</span>
						</label>
					</div>
				</div>

				<div className="bg-white p-10 rounded-2xl border border-black/5 shadow-sm">
					<form
						className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="space-y-3">
							<Label htmlFor="name" className="font-bold text-gray-700">{tForm("labels.fullName")}</Label>
							<AppInput
								id="name"
								placeholder={tForm("placeholders.fullName")}
								Icon={
									<UserRoundIcon className="text-secondary size-6 stroke-1" />
								}
								{...register("name")}
							/>
						</div>

						<div className="space-y-3">
							<Label htmlFor="email" className="font-bold text-gray-700">{tForm("labels.email")}</Label>
							<AppInput
								id="email"
								placeholder={tForm("placeholders.email")}
								Icon={<MailIcon className="text-secondary size-6 *:stroke-1 text-gray-400" />}
								{...register("email")}
							/>
						</div>

						<AppMobileInput {...register("mobile")} />

						<Button
							disabled={updateProfileMutation.isPending}
							className="col-span-full rounded-full mt-7 bg-black-cu hover:bg-black-cu/80 cursor-pointer h-12 font-bold text-white shadow-md transition-all sm:w-fit px-12"
						>
							{updateProfileMutation.isPending ? tForm("labels.savingChanges") : tForm("labels.saveChanges")}
						</Button>
					</form>
					<div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
						<ChangePasswordDialog />

						<AppDialog
							open={deleteDialogOpen}
							onOpenChange={setDeleteDialogOpen}
							heading={tAccount("deleteAccount.dialog.heading")}
							className="sm:max-w-md"
							trigger={
								<Button
									type="button"
									variant="destructive"
									className="rounded-full w-fit font-bold px-8 shadow-sm"
								>
									{tAccount("deleteAccount.trigger")}
								</Button>
							}
						>
							<div className="space-y-5">
								<p className="text-xs text-gray font-medium">
									{tAccount("deleteAccount.dialog.description")}
								</p>
								<div className="grid grid-cols-2 gap-3">
									<Button
										type="button"
										variant="ghost"
                                        className="rounded-full font-bold h-12"
										onClick={() => setDeleteDialogOpen(false)}
									>
										{tAccount("deleteAccount.dialog.cancel")}
									</Button>
									<Button
										type="button"
										variant="destructive"
                                        className="rounded-full font-bold h-12 shadow-sm"
										onClick={onConfirmDeleteAccount}
										disabled={deleteAccountMutation.isPending}
									>
										{deleteAccountMutation.isPending
											? tAccount("deleteAccount.dialog.deleting")
											: tAccount("deleteAccount.dialog.confirm")}
									</Button>
								</div>
							</div>
						</AppDialog>
					</div>
				</div>
			</div>

			<VerifyOtpDialog
				open={showVerifyMobileDialog}
				onOpenChange={setShowVerifyMobileDialog}
				mobile={mobileVerificationData?.oldMobile ?? ""}
				title={tAccount("changeMobile.dialog.title")}
				description={tAccount("changeMobile.dialog.description")}
                verifyRoute="/verify-mobile"
                verifyTokenRequire
                verifyPayloadBuilder={(values) => ({
                    old_mobile: mobileVerificationData?.oldMobile ?? "",
                    new_mobile: mobileVerificationData?.newMobile ?? "",
                    otp: values.code,
                })}
			/>
		</>
	);
}
