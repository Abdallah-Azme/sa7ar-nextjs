import ProfileForm from "@/features/account/components/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "تفاصيل الحساب | مياه صحار",
	description: "إدارة معلوماتك الشخصية وإعدادات حسابك.",
};

/**
 * Account Details Page — mirrors React's /account/details route
 * React path: /account/details → AccountForm.tsx
 */
export default function AccountDetailsPage() {
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

			<ProfileForm />
		</div>
	);
}
