"use client";

import { Link } from "@/i18n/routing";
import { EditIcon, Trash2Icon, PlusIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isAddressDefault } from "../utils";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import EmptyCard from "@/components/shared/EmptyCard";
import type { Address } from "../types";
import { useTranslations } from "next-intl";
import { useSetDefaultAddressMutation } from "../hooks/useAddresses";

interface AddressListViewProps {
	addresses: Address[];
}

/**
 * AddressListView - Client Component
 * Interactive list of delivery addresses with actions for setting default, editing, or deleting.
 */
export default function AddressListView({ addresses }: AddressListViewProps) {
	const t = useTranslations("account.addressesList");
	const { mutate: setDefaultAddress, isPending, variables } = useSetDefaultAddressMutation();

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
							title={t("noAddressesTitle")}
							description={t("noAddressesDesc")}
						/>
					</div>
				) : (
					addresses.map((address) => {
                        const isDefault = isAddressDefault(address);
                        const isSettingThisDefault = isPending && variables === address.id;
                        
                        const title = address.address_label || address.detailed_address || address.location || "-";
                        const details = address.detailed_address || address.location || "-";

                        return (
                            <div 
                                key={address.id}
                                className="bg-[#EEF2FF] p-5 rounded-xl space-y-5"
                            >
                                {/* Header Row */}
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-xs font-light text-gray shrink-0">
                                        {t("addressLabel")}
                                      </span>
                                      {isDefault && (
                                        <Badge variant="secondary" className="font-semibold">
                                          {t("defaultLabel")}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                                        {!isDefault && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={isPending}
                                                onClick={() => setDefaultAddress(address.id)}
                                                className="rounded-full border-accent text-accent hover:bg-accent/10 h-8 px-3 text-xs font-semibold"
                                            >
                                                {isSettingThisDefault
                                                  ? t("setDefaultDialog.setting")
                                                  : t("setDefault")}
                                            </Button>
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
