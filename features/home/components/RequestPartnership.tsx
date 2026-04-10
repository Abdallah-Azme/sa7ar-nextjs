"use client";

import { useTranslations } from "next-intl";
import { ArrowUpLeft, Building2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

/**
 * RequestPartnership Component
 */
export default function RequestPartnership() {
	const t = useTranslations("partnership");

	return (
		<section className="bg-[url(/images/request-partinership.webp)] relative min-h-100 bg-center bg-cover flex items-center">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/65 z-1" aria-hidden="true" />

			<div className="container relative z-2 flex flex-col md:flex-row justify-between items-center text-white">
				<div className="space-y-5">
					<Building2Icon size={56} aria-hidden="true" />
					<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
						{t("title.line1")}{" "}
						<b className="font-extrabold">{t("title.emphasis")}</b>{" "}
						{t("title.line2")}
					</h2>
					<p className="font-light text-lg/10">
						{t("description")}
					</p>
				</div>

				<Button asChild className="bg-accent/27 h-13 backdrop-blur-md min-w-[200px] rounded-full border border-white/10 hover:bg-accent/20 transition-colors mt-8 md:mt-0">
					<Link href='/business-partnerships' className="flex items-center gap-2">
						{t("cta")}
						<ArrowUpLeft size={6} aria-hidden="true" />
					</Link>
				</Button>
			</div>
		</section>
	);
}
