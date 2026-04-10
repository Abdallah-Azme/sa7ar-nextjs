"use client";

import { useTranslations } from "next-intl";
import { BadgeCheck, BookTextIcon, Leaf, Truck } from "lucide-react";
import AboutCard from "@/components/shared/cards/AboutCard";
import SectionLabel from "@/components/shared/SectionLabel";
import ImageFallback from "@/components/shared/ImageFallback";

type AboutValuesCard = {
	icon: string | null;
	title: string;
	description: string;
};

/**
 * About Component
 * Home page "About Us" section.
 */
export default function About({ 
    aboutValuesCards 
}: { 
    aboutValuesCards?: AboutValuesCard[] 
}) {
	const t = useTranslations("about");

	const fallbackFeatures = [
		{
			icon: <BadgeCheck className="h-6 w-6 text-primary" />,
			title: t("features.accreditation.title"),
			description: t("features.accreditation.description"),
		},
		{
			icon: <Truck className="h-6 w-6 text-primary" />,
			title: t("features.comfort.title"),
			description: t("features.comfort.description"),
		},
		{
			icon: <Leaf className="h-6 w-6 text-primary" />,
			title: t("features.sustainability.title"),
			description: t("features.sustainability.description"),
		},
	];

	const featureIcons = [
		<BadgeCheck key="badge" className="h-6 w-6 text-primary" />,
		<Truck key="truck" className="h-6 w-6 text-primary" />,
		<Leaf key="leaf" className="h-6 w-6 text-primary" />,
	];

	const features = aboutValuesCards?.length
		? aboutValuesCards.map((item, index) => ({
				icon: item.icon ? (
					<ImageFallback
						src={item.icon}
						alt={item.title}
						width={24}
						height={24}
						className="h-6 w-6 object-contain"
					/>
				) : (
					featureIcons[index % featureIcons.length]
				),
				title: item.title,
				description: item.description,
			}))
		: fallbackFeatures;

	return (
		<section className="container grid lg:grid-cols-3 gap-10">
			<div className="gap-6 flex flex-col">
				<SectionLabel
					text={t("label")}
					Icon={<BookTextIcon size={15} />}
				/>

				<h2 className="text-xl sm:text-2xl lg:text-5xl font-bold text-primary">
					{t("title.line1")}
					<b className="text-secondary block mt-3 font-black">
						{t("title.emphasis")}
					</b>
				</h2>

				<p className="text-gray-600 font-medium text-base sm:text-lg leading-relaxed">
					{t("description")}
				</p>
			</div>

            <div className="grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 col-span-2">
                {features.slice(0, 3).map((item, index) => (
                    <AboutCard key={index} index={index} {...item} />
                ))}
            </div>
		</section>
	);
}
