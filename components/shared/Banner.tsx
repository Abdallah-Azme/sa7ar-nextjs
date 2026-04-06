import type { ReactNode } from "react";
import Overlay from "./Overlay";
import WaterDrop from "../icons/WaterDrop";

interface BannerProps {
	title: string;
	desc: string;
	Icon?: ReactNode;
	bannerUrl: string;
}

/**
 * Banner - RSC (Server Component)
 * Used as page headers with background image and title
 */
export default function Banner({ title, Icon, desc, bannerUrl }: BannerProps) {
	const resolvedIcon = Icon ?? <WaterDrop size={46} />;
	return (
		<section
			style={{ backgroundImage: `url(${bannerUrl})` }}
			className="bg-cover text-center bg-center h-90"
		>
			<Overlay>
				<div className="flex-col text-white size-full relative z-2 flex justify-center items-center gap-y-7">
					{resolvedIcon}
					<h2 className="font-bold text-3xl lg:text-4xl">{title}</h2>
					<p className="text-xl lg:text-2xl leading-9 line-clamp-2 max-w-2xl mx-auto">{desc}</p>
				</div>
			</Overlay>
		</section>
	);
}
