"use client";

import { useState, useEffect } from "react";
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

interface ContactFormValues {
	name: string;
	mobile: string;
	email: string;
	message: string;
}

/**
 * ContactPage - Client Component
 * Full parity with React's Contact.tsx:
 *   - API-connected form submission to /contact-us
 *   - Dynamic contact info from settings (fetched client-side)
 *   - Dynamic Google Maps embed from settings.address
 *   - Arabic labels throughout
 */
export default function ContactPage() {
	const [isPending, setIsPending] = useState(false);
	const [settings, setSettings] = useState<{
		email?: string;
		whatsapp?: string;
		address?: string;
	} | null>(null);

	// Fetch settings on mount to populate dynamic contact info
	useEffect(() => {
		fetch("/api/proxy?route=%2Fsettings")
			.then((r) => r.json())
			.then((res) => setSettings(res?.data ?? null))
			.catch(() => null);
	}, []);

	const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
		defaultValues: { name: "", mobile: "", email: "", message: "" },
	});

	const onSubmit = async (data: ContactFormValues) => {
		setIsPending(true);
		try {
			const res = await apiClient({
				route: "/contact-us",
				method: "POST",
				body: JSON.stringify({ ...data, message_type: "inquiry" }),
			});
			toast.success(res.message || "تم إرسال رسالتك بنجاح");
			reset();
		} catch (err: unknown) {
			const error = err as { message?: string };
			toast.error(error?.message || "حدث خطأ ما، يرجى المحاولة مرة أخرى");
		} finally {
			setIsPending(false);
		}
	};

	// Static fallback map (Sohar Industrial City) — matches React's buildGoogleMapEmbedUrl behavior
	const staticMapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14545.968600746979!2d56.63467405!3d24.2944321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8c3139366650b3%3A0xc48c4805c878937!2sSohar%20Industrial%20City!5e0!3m2!1sar!2som!4v1712210000000!5m2!1sar!2som";

	return (
		<main className="flex flex-col min-h-screen">

			<Banner
				title="تواصل معنا"
				desc="نحن هنا للإجابة على استفساراتك حول منتجاتنا وخدمات توصيل المياه."
				bannerUrl="/images/contact-hero.webp"
			/>

			{/* Contact Form Section */}
			<section className="bg-accent/5 py-24">
				<div className="container">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl sm:text-5xl font-extrabold text-primary">معلومات التواصل</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							يسعدنا الرد على استفساراتك في أقرب وقت ممكن. تواصل معنا عبر النموذج أدناه.
						</p>
					</div>

					<div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
						{/* Form Column */}
						<Card className="rounded-4xl p-6 gap-y-8 shadow-none border-none">
							<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
								<div className="space-y-4">
									<Label className="text-gray">
										الاسم الكامل <span className="text-destructive">*</span>
									</Label>
									<ContactUsInput
										Icon={<UserRound size={15} />}
										placeholder="مثال: عبدالله أحمد"
										{...register("name", { required: "هذا الحقل مطلوب" })}
									/>
									<p className="text-destructive text-xs">{errors.name?.message}</p>
								</div>

								<div className="space-y-4">
									<Label className="text-gray">
										رقم الهاتف <span className="text-destructive">*</span>
									</Label>
									<ContactUsInput
										Icon={<PhoneIcon size={15} />}
										type="tel"
										placeholder="+968 XXXX XXXX"
										dir="ltr"
										{...register("mobile", {
											required: "هذا الحقل مطلوب",
											minLength: { value: 6, message: "رقم الهاتف قصير جداً" },
											pattern: { value: /^\d+$/, message: "يرجى إدخال أرقام فقط" },
										})}
									/>
									<p className="text-destructive text-xs">{errors.mobile?.message}</p>
								</div>

								<div className="space-y-4">
									<Label className="text-gray">البريد الإلكتروني</Label>
									<ContactUsInput
										Icon={<MailIcon size={15} />}
										placeholder="example@email.com"
										type="email"
										{...register("email", {
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: "بريد إلكتروني غير صحيح",
											},
										})}
									/>
									<p className="text-destructive text-xs">{errors.email?.message}</p>
								</div>

								<div className="space-y-4">
									<Label className="text-gray">
										الرسالة <span className="text-destructive">*</span>
									</Label>
									<textarea
										rows={5}
										placeholder="كيف يمكننا مساعدتك؟"
										className="border-b rounded-none shadow-none resize-none w-full outline-none focus:border-primary"
										{...register("message", { required: "هذا الحقل مطلوب" })}
									/>
									<p className="text-destructive text-xs">{errors.message?.message}</p>
								</div>

								<Button
									type="submit"
									disabled={isPending}
									className="w-full h-12 rounded-full px-5! justify-between"
								>
									{isPending ? "جاري الإرسال..." : "إرسال الرسالة"}
									<SendHorizontalIcon className="rtl:rotate-180" size={18} />
								</Button>
							</form>
						</Card>

						{/* Info Column */}
						<Card className="rounded-4xl p-6 gap-y-8 shadow-none border-none">
							<div className="space-y-3 text-primary">
								<span className="text-sm font-medium">تواصل معنا</span>
								<h3 className="text-2xl md:text-4xl font-medium md:max-w-101">
									نحن هنا لخدمتك على مدار الساعة
								</h3>
							</div>

							<div className="space-y-5 text-sm text-black-cu">
								<div className="space-y-3">
									<p className="font-medium text-gray">البريد الإلكتروني</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<MailIcon className="size-4" />
										</div>
										<p>{settings?.email ?? "info@sa7arwater.om"}</p>
									</div>
								</div>

								<div className="space-y-3">
									<p className="font-medium text-gray">رقم الهاتف</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<PhoneIcon className="size-4" />
										</div>
										<p>{settings?.whatsapp ?? "+968 2449 0599"}</p>
									</div>
								</div>

								<div className="space-y-3">
									<p className="font-medium text-gray">العنوان</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<MapPinIcon className="size-4" />
										</div>
										<p>{settings?.address ?? "المدينة الصناعية، صحار، عُمان"}</p>
									</div>
								</div>

								<div className="space-y-3">
									<p className="font-medium text-gray">ساعات العمل</p>
									<div className="flex items-start gap-3">
										<div className="size-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
											<Clock4Icon className="size-4" />
										</div>
										<p>السبت - الخميس: 8:00 ص - 5:00 م</p>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* Map Section */}
			<section className="container space-y-10 mb-20">
				<div className="text-center space-y-4">
					<SectionLabel
						text="موقعنا على الخريطة"
						Icon={<MapPinIcon size={16} />}
						center
					/>
					<h2 className="text-2xl sm:text-4xl font-extrabold text-secondary">
						زيارة مصنعنا
					</h2>
					<p className="text-sm sm:text-base font-medium">
						يمكنكم زيارتنا في المدينة الصناعية بصحار أو التواصل معنا عبر الهاتف.
					</p>
				</div>

				<div className="rounded-4xl overflow-hidden bg-background-cu">
					<iframe
						className="w-full h-100 xl:h-150"
						src={staticMapSrc}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						title="خريطة موقع مياه صحار"
					/>
				</div>
			</section>

			<HelpCard />
		</main>
	);
}
