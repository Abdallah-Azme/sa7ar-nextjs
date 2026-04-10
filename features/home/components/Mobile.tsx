"use client";

import { useTranslations } from "next-intl";
import { TabletSmartphoneIcon } from "lucide-react";
import AppStore from "@/components/icons/AppStore";
import GoogleStore from "@/components/icons/GoogleStore";
import ImageFallback from "@/components/shared/ImageFallback";
import SectionLabel from "@/components/shared/SectionLabel";
import { Button } from "@/components/ui/button";

export default function Mobile({ 
    appleStoreLink, 
    googlePlayLink 
}: { 
    appleStoreLink?: string | null; 
    googlePlayLink?: string | null; 
}) {
	const t = useTranslations("mobile");
	const tCommon = useTranslations("common");
    const hasGooglePlayLink = Boolean(googlePlayLink && googlePlayLink.trim().length > 0);
    const hasAppleStoreLink = Boolean(appleStoreLink && appleStoreLink.trim().length > 0);

	return (
		<section className="grid lg:grid-cols-2 gap-10 container">
			<div className="space-y-10">
				<SectionLabel
					text={t("label")}
					Icon={<TabletSmartphoneIcon size={15} />}
				/>
				{/* Titles */}
				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
					<span>{t("title.line1")}</span>
					<b className="text-secondary block font-extrabold mt-4">
						{t("title.emphasis")}
					</b>
				</h2>
				{/* Desc */}
				<p className="font-light text-black text-lg/10">
					{t("description")}
				</p>

				{/* Actions */}
				<div className="flex sm:flex-row flex-col justify-center items-center gap-2">
					<Button
						variant={"secondary"}
						className="flex gap-2 w-40 sm:w-46 items-center h-14 rounded-[24px]"
						asChild
                        disabled={!hasGooglePlayLink}
					>
						<a href={googlePlayLink || undefined} target="_blank" rel="noopener noreferrer">
							<div className="text-start">
								<p className="text-[8px]">{tCommon("downloadOn")}</p>
								<b className="text-sm md:text-xs lg:text-sm">{tCommon("stores.google")}</b>
							</div>
							<GoogleStore size={24} aria-hidden="true" />
						</a>
					</Button>
					<Button asChild className="flex w-40 sm:w-46 gap-2 bg-black hover:bg-black/90 items-center h-14 rounded-[24px]" disabled={!hasAppleStoreLink}>
						<a href={appleStoreLink || undefined} target="_blank" rel="noopener noreferrer">
							<div className="text-start">
								<p className="text-[8px]">{tCommon("downloadOn")}</p>
								<b className="text-sm md:text-xs lg:text-sm">{tCommon("stores.apple")}</b>
							</div>
							<AppStore className="text-white" size={24} aria-hidden="true" />
						</a>
					</Button>
				</div>
			</div>

			{/* Image */}
            <ImageFallback
                src="/images/mobile.webp"
                alt={t("imageAlt")}
                width={1040}
                height={665}
                className="w-full object-contain"
            />
		</section>
	);
}
