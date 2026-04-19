"use client";

import { useMemo } from "react";
import { useAddressesQuery } from "@/features/addresses/hooks/useAddresses";
import AddressListView from "./AddressListView";
import { Address } from "../types";

import { useTranslations } from "next-intl";

function normalizeAddressList(raw: unknown): Address[] {
	if (raw == null || typeof raw !== "object") return [];
	const o = raw as Record<string, unknown>;
	if (Array.isArray(o.data)) return o.data as Address[];
	if (Array.isArray(raw)) return raw as Address[];
	return [];
}

export default function AddressesPageContent() {
	const t = useTranslations("account.addressesList");
	const { data: addressesRaw, isLoading } = useAddressesQuery();

	const addresses = useMemo(
		() => normalizeAddressList(addressesRaw),
		[addressesRaw],
	);

 

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				{t("loading")}
			</div>
		);
	}

	return <AddressListView addresses={addresses} />;
}
