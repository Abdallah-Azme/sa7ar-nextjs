"use client";

import { useForm } from "react-hook-form";
import { MailIcon, PhoneIcon, UserRound, SendHorizontalIcon, MapPinIcon, Clock4Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ContactUsInput from "@/components/forms/ContactUsInput";
import Banner from "@/components/shared/Banner";
import SectionLabel from "@/components/shared/SectionLabel";
import HelpCard from "@/components/shared/cards/HelpCard";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useGlobalSettingsQuery } from "@/features/settings/hooks/useSettings";
import { useMutation } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

interface ContactFormValues {
	name: string;
	mobile: string;
	email: string;
	message: string;
}

export default function ContactPageContent() {
	const t = useTranslations("contactPage");
    const tForm = useTranslations("form");
	const { data: settings } = useGlobalSettingsQuery();

	const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
		defaultValues: { name: "", mobile: "", email: "", message: "" },
	});

    const { mutate: submitContact, isPending } = useMutation({
        mutationFn: async (data: ContactFormValues) => {
            const res = await apiClient({
				route: "/contact-us",
				method: "POST",
				body: JSON.stringify({ ...data, message_type: "inquiry" }),
			});
            return res as { message?: string };
        },
        onSuccess: (res) => {
            toast.success(res.message || t("messages.success"));
			reset();
        },
        onError: (err: { message?: string }) => {
            toast.error(err?.message || t("messages.error"));
        }
    });

	const onSubmit = (data: ContactFormValues) => {
		submitContact(data);
	};

	const locale = useLocale();
	const staticMapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14545.968600746979!2d56.63467405!3d24.2944321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8c3139366650b3%3A0xc48c4805c878937!2sSohar%20Industrial%20City!5e0!3m2!1s${locale}!2som!4v1712210000000!5m2!1s${locale}!2som`;

	return (
		<main className="space-y-20">
			<Banner
				title={t("banner.title")}
				desc={t("banner.description")}
				bannerUrl="/images/contact-hero.webp"
			/>

			<section className="bg-accent/10 py-25 mb-20">
				<div className="container">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-2xl sm:text-4xl font-extrabold text-primary">
							{t("form.title")}
						</h2>
						<p className="text-black text-sm font-medium sm:text-base">
							{t("form.description")}
						</p>
					</div>

					<div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 mt-10">
						<Card className="rounded-4xl p-6 gap-y-8 shadow-none border-none">
							<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
								<div className="space-y-4">
									<Label className="text-gray">
										{t("form.fields.name")} <span className="text-destructive">*</span>
									</Label>
									<ContactUsInput
										Icon={<UserRound size={15} />}
										placeholder={t("form.placeholders.name")}
										{...register("name", { required: tForm("errors.required") })}
									/>
									<p className="text-destructive text-xs">{errors.name?.message}</p>
								</div>

								<div className="space-y-4">
									<Label className="text-gray">
										{t("form.fields.phone")} <span className="text-destructive">*</span>
									</Label>
									<ContactUsInput
										Icon={<PhoneIcon size={15} />}
										type="tel"
										placeholder={t("form.placeholders.phone")}
										dir="ltr"
										{...register("mobile", {
											required: tForm("errors.required"),
											minLength: { value: 6, message: tForm("errors.tooShort", { count: 6 }) },
											pattern: { value: /^\d+$/, message: tForm("errors.invalidMobile") },
										})}
									/>
									<p className="text-destructive text-xs">{errors.mobile?.message}</p>
								</div>

								<div className="space-y-4">
									<Label className="text-gray">{t("form.fields.email")}</Label>
									<ContactUsInput
										Icon={<MailIcon size={15} />}
										placeholder={t("form.placeholders.email")}
										type="email"
										{...register("email", {
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: tForm("errors.invalidEmail"),
											},
										})}
									/>
									<p className="text-destructive text-xs">{errors.email?.message}</p>
								</div>

								<div className="space-y-4">
									<Label className="text-gray">
										{t("form.fields.message")} <span className="text-destructive">*</span>
									</Label>
									<textarea
										rows={5}
										placeholder={t("form.placeholders.message")}
										className="border-b rounded-none shadow-none resize-none w-full outline-none focus:border-primary"
										{...register("message", { required: tForm("errors.required") })}
									/>
									<p className="text-destructive text-xs">{errors.message?.message}</p>
								</div>

								<Button
									type="submit"
									disabled={isPending}
									className="w-full h-12 rounded-full px-5! justify-between"
								>
									{isPending ? tForm("labels.savingChanges") : t("form.submit")}
									<SendHorizontalIcon className="rtl:rotate-180" size={18} />
								</Button>
							</form>
						</Card>

						<Card className="rounded-4xl p-6 gap-y-8 shadow-none border-none">
							<div className="space-y-3 text-primary">
								<span className="text-sm font-medium">{t("info.label")}</span>
								<h3 className="text-2xl md:text-4xl font-medium md:max-w-101">
									{t("info.title")}
								</h3>
							</div>

							<div className="space-y-5 text-sm text-black-cu">
								<div className="space-y-3">
									<p className="font-medium text-gray">{t("info.emailLabel")}</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<MailIcon className="size-4" />
										</div>
										<p>{settings?.email ?? t("info.emailValue")}</p>
									</div>
								</div>

								<div className="space-y-3">
									<p className="font-medium text-gray">{t("info.phoneLabel")}</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<PhoneIcon className="size-4" />
										</div>
										<p>{settings?.whatsapp ?? t("info.phoneValue")}</p>
									</div>
								</div>

								<div className="space-y-3">
									<p className="font-medium text-gray">{t("info.addressLabel")}</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<MapPinIcon className="size-4" />
										</div>
										<p>{settings?.address ?? t("info.addressValue")}</p>
									</div>
								</div>

								<div className="space-y-3">
									<p className="font-medium text-gray">{t("info.hoursLabel")}</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<Clock4Icon className="size-4" />
										</div>
										<p>{t("info.hoursValue")}</p>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>

			<section className="container space-y-10 mb-20">
				<div className="text-center space-y-4">
					<SectionLabel
						text={t("map.label")}
						Icon={<MapPinIcon size={16} />}
						center
					/>
					<h2 className="text-2xl sm:text-4xl font-extrabold text-secondary">
						{t("map.title")}
					</h2>
					<p className="text-sm sm:text-base font-medium">
						{t("map.description")}
					</p>
				</div>

				<div className="rounded-4xl overflow-hidden bg-background-cu">
					<iframe
						className="w-full h-100 xl:h-150"
						src={staticMapSrc}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						title={t("map.iframeTitle")}
					/>
				</div>
			</section>

			<HelpCard />
		</main>
	);
}
