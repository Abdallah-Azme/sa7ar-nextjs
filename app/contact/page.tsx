"use client";

import { useForm } from "react-hook-form";
import { MailIcon, PhoneIcon, UserRound, SendHorizontalIcon, MapPinIcon, Clock4Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ContactUsInput from "@/components/forms/ContactUsInput";
import Header from "@/components/shared/header/Header";
import Banner from "@/components/shared/Banner";
import SectionLabel from "@/components/shared/SectionLabel";
import HelpCard from "@/components/shared/cards/HelpCard";
import Footer from "@/components/shared/footer/Footer";

interface ContactFormValues {
	name: string;
	mobile: string;
	email: string;
	message: string;
}

/**
 * ContactPage - Client Component
 * Interactive contact form with integrated maps and support information.
 */
export default function ContactPage() {
	const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>();

	const onSubmit = async (data: ContactFormValues) => {
		console.log("Submitting contact form", data);
        // This will be connected to Server Action later
        alert("Thank you! Your message has been sent.");
        reset();
	};

	return (
		<main className="flex flex-col min-h-screen">
			<Header />
            
			<Banner
				title="Get In Touch"
				desc="We're here to answer any questions you may have about our products."
				bannerUrl="/images/contact-hero.webp"
			/>

			{/* Contact Form Section */}
			<section className="bg-accent/5 py-24">
				<div className="container">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl sm:text-5xl font-extrabold text-primary">Contant Information</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Fill out the form below and our team will get back to you within 24 hours.
						</p>
					</div>

					<div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
						{/* Form Column */}
						<Card className="rounded-[40px] p-10 border-none shadow-xl bg-white">
							<form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
								<div className="space-y-4">
									<Label className="text-gray-700 font-bold">Full Name *</Label>
									<ContactUsInput
										Icon={<UserRound size={18} />}
										placeholder="e.g. Abdullah Ahmed"
										{...register("name", { required: "Name is required" })}
									/>
									{errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
								</div>

								<div className="grid sm:grid-cols-2 gap-8">
									<div className="space-y-4">
										<Label className="text-gray-700 font-bold">Phone Number *</Label>
										<ContactUsInput
											Icon={<PhoneIcon size={18} />}
											type="tel"
											placeholder="+968 XXXX XXXX"
											{...register("mobile", { required: "Phone is required" })}
										/>
                                        {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile.message}</p>}
									</div>
									<div className="space-y-4">
										<Label className="text-gray-700 font-bold">Email Address *</Label>
										<ContactUsInput
											Icon={<MailIcon size={18} />}
											placeholder="yourname@gmail.com"
											type="email"
											{...register("email", { required: "Email is required" })}
										/>
                                        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
									</div>
								</div>

								<div className="space-y-4">
									<Label className="text-gray-700 font-bold">Message *</Label>
									<textarea
										rows={4}
										placeholder="How can we help you?"
										className="border-b border-gray-200 rounded-none shadow-none resize-none w-full outline-none focus:border-accent transition-colors pt-4 text-sm"
										{...register("message", { required: "Message is required" })}
									/>
                                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
								</div>

								<Button
									type="submit"
									className="w-full h-14 rounded-full px-8 text-lg font-bold group shadow-lg"
								>
									Send Message
									<SendHorizontalIcon className="ms-auto rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={20} />
								</Button>
							</form>
						</Card>

						{/* Info Column */}
						<div className="flex flex-col gap-10 text-start">
                            <div className="space-y-4">
                                <span className="font-extrabold text-accent uppercase tracking-widest text-xs">Reach Us</span>
                                <h3 className="text-3xl font-extrabold text-primary">Contact Details</h3>
                                <p className="text-gray-600">Pure water delivery directly to your home in Oman.</p>
                            </div>

							<div className="space-y-8">
								<div className="flex items-start gap-4">
                                    <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <MailIcon size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-400 font-bold text-xs uppercase">E-Mail Address</p>
                                        <p className="font-extrabold text-primary">info@sa7arwater.om</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <PhoneIcon size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-400 font-bold text-xs uppercase">Phone Number</p>
                                        <p className="font-extrabold text-primary">+968 2449 0599</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <MapPinIcon size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-400 font-bold text-xs uppercase">Our Location</p>
                                        <p className="font-extrabold text-primary">Sohar Industrial City, Oman</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <Clock4Icon size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-400 font-bold text-xs uppercase">Working Hours</p>
                                        <p className="font-extrabold text-primary">Sat-Thu: 8:00 AM - 5:00 PM</p>
                                    </div>
                                </div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Map Section */}
			<section className="container py-24 text-center space-y-12">
                <SectionLabel text="Find Us On Map" Icon={<MapPinIcon size={16} />} center />
                <h2 className="text-3xl sm:text-5xl font-extrabold text-secondary">Visit Our Factory</h2>
				<div className="rounded-[40px] overflow-hidden shadow-2xl bg-gray-100 border-8 border-white aspect-video relative">
                    {/* Integrated Map Iframe placeholder */}
					<iframe
						className="w-full h-full grayscale-[0.3]"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14545.968600746979!2d56.63467405!3d24.2944321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8c3139366650b3%3A0xc48c4805c878937!2sSohar%20Industrial%20City!5e0!3m2!1sen!2som!4v1712210000000!5m2!1sen!2som"
						loading="lazy"
						title="Sohar Water Map"
					/>
				</div>
			</section>

			<HelpCard />
			<Footer />
		</main>
	);
}
