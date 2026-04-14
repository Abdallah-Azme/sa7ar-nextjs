import { notFound, redirect } from "next/navigation";
import AddressForm from "@/features/addresses/components/AddressForm";
import { getAddressDetails } from "@/features/addresses/queries";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { generateAlternateMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return generateAlternateMetadata(`/account/addresses/${id}`);
}

export default async function EditAddressPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { id } = await params;
    if (!id) return redirect("/account/addresses");

    const t = await getTranslations("account.addAddress");
    const address = await getAddressDetails(id);
    if (!address) return notFound();

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-2 mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                    {t("editTitle")}
                </h1>
                <p className="text-gray-500 font-medium leading-relaxed">
                    {t("editDescription")}
                </p>
            </header>

            <AddressForm addressId={id} initialData={address} />
        </div>
    );
}
