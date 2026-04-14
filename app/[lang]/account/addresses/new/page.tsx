import AddressForm from "@/features/addresses/components/AddressForm";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { generateAlternateMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  await params;
  return generateAlternateMetadata("/account/addresses/new");
}

export default async function AddAddressPage() {
  const t = await getTranslations("account.addAddress");
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
          {t("title")}
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          {t("description")}
        </p>
      </header>

      <AddressForm />
    </div>
  );
}
