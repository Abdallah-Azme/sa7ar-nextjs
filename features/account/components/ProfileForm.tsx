"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { UserRoundIcon, CloudDownloadIcon, MailIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import ImageFallback from "@/components/shared/ImageFallback";
import AppInput from "@/components/forms/AppInput";
import AppMobileInput from "@/components/forms/AppMobileInput";
import VerifyOtpDialog from "@/components/dialogs/VerifyOtpDialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";

interface ProfileInputs {
	name: string;
	email: string;
	mobile: string;
}

export default function ProfileForm() {
	const { user, setUser, logout } = useAuth();
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	
	const [showVerifyMobileDialog, setShowVerifyMobileDialog] = useState(false);
	const [mobileVerificationData, setMobileVerificationData] = useState<{ oldMobile: string; newMobile: string } | null>(null);

	const { register, handleSubmit, reset } = useForm<ProfileInputs>({
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

	const onSubmit = async (data: ProfileInputs) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("mobile", data.mobile.trim());
            if (imageFile) formData.append("image", imageFile);

            const res = await apiClient<{ old_mobile: string; new_mobile: string }>({
                route: "/edit-profile",
                method: "POST",
                body: formData,
            });

            if (user) {
                setUser({ ...user, name: data.name, email: data.email, mobile: data.mobile.trim() });
            }

            const oldMobile = res.data?.old_mobile;
            const newMobile = res.data?.new_mobile;

            if (newMobile && oldMobile && newMobile !== oldMobile) {
                setMobileVerificationData({ oldMobile, newMobile });
                setShowVerifyMobileDialog(true);
            } else {
                toast.success("تم تحديث الملف الشخصي بنجاح");
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || "حدث خطأ أثناء تحديث الملف الشخصي");
        } finally {
            setIsSubmitting(false);
        }
	};

	const onDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await apiClient({ route: "/delete-account", method: "POST" });
            await logout();
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || "حدث خطأ أثناء حذف الحساب");
            setIsDeleting(false);
        }
	};

	const displayImage = imagePreview || user?.image || "";
	const avatarClass = "size-20 sm:size-24 shrink-0 rounded-full border shadow-sm object-cover";

	return (
		<>
			<div className="space-y-6">
                {/* 1. Avatar Section */}
				<div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
					<div className="flex items-center gap-6">
						{displayImage ? (
							<ImageFallback
								src={displayImage}
								alt="صورة الملف الشخصي"
								width={96}
								height={96}
								className={avatarClass}
							/>
						) : (
							<label htmlFor="avatar-upload" className={cn(avatarClass, "bg-gray-50 flex items-center justify-center text-accent cursor-pointer hover:bg-gray-100 transition-colors")}>
								<CloudDownloadIcon size={32} />
							</label>
						)}
						<div className="space-y-2">
							<h3 className="font-extrabold text-sm text-primary">
								<label htmlFor="avatar-upload" className="text-accent cursor-pointer hover:underline">
									اضغط للرفع
								</label>{" "}
								صورتك الجديدة
							</h3>
							<p className="text-gray-500 text-xs font-medium">يدعم SVG وPNG وJPG وGIF (بحد أقصى 800x400 بكسل)</p>
						</div>
						<input
							type="file"
							id="avatar-upload"
							className="hidden"
							accept="image/*"
							onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
						/>
					</div>

					<div className="flex items-center gap-3">
						{displayImage && (
                            <button
                                type="button"
                                onClick={() => setImageFile(null)}
                                title="Remove"
                                className="bg-destructive/10 text-destructive flex items-center justify-center size-12 rounded-full hover:bg-destructive/20 transition-colors"
                            >
                                <Trash2Icon size={18} />
                            </button>
                        )}
					</div>
				</div>

                {/* 2. Details Form */}
				<div className="bg-white p-8 sm:p-12 rounded-3xl border border-black/5 shadow-sm">
					<form className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
							<AppInput
								placeholder="e.g. Abdullah"
								Icon={<UserRoundIcon className="text-gray-400 size-5" />}
								{...register("name", { required: true })}
							/>
						</div>

						<div className="space-y-3">
							<label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
							<AppInput
								placeholder="e.g. email@domain.com"
								Icon={<MailIcon className="text-gray-400 size-5" />}
								{...register("email", { required: true })}
							/>
						</div>

						<div className="space-y-3">
							<AppMobileInput {...register("mobile", { required: true })} />
						</div>

						<Button
							disabled={isSubmitting}
							className="col-span-full h-14 rounded-full mt-4 bg-primary hover:bg-accent text-white font-bold shadow-md transition-all sm:w-fit px-12"
						>
							{isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
						</Button>
					</form>

                    {/* Dangerous Actions */}
					<div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-gray-100">
						<Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" variant="destructive" className="rounded-full font-bold px-8">
                                    حذف الحساب
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md rounded-3xl p-8">
                                <DialogHeader>
                                    <DialogTitle className="text-start">هل أنت متأكد تماماً؟</DialogTitle>
                                    <DialogDescription className="text-start mt-2 leading-relaxed">
                                        هذا الإجراء لا يمكن التراجع عنه. سيتم حذف حسابك وجميع بياناتك بشكل دائم.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <Button variant="outline" className="h-12 rounded-full font-bold shadow-none">إلغاء</Button>
                                    <Button variant="destructive" className="h-12 rounded-full font-bold shadow-none" onClick={onDeleteAccount} disabled={isDeleting}>
                                        {isDeleting ? "جارٍ الحذف..." : "تأكيد الحذف"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
					</div>
				</div>
			</div>

			<VerifyOtpDialog
				open={showVerifyMobileDialog}
				onOpenChange={setShowVerifyMobileDialog}
				mobile={mobileVerificationData?.oldMobile ?? ""}
				title="Verify New Number"
				description="We sent an OTP to your old number for security before activating the new one."
			/>
		</>
	);
}
