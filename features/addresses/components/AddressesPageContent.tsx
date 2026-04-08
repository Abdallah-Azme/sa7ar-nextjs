"use client";

import { useAddressesQuery } from "@/features/addresses/hooks/useAddresses";
import AddressListView from "./AddressListView";
import { Address } from "../types";

import { useTranslations } from "next-intl";

export default function AddressesPageContent() {
  const t = useTranslations("addressesList");
  const { data: addressesRaw, isLoading } = useAddressesQuery();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">{t("loading")}</div>;

  const addresses = (addressesRaw as unknown as { data: Address[] })?.data || [];

  return <AddressListView addresses={addresses} />;
}
