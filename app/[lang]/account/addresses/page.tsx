import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchAddresses, addressKeys } from "@/features/addresses/services/addressService";
import AddressesPageContent from "@/features/addresses/components/AddressesPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateAlternateMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Delivery Addresses | Sohar Water",
  description: "Manage your saved delivery locations for faster checkout experience.",
  ...generateAlternateMetadata("/account/addresses"),
};

export default async function AddressesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: addressKeys.list(),
    queryFn: fetchAddresses,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/20">
      <section className="container py-12 grow">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AddressesPageContent />
        </HydrationBoundary>
      </section>
    </div>
  );
}
