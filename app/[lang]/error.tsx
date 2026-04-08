"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

/**
 * Error Page - Client Component (required by Next.js for error.tsx)
 * Mirrors React's ErrorPage.tsx — same layout, reload + back home buttons.
 */
import { useTranslations } from "next-intl";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations("generalErrorPage");
	
	useEffect(() => {
		console.error("Route error:", error);
	}, [error]);

	return (
		<main className="min-h-screen flex items-center">
			<section className="container py-12">
				<div className="mx-auto max-w-3xl rounded-4xl bg-background-cu px-6 py-12 text-center sm:px-10 sm:py-16">
					<h1 className="mt-4 text-3xl font-extrabold text-destructive sm:text-5xl">
						{t("title")}
					</h1>
					<p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray sm:text-base">
						{t("description")}
					</p>
					<div className="mt-8 flex items-center justify-center gap-3">
						<Button asChild className="rounded-full px-8">
							<Link href="/">{t("backHome")}</Link>
						</Button>
						<Button
							variant="outline"
							className="rounded-full px-8"
							onClick={() => reset()}
						>
							{t("reload")}
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
