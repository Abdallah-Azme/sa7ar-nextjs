"use client";

import { CircleDotIcon, DropletsIcon, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ImageFallback from "@/components/shared/ImageFallback";
import { htmlToPlainText } from "@/lib/utils";
import { useTranslations } from "next-intl";

function parseStatValue(raw: string | undefined, fallback: string): { n: number; suffix: string } {
	const s = (raw ?? fallback).trim();
	const m = s.match(/^(\d+)\s*(.*)$/);
	if (!m) return { n: 1, suffix: "" };
	const n = Math.max(0, Number.parseInt(m[1], 10));
	return { n: Number.isFinite(n) ? n : 1, suffix: m[2] ?? "" };
}

function useCountUp(end: number, durationMs = 1600) {
	const [value, setValue] = useState(() => (end <= 1 ? end : 1));

	useEffect(() => {
		if (end <= 1) {
			setValue(end);
			return;
		}
		setValue(1);
		let startTime: number | null = null;
		let raf = 0;

		const tick = (now: number) => {
			if (startTime === null) startTime = now;
			const t = Math.min((now - startTime) / durationMs, 1);
			const eased = 1 - (1 - t) ** 3;
			const next = Math.round(1 + (end - 1) * eased);
			setValue(next);
			if (t < 1) raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [end, durationMs]);

	return value;
}

function AnimatedStat({ raw, fallback }: { raw?: string; fallback: string }) {
	const { n, suffix } = useMemo(() => parseStatValue(raw, fallback), [raw, fallback]);
	const display = useCountUp(n);
	const extraSuffix = suffix.replace(/^\+\s*/, "").trim();

	return (
		<p className="text-5xl font-medium flex flex-wrap items-center gap-0.5">
			<span className="tabular-nums">{display}</span>
			<Plus
				className="size-[0.5em] min-w-[0.5em] shrink-0"
				strokeWidth={3}
				strokeLinecap="round"
				aria-hidden
			/>
			{extraSuffix ? <span>{extraSuffix}</span> : null}
		</p>
	);
}

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
            .map((p) => htmlToPlainText(p).trim())
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
						<AnimatedStat raw={numberOfWorkers} fallback="350+" />
						<p className="text-gray text-sm font-light">
							{t("stats.happyCustomers")}
						</p>
					</div>
					<div>
						<AnimatedStat raw={numberOfProducts} fallback="120+" />
						<p className="text-gray text-sm font-light">
							{t("stats.partners")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
