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
		<section className="bg-[url(/images/request-partinership.webp)] relative min-h-100 bg-center bg-cover flex items-center py-20">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/65 z-10" aria-hidden="true" />

			<div className="container relative z-20 flex flex-col md:flex-row justify-between items-center text-white">
				<div className="space-y-5">
					<Building2Icon size={56} className="text-secondary" aria-hidden="true" />
					<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
						{t("title.line1")}{" "}
						<b className="font-extrabold mx-2">{t("title.emphasis")}</b>{" "}
						{t("title.line2")}
					</h2>
					<p className="font-light text-lg/10 max-w-2xl">
						{t("description")}
					</p>
				</div>

				<Button asChild className="bg-accent h-13 backdrop-blur-md min-w-[200px] rounded-full border border-white/10 hover:bg-accent/80 transition-all mt-8 md:mt-0">
					<Link href='/business-partnerships' className="flex items-center gap-2" aria-label="Join our business partners">
						{t("cta")}
						<ArrowUpLeft size={16} className="ltr:rotate-90 rtl:rotate-0" aria-hidden="true" />
					</Link>
				</Button>
			</div>
		</section>
	);
}
