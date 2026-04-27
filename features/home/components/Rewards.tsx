"use client";

import Autoplay from "embla-carousel-autoplay";
import { AwardIcon } from "lucide-react";
import ImageFallback from "@/components/shared/ImageFallback";
import SectionLabel from "@/components/shared/SectionLabel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { RewardsSectionData } from "../types";

interface RewardsProps {
	data: RewardsSectionData;
}

export default function Rewards({ data }: RewardsProps) {
	return (
		<section className="container space-y-6">
			<div className="mx-auto max-w-4xl space-y-4 text-center">
				<div className="flex justify-center">
					<SectionLabel text="Rewards" Icon={<AwardIcon size={15} />} />
				</div>
				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">{data.title}</h2>
				<p className="text-black/80 text-sm sm:text-base lg:text-lg leading-8">
					{data.description}
				</p>
			</div>

			<Carousel
				plugins={[Autoplay({ delay: 3500 })]}
				opts={{ align: "start", loop: true }}
				className="w-full"
			>
				<CarouselContent className="py-2">
					{data.items.map((item) => (
						<CarouselItem
							key={item.id}
							className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
						>
							<div className="h-full rounded-3xl border bg-white p-3 sm:p-4">
								<ImageFallback
									src={item.image}
									alt={item.alt}
									width={240}
									height={240}
									className="mx-auto h-32 w-full object-contain sm:h-40"
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</section>
	);
}
