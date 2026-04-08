"use client";

import { cn } from "@/lib/utils";
import type { HomeResponse } from "../types";
import {
	ArrowUpLeftIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CircleCheckBigIcon,
	CircleDotIcon,
	ShieldCheckIcon,
	ShoppingBasketIcon,
	TruckIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import AppStore from "@/components/icons/AppStore";
import GoogleStore from "@/components/icons/GoogleStore";
import WaterDrop from "@/components/icons/WaterDrop";
import Whatsapp from "@/components/icons/Whatsapp";
import ImageFallback from "@/components/shared/ImageFallback";
import Overlay from "@/components/shared/Overlay";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";

import { useTranslations } from "next-intl";

export default function Hero({
	sliders,
    appleStoreLink,
    googlePlayLink,
    whatsappNumber,
}: {
	sliders?: HomeResponse["sliders"];
    appleStoreLink?: string | null;
    googlePlayLink?: string | null;
    whatsappNumber?: string | null;
}) {
	const t = useTranslations("hero");
	const tCommon = useTranslations("common");
	const [api, setApi] = useState<CarouselApi>();
	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const [slides, setSlides] = useState<number>(0);

	const shoppingSteps = [
		{
			title: t("steps.fast.title"),
			label: t("steps.fast.label"),
			Icon: TruckIcon,
		},
		{
			title: t("steps.quality.title"),
			label: t("steps.quality.label"),
			Icon: ShieldCheckIcon,
		},
		{
			title: t("steps.trust.title"),
			label: t("steps.trust.label"),
			Icon: CircleCheckBigIcon,
		},
	];

	useEffect(() => {
		if (!api) return;

		const onInit = () => {
			setSlides(api.scrollSnapList().length - 1);
			setCurrentSlide(api.selectedScrollSnap());
		};

		api.on("init", onInit);
		api.on("reInit", onInit);
		onInit();

		api.on("select", () => {
			setCurrentSlide(api.selectedScrollSnap());
		});

		return () => {
			api.off("init", onInit);
			api.off("reInit", onInit);
		};
	}, [api]);

	if (!sliders || sliders.length === 0) return null;

    const hasAppleStoreLink = Boolean(appleStoreLink && appleStoreLink.trim().length > 0);
    const hasGooglePlayLink = Boolean(googlePlayLink && googlePlayLink.trim().length > 0);
    const hasWhatsappNumber = Boolean(whatsappNumber && whatsappNumber.trim().length > 0);

	return (
		<section className="grid lg:grid-cols-2 gap-10 container">
			{/* Label */}
			<div className="space-y-10">
				<div className="bg-accent/10 max-w-xs font-bold text-xs text-primary p-2.5 rounded-4xl flex gap-1 justify-between items-center">
					<CircleDotIcon className="text-white fill-accent" />
					<span className="text-nowrap">{t("label")}</span>
					<WaterDrop className="text-accent" />
				</div>

				{/* Combined Title into single H1 */}
				<h1 className="text-xl sm:text-2xl lg:text-5xl font-medium flex flex-col gap-2">
					<span>{t("title.line1")}</span>
					<span>
						<span className="text-secondary font-extrabold">
							{t("title.emphasis")}
						</span>{" "}
						{t("title.line2")}
					</span>
				</h1>
				{/* Desc */}
				<p className="font-light text-black text-lg/10">
					{t("description")}
				</p>
				{/* Actions */}
				<Button
					asChild
					className="justify-between items-center w-full max-w-[460px] rounded-full"
				>
					<Link href="/products">
						<div className="flex items-center gap-2">
							<ShoppingBasketIcon />
							<span>{t("actions.shop")}</span>
						</div>
						<ArrowUpLeftIcon className="ltr:rotate-90 rtl:rotate-0" />
					</Link>
				</Button>

				{/* Shopping Steps */}
				<div className="grid sm:grid-cols-3 divide-x rtl:divide-x-reverse gap-3">
					{shoppingSteps.map((item, i) => (
						<div
							key={i}
							className="flex items-center gap-2 max-sm:bg-gray/10 max-sm:p-3 max-sm:rounded-lg"
						>
							<div className="size-13 bg-secondary/10 rounded-full flex items-center justify-center">
								<item.Icon size={24} />
							</div>

							<div className="flex flex-col justify-between gap-2">
								<span className="font-bold text-sm">{item.title}</span>
								<span className="text-gray font-light text-xs">
									{item.label}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Carousel */}
			<div className="flex flex-col sm:flex-row gap-2">
				<Carousel
					setApi={setApi}
					className="h-full max-h-179.25 flex-1 overflow-hidden rounded-4xl relative"
				>
					<CarouselContent className="h-full">
						{sliders.map((slider, index) => (
							<CarouselItem key={slider.id}>
								<Overlay>
									<ImageFallback
										src={slider.image}
										alt={slider.title}
										priority={index === 0}
										sizes="(max-width: 768px) 100vw, 50vw"
										className="h-full w-full object-cover"
									/>
								</Overlay>
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="absolute inset-x-10 items-center flex justify-between bottom-5">
						<div className="flex items-center gap-3">
							<Button
								disabled={currentSlide <= 0}
								data-slot="btn prev"
								aria-label={tCommon("prevSlide")}
								onClick={() => api?.scrollPrev()}
								className="size-10 sm:size-13 rounded-full bg-primary/85 hover:bg-primary text-white rtl:rotate-180 disabled:opacity-40"
							>
								<ChevronLeftIcon />
							</Button>
							<Button
								disabled={currentSlide >= slides}
								data-slot="btn next"
								aria-label={tCommon("nextSlide")}
								onClick={() => api?.scrollNext()}
								className="size-10 sm:size-13 rounded-full bg-primary/85 hover:bg-primary text-white rtl:rotate-180 disabled:opacity-40"
							>
								<ChevronRightIcon />
							</Button>
						</div>
						<div className="flex items-center gap-2 sm:gap-4">
							{api?.scrollSnapList().map((_, i) => (
								<div
									key={i}
									onClick={() => api?.scrollTo(i)}
									className={cn(
										"rounded w-8 sm:w-13 h-2 cursor-pointer transition-colors",
										i === currentSlide ? "bg-white" : "bg-gray/50",
									)}
								/>
							))}
						</div>
					</div>
				</Carousel>
				<div className="self-start *:size-12 transition-transform *:hover:scale-110 flex sm:flex-col gap-3">
					<Button
						asChild
                        disabled={!hasAppleStoreLink}
						className="rounded-full border bg-background-cu hover:bg-background-cu"
						size={"icon-lg"}
					>
						<a href={appleStoreLink || undefined} aria-label={tCommon("appleStore")}>
							<AppStore className="text-black" aria-hidden="true" />
						</a>
					</Button>
					<Button
						size={"icon-lg"}
						asChild
                        disabled={!hasGooglePlayLink}
						className="rounded-full border bg-background-cu hover:bg-background-cu"
					>
						<a href={googlePlayLink || undefined} aria-label={tCommon("googlePlay")}>
							<GoogleStore aria-hidden="true" />
						</a>
					</Button>
					<Button
						size={"icon-lg"}
						asChild
                        disabled={!hasWhatsappNumber}
						className="rounded-full border text-green-500 border-green-500 bg-green-100 hover:bg-green-100"
					>
						<a
							href={hasWhatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined}
							aria-label={tCommon("whatsapp")}
						>
							<Whatsapp aria-hidden="true" />
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
