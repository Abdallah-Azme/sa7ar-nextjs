import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchInstitutionTypes, partnershipKeys } from "@/features/partnerships/services/partnershipService";
import PartnershipForm from "@/features/partnerships/components/PartnershipForm";
import { ArrowRightIcon, BuildingIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "الشراكات التجارية | سحر",
  description: "انضم إلى شبكة سحر. سجّل مؤسستك للحصول على خدمات توصيل المياه بالجملة.",
};

export default async function BusinessPartnershipsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);

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
                    العودة إلى الرئيسية
                </Link>
            </nav>

            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-white backdrop-blur border border-white/20 shadow-sm">
                    <BuildingIcon size={32} />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                    الشراكات التجارية
                </h1>
                <p className="text-lg text-white/80 font-medium">
                    تشارك مع سحر لتأمين مياه نقية وموثوقة لموظفيك ومنظمتك.
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
