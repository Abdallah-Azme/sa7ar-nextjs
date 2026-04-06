import { getAddresses } from "@/features/addresses/queries";
import AddressListView from "@/features/addresses/components/AddressListView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Addresses | Sohar Water",
  description: "Manage your saved delivery locations for faster checkout experience.",
};

/**
 * Addresses Page - RSC (Server Component)
 * Dynamically fetches authenticated user addresses for secure display.
 */
export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/20">
      <section className="container py-12 grow">
        <AddressListView addresses={addresses || []} />
      </section>
    </div>
  );
}
