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
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProfileForm />
		</HydrationBoundary>
	);
}
