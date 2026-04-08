"use client";

import { useAddressesQuery } from "@/features/addresses/hooks/useAddresses";
import AddressListView from "./AddressListView";
import { Address } from "../types";

export default function AddressesPageContent() {
  const { data: addressesRaw, isLoading } = useAddressesQuery();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">تحميل...</div>;

  const addresses = (addressesRaw as unknown as { data: Address[] })?.data || [];

  return <AddressListView addresses={addresses} />;
}
