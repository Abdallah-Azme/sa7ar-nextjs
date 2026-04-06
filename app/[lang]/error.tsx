"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Error Page - Client Component (required by Next.js for error.tsx)
 * Mirrors React's ErrorPage.tsx — same layout, reload + back home buttons.
 */
export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Route error:", error);
	}, [error]);

	return (
		<main className="min-h-screen flex items-center">
			<section className="container py-12">
				<div className="mx-auto max-w-3xl rounded-4xl bg-background-cu px-6 py-12 text-center sm:px-10 sm:py-16">
					<h1 className="mt-4 text-3xl font-extrabold text-destructive sm:text-5xl">
						حدث خطأ ما
					</h1>
					<p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray sm:text-base">
						نأسف، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
					</p>
					<div className="mt-8 flex items-center justify-center gap-3">
						<Button asChild className="rounded-full px-8">
							<Link href="/">العودة إلى الرئيسية</Link>
						</Button>
						<Button
							variant="outline"
							className="rounded-full px-8"
							onClick={() => reset()}
						>
							إعادة المحاولة
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
