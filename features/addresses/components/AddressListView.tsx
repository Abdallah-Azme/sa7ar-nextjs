"use client";

import { Link } from "@/i18n/routing";
import { EditIcon, Trash2Icon, PlusIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import EmptyCard from "@/components/shared/EmptyCard";
import type { Address } from "../types";
import { useTranslations } from "next-intl";

interface AddressListViewProps {
	addresses: Address[];
}

/**
 * AddressListView - Client Component
 * Interactive list of delivery addresses with actions for setting default, editing, or deleting.
 */
export default function AddressListView({ addresses }: AddressListViewProps) {
	const t = useTranslations("account.addressesList");

	return (
		<div className="space-y-10">
			<header className="flex items-center justify-between gap-6 flex-wrap">
				<h1 className="text-2xl font-extrabold text-primary">{t("title")}</h1>
				<Button className="rounded-full bg-black hover:bg-black/90 px-8" asChild>
					<Link href="/account/addresses/new">
                        <PlusIcon size={18} className="me-2" />
                        {t("addNew")}
                    </Link>
				</Button>
			</header>

			{/* List Section */}
			<div className="grid gap-6">
				{addresses.length === 0 ? (
					<div className="bg-white border rounded-4xl p-16 shadow-inner text-center">
						<EmptyCard
							title={t("emptyTitle")}
							description={t("emptyDescription")}
						/>
					</div>
				) : (
					addresses.map((address) => {
                        const isDefault = address.is_default === 1;
                        
                        const title = address.address_label || address.detailed_address || address.location || "-";
                        const details = address.detailed_address || address.location || "-";

                        return (
                            <div 
                                key={address.id}
                                className="bg-[#EEF2FF] p-5 rounded-xl space-y-5"
                            >
                                {/* Header Row */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-light text-gray">
                                        {t("addressLabel")}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        {!isDefault && (
                                            <button
                                                type="button"
                                                className="flex items-center hover:opacity-80 gap-1 text-accent font-light text-xs cursor-pointer"
                                            >
                                                {t("setDefault")}
                                            </button>
                                        )}
                                        <Link
                                            href={`/account/addresses/${address.id}`}
                                            className="flex items-center hover:opacity-80 gap-1 text-black font-light text-xs cursor-pointer"
                                        >
                                            {t("edit")}
                                            <EditIcon className="size-3.5" />
                                        </Link>
                                        <button
                                            type="button"
                                            className="flex items-center hover:opacity-80 gap-1 text-destructive font-light text-xs cursor-pointer"
                                        >
                                            {t("delete")}
                                            <Trash2Icon className="size-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Body Row */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 text-[#432DD7]">
                                        <LocationPinIcon />
                                        <div>
                                            <h3 className="text-sm font-bold">{title}</h3>
                                            <p className="text-gray text-xs font-light">{details}</p>
                                        </div>
                                    </div>
                                    {isDefault && (
                                        <div className="size-5 shrink-0 text-white bg-accent flex items-center justify-center rounded-full">
                                            <CheckIcon size={14} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
				)}
			</div>
		</div>
	);
}
