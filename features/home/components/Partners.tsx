"use client";

import { useTranslations } from "next-intl";
import { HandshakeIcon } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import { Card } from "@/components/ui/card";
import ImageFallback from "@/components/shared/ImageFallback";

/**
 * Partners Component
 */
export default function Partners() {
	const t = useTranslations("partners");

	const partnersList = [
		{ image: "rzaz.svg", color: "#52A1FF1A", id: "rzaz" },
		{ image: "barad.svg", color: "#2C6C8D1A", id: "barad" },
	];

	return (
		<section className="container grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
			<div className="grid sm:grid-cols-2 gap-6">
				{partnersList.map((item, index) => (
					<Card
						key={index}
						style={{ background: item.color, borderColor: item.color }}
						className="w-full rounded-[80px] border flex items-center justify-center p-8"
					>
						<ImageFallback
							src={`/images/placeholder/${item.image}`}
							alt={t(item.id)}
							width={260}
							height={260}
							className="size-60 object-contain"
						/>
					</Card>
				))}
			</div>

			<div className="gap-6 flex flex-col">
				<SectionLabel
					text={t("label")}
					Icon={<HandshakeIcon size={15} />}
				/>

				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
					{t("title.line1")}
					<b className="text-secondary block mt-3 font-extrabold">
						{t("title.emphasis")}
					</b>
				</h2>

				<p className="text-black text-lg/10 text-justify mt-auto">
					{t("description")}
				</p>
			</div>
		</section>
	);
}
