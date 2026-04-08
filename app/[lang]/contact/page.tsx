import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchGlobalSettings, settingsKeys } from "@/features/settings/services/settingsService";
import ContactPageContent from "@/features/contact/components/ContactPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
	title: "تواصل معنا | مياه صحار",
	description: "نحن هنا للإجابة على استفساراتك حول منتجاتنا وخدمات توصيل المياه.",
};

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);

    const queryClient = makeQueryClient();
    await queryClient.prefetchQuery({
        queryKey: settingsKeys.global(),
        queryFn: fetchGlobalSettings,
    });

	return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ContactPageContent />
        </HydrationBoundary>
    );
}
