"use client";

import { CircleDotIcon, DropletsIcon } from "lucide-react";
import { useMemo } from "react";
import ImageFallback from "@/components/shared/ImageFallback";
import { useTranslations } from "next-intl";

interface OurStoryProps {
	title?: string;
	descriptionHtml?: string;
	imageUrl?: string;
	numberOfWorkers?: string;
	numberOfProducts?: string;
}

/**
 * OurStory Component - Client Component
 * Displays the history and key statistics of Sohar Water.
 */
export default function OurStory({
	title,
	descriptionHtml,
	imageUrl,
	numberOfWorkers,
	numberOfProducts,
}: OurStoryProps) {
    const t = useTranslations("aboutStory");
    
    // Simplistic HTML cleaner for RSC parity
    const cleanDescription = useMemo(() => {
        if (!descriptionHtml) return [];
        return descriptionHtml
            .split(/<\/p>/)
            .map(p => p.replace(/<[^>]*>/g, "").trim())
            .filter(Boolean);
    }, [descriptionHtml]);

	return (
		<section className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
			<div className="rounded-[80px] overflow-hidden relative">
				<ImageFallback
					src={imageUrl || "/images/placeholder/our-story.webp"}
					alt={t("imageAlt")}
					width={955}
					height={720}
					className="w-full h-full object-cover max-h-[600px]"
				/>
			</div>

			<div className="flex flex-col gap-6 text-start">
				<div className="bg-accent/10 w-fit font-bold text-sm text-accent p-2.5 rounded-4xl flex gap-1 justify-between items-center">
					<CircleDotIcon className="text-white fill-accent" />
					<span className="text-nowrap">{t("label")}</span>
					<DropletsIcon />
				</div>

				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
					{title || (
                        <>
                            {t("title.line1")}<br/><br/>
                            <b className="text-secondary font-extrabold">{t("title.emphasis")}</b>{" "}
                            {t("title.line2")}
                        </>
                    )}
				</h2>

				<div className="space-y-10 text-black">
                    {cleanDescription.length > 0 ? (
                        cleanDescription.map((p, i) => (
                            <p key={i} className="text-lg/10 text-justify">
                                {p}
                            </p>
                        ))
                    ) : (
                        <>
                            <p className="text-lg/10 text-justify">
                                {t("paragraphs.first")}
                            </p>
                            <p className="text-lg/10 text-justify">
                                {t("paragraphs.second")}
                            </p>
                        </>
                    )}
				</div>

				<div className="flex items-center gap-7 pt-6">
					<div>
						<p className="text-5xl font-medium">{numberOfWorkers || "350+"}</p>
						<p className="text-gray text-sm font-light">
							{t("stats.happyCustomers")}
						</p>
					</div>
					<div>
						<p className="text-5xl font-medium">{numberOfProducts || "120+"}</p>
						<p className="text-gray text-sm font-light">
							{t("stats.partners")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
