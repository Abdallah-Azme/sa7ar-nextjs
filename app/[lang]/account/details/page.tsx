import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchProfile, authKeys } from "@/features/auth/services/authService";
import ProfileForm from "@/features/account/components/ProfileForm";
import { setRequestLocale } from "next-intl/server";

import { getTranslations } from "next-intl/server";

export default async function AccountDetailsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);
    const t = await getTranslations("account.profile");

    const queryClient = makeQueryClient();
    await queryClient.prefetchQuery({
        queryKey: authKeys.profile(),
        queryFn: fetchProfile,
    });

	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-2 mb-8">
				<h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
					{t("pageTitle")}
				</h1>
				<p className="text-gray-500 font-medium">
					{t("pageDescription")}
				</p>
			</header>

			<HydrationBoundary state={dehydrate(queryClient)}>
				<ProfileForm />
			</HydrationBoundary>
		</div>
	);
}
