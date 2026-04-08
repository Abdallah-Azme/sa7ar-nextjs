import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchProfile, authKeys } from "@/features/auth/services/authService";
import ProfileForm from "@/features/account/components/ProfileForm";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
	title: "تفاصيل الحساب | مياه صحار",
	description: "إدارة معلوماتك الشخصية وإعدادات حسابك.",
};

export default async function AccountDetailsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);

    const queryClient = makeQueryClient();
    await queryClient.prefetchQuery({
        queryKey: authKeys.profile(),
        queryFn: fetchProfile,
    });

	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-2 mb-8">
				<h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
					تفاصيل الحساب
				</h1>
				<p className="text-gray-500 font-medium">
					تحديث معلوماتك الشخصية وصورة الملف الشخصي.
				</p>
			</header>

			<HydrationBoundary state={dehydrate(queryClient)}>
				<ProfileForm />
			</HydrationBoundary>
		</div>
	);
}
