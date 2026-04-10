import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchInstitutionTypes, partnershipKeys } from "@/features/partnerships/services/partnershipService";
import PartnershipForm from "@/features/partnerships/components/PartnershipForm";
import { ArrowRightIcon, BuildingIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.partnership" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    lang,
    path: "/business-partnerships",
  });
}

export default async function BusinessPartnershipsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  const tCommon = await getTranslations({ locale: lang, namespace: "common" });
  const tPartnership = await getTranslations({ locale: lang, namespace: "partnership" });

  const queryClient = makeQueryClient();
  const types = await queryClient.fetchQuery({
    queryKey: partnershipKeys.types(),
    queryFn: fetchInstitutionTypes,
  });

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <section className="bg-primary pt-12 pb-32 rounded-b-[60px] md:rounded-b-[100px] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        
        <div className="container relative z-10 space-y-12">
            <nav className="flex items-center gap-3 text-sm font-bold text-white/70">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRightIcon className="rtl:rotate-180" size={16} />
                    {tCommon("links.backHome")}
                </Link>
            </nav>

            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-white backdrop-blur border border-white/20 shadow-sm">
                    <BuildingIcon size={32} />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                    {tPartnership("title.line1")} {tPartnership("title.emphasis")}
                </h1>
                <p className="text-lg text-white/80 font-medium">
                    {tPartnership("description")}
                </p>
            </div>
        </div>
      </section>

      <section className="container relative z-20 -mt-20 pb-24">
          <div className="max-w-3xl mx-auto">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <PartnershipForm types={types} />
            </HydrationBoundary>
          </div>
      </section>
    </main>
  );
}
