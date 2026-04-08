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
		<section className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
			<div className="rounded-[80px] overflow-hidden relative shadow-2xl">
				<ImageFallback
					src={imageUrl || "/images/placeholder/our-story.webp"}
					alt={t("imageAlt")}
					width={955}
					height={720}
					className="w-full h-full object-cover max-h-[600px]"
				/>
			</div>

			<div className="flex flex-col gap-8 text-start">
				<div className="bg-accent/10 w-fit font-bold text-sm text-accent px-6 py-3 rounded-full flex gap-3 items-center">
					<CircleDotIcon size={18} className="text-white fill-accent" />
					<span className="uppercase tracking-widest text-xs">{t("label")}</span>
					<DropletsIcon size={18} className="text-accent" />
				</div>

				<h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-tight">
					{title || (
                        <>
                            {t("title.line1")}<br/>
                            <span className="text-secondary">{t("title.emphasis")}</span>{" "}
                            {t("title.line2")}
                        </>
                    )}
				</h2>

				<div className="space-y-6 text-gray-700">
                    {cleanDescription.length > 0 ? (
                        cleanDescription.map((p, i) => (
                            <p key={i} className="text-lg leading-relaxed text-justify">
                                {p}
                            </p>
                        ))
                    ) : (
                        <>
                            <p className="text-lg leading-relaxed text-justify">
                                {t("paragraphs.first")}
                            </p>
                            <p className="text-lg leading-relaxed text-justify">
                                {t("paragraphs.second")}
                            </p>
                        </>
                    )}
				</div>

				<div className="flex items-center gap-12 pt-6 border-t border-gray/5">
					<div className="space-y-1">
						<p className="text-4xl font-extrabold text-secondary">{numberOfWorkers || "350+"}</p>
						<p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
							{t("stats.happyCustomers")}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-4xl font-extrabold text-secondary">{numberOfProducts || "120+"}</p>
						<p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
							{t("stats.partners")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
