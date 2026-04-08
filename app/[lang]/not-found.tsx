import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

/**
 * Not Found Page - RSC
 * Mirrors React's NotFound.tsx — same layout, same styling.
 */
export default async function NotFound() {
	const t = await getTranslations("notFoundPage");

	return (
		<main className="min-h-screen flex items-center">
			<section className="container py-12">
				<div className="mx-auto max-w-3xl rounded-4xl bg-background-cu px-6 py-12 text-center sm:px-10 sm:py-16">
					<p className="text-accent text-sm font-bold tracking-[0.25em]">404</p>
					<h1 className="mt-4 text-3xl font-extrabold text-primary sm:text-5xl">
						{t("title")}
					</h1>
					<p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray sm:text-base">
						{t("description")}
					</p>
					<Button asChild className="mt-8 rounded-full px-8">
						<Link href="/">{t("backHome")}</Link>
					</Button>
				</div>
			</section>
		</main>
	);
}
