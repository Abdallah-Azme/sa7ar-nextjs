"use client";

import { useState, FormEvent } from "react";
import ArticleCard from "@/features/blogs/components/ArticleCard";
import ImageFallback from "@/components/shared/ImageFallback";
import WaterDrop from "@/components/icons/WaterDrop";
import AppPagination from "@/components/shared/AppPagination";
import HelpCard from "@/components/shared/cards/HelpCard";
import { SparklesIcon, MailIcon, Loader2, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

type BlogItem = {
	id: number;
	title: string;
	subtitle: string;
	slug: string;
	image: string;
	description: string;
	is_active: boolean;
	viewers_count: number;
	created_at: string;
};

interface BlogsViewProps {
	blogs: BlogItem[];
	totalPages: number;
}

/**
 * BlogsView - Client Component
 * Full parity with React's Blog.tsx:
 *   - Dynamic hero using first blog's image
 *   - Newsletter subscription wired to API
 *   - Arabic labels and section titles
 *   - Pagination, ArticleCard reuse
 */
export default function BlogsView({ blogs, totalPages }: BlogsViewProps) {
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [isSubscribing, setIsSubscribing] = useState(false);

	const featuredArticle = blogs[0];
	const sideArticles = blogs.slice(1, 3);
	const latestArticles = blogs.length > 3 ? blogs.slice(3) : blogs;

	const onNewsSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const email = newsletterEmail.trim();
		if (!email) return;

		setIsSubscribing(true);
		try {
			const res = await apiClient({
				route: "/health-education/subscribe",
				method: "POST",
				body: JSON.stringify({ email }),
			});
			toast.success(res.message || "تم الاشتراك بنجاح!");
			setNewsletterEmail("");
		} catch (err: unknown) {
			const error = err as { message?: string };
			toast.error(error?.message || "حدث خطأ ما");
		} finally {
			setIsSubscribing(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* 1. Hero / Newsletter — uses first blog image dynamically */}
			<section className="relative h-[480px] lg:h-[560px] overflow-hidden">
				<ImageFallback
					src={featuredArticle?.image || "/images/blog-hero.webp"}
					alt={featuredArticle?.title || "Health & Education"}
					width={1920}
					height={1080}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-black/60" />
				<div className="absolute inset-0 z-10 flex items-center p-6 sm:p-10">
					<div className="max-w-xl space-y-4 text-white">
						<WaterDrop size={45} className="stroke-2 mb-7" />
						<h1 className="text-3xl font-bold sm:text-5xl">
							{featuredArticle?.title || "مدونة الصحة والتعليم"}
						</h1>
						<p className="inline-flex items-center gap-2 text-base text-white/90 sm:text-xl">
							<SparklesIcon className="size-4 text-[#FDD835]" />
							نصائح صحية، معايير المياه النقية، وإرشادات الحياة الصحية.
						</p>

						<form
							onSubmit={onNewsSubmit}
							className="mt-4 flex max-w-95 items-center overflow-hidden rounded-xs bg-white py-1 pe-1"
						>
							<div className="relative flex-1">
								<MailIcon className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
								<input
									type="email"
									value={newsletterEmail}
									onChange={(e) => setNewsletterEmail(e.target.value)}
									required
									placeholder="اشترك للحصول على التحديثات"
									className="h-10 w-full bg-transparent px-4 ps-10 text-xs text-primary outline-none placeholder:text-gray"
								/>
							</div>
							<button
								type="submit"
								disabled={isSubscribing}
								className="flex h-10 w-14 text-white disabled:opacity-50 shrink-0 items-center justify-center bg-accent transition-all"
							>
								{isSubscribing ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<ArrowLeftIcon className="size-4" />
								)}
							</button>
						</form>
					</div>
				</div>
			</section>

			{/* 2. Most Read / Featured Grid */}
			<section className="container mt-12 space-y-12">
				<div className="space-y-3 text-start">
					<h2 className="text-3xl font-extrabold text-primary sm:text-5xl">
						الأكثر قراءةً
					</h2>
					<p className="inline-flex items-center gap-2 text-sm font-medium text-gray">
						<SparklesIcon className="size-4 text-accent" />
						نصائح صحية، معايير المياه النقية، وإرشادات الحياة الصحية.
					</p>
				</div>

				<div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
					{featuredArticle && (
						<Link href={`/blogs/${encodeURIComponent(featuredArticle.slug)}`}>
							<article className="group relative overflow-hidden rounded-4xl">
								<ImageFallback
									src={featuredArticle.image}
									alt={featuredArticle.title}
									width={1200}
									height={800}
									className="h-90 w-full sm:h-112 object-cover"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
								<div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-5 text-white sm:p-8">
									<WaterDrop size={45} className="stroke-2 mb-5" />
									<h2 className="text-2xl font-extrabold sm:text-4xl">
										{featuredArticle.title}
									</h2>
									<p className="max-w-2xl text-sm leading-7 text-white/90 sm:text-base line-clamp-2">
										{featuredArticle.description.replace(/<[^>]*>/g, "")}
									</p>
								</div>
							</article>
						</Link>
					)}

					<div className="space-y-4">
						{sideArticles.map((article) => (
							<ArticleCard
								key={article.id}
								variant="horizontal"
								title={article.title}
								description={article.description}
								image={article.image}
								meta={article.subtitle}
								readMoreLabel="اقرأ المزيد"
								href={`/blogs/${encodeURIComponent(article.slug)}`}
							/>
						))}
					</div>
				</div>
			</section>

			{/* 3. Latest Articles */}
			<section className="container mb-20 space-y-10">
				<div className="space-y-3 text-start">
					<h2 className="text-3xl font-extrabold text-primary sm:text-5xl">
						أحدث المقالات
					</h2>
					<p className="inline-flex items-center gap-2 text-sm font-medium text-gray">
						<SparklesIcon className="size-4 text-accent" />
						نصائح صحية، معايير المياه النقية، وإرشادات الحياة الصحية.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{latestArticles.map((article) => (
						<ArticleCard
							key={article.id}
							title={article.title}
							description={article.description}
							image={article.image}
							meta={article.subtitle}
							readMoreLabel="اقرأ المزيد"
							href={`/blogs/${encodeURIComponent(article.slug)}`}
						/>
					))}
				</div>

				<AppPagination totalPages={totalPages} />
			</section>

			<HelpCard />
		</div>
	);
}
