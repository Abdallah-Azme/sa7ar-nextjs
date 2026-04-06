import { getBlogs } from "@/features/blogs/queries";
import ArticleCard from "@/features/blogs/components/ArticleCard";
import ImageFallback from "@/components/shared/ImageFallback";
import WaterDrop from "@/components/icons/WaterDrop";
import AppPagination from "@/components/shared/AppPagination";
import HelpCard from "@/components/shared/cards/HelpCard";
import { SparklesIcon, MailIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Education Blog | Sohar Water",
  description: "Stay informed with our latest articles on health, hydration, and pure water quality.",
};

export default async function BlogsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = searchParams.page || "1";
  const data = await getBlogs(page);

  const blogs = data?.blogs || [];
  const totalPages = data?.pagination?.total_pages || 1;

  const featuredArticle = blogs[0];
  const sideArticles = blogs.slice(1, 3);
  const gridArticles = blogs.slice(3) || blogs;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero / Newsletter Section */}
      <section className="relative h-[480px] lg:h-[560px] overflow-hidden">
        <ImageFallback
          src="/images/blog-hero.webp"
          alt="Health & Education"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 z-10 flex items-center">
            <div className="container text-start">
                <div className="max-w-2xl space-y-8 text-white">
                    <div className="size-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                        <WaterDrop size={40} className="text-white" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
                            Health & <br /><span className="text-secondary">Education</span> Blog
                        </h1>
                        <p className="flex items-center gap-3 text-lg font-medium text-white/90">
                            <SparklesIcon size={20} className="text-accent" />
                            Hydration tips, pure water standards, and healthy living guidelines.
                        </p>
                    </div>

                    <form className="flex max-w-md items-center overflow-hidden rounded-full bg-white/95 p-1.5 shadow-2xl">
                        <div className="relative flex-1 ps-4">
                            <MailIcon className="absolute start-1 top-1/2 -translate-y-1/2 text-primary size-5" />
                            <input
                                placeholder="Subscribe for updates"
                                className="h-10 w-full bg-transparent px-8 text-sm text-primary outline-none placeholder:text-gray/60"
                            />
                        </div>
                        <button className="flex size-14 shrink-0 items-center justify-center bg-accent text-white rounded-full hover:scale-105 transition-transform">
                            <SendIcon size={20} className="ms-1" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Most Read / Featured Grid */}
      <section className="container py-24 space-y-12">
        <div className="text-start space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-primary">Editor's Picks</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest px-1">
                <SparklesIcon size={14} className="text-accent" />
                Featured Insights
            </div>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-stretch">
            {featuredArticle && (
                <Link href={`/blogs/${featuredArticle.slug}`} className="group relative overflow-hidden rounded-[80px] shadow-2xl flex">
                    <ImageFallback
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        width={1200}
                        height={800}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 z-10 p-12 text-start space-y-6">
                        <div className="bg-white/10 backdrop-blur-md w-fit p-3 rounded-2xl border border-white/20">
                            <WaterDrop size={32} className="text-white" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                                {featuredArticle.title}
                            </h3>
                            <p className="max-w-2xl text-lg text-white/80 line-clamp-2">
                                {featuredArticle.description.replace(/<[^>]*>/g, "")}
                            </p>
                        </div>
                    </div>
                </Link>
            )}

            <div className="flex flex-col gap-6">
                {sideArticles.map((article) => (
                    <ArticleCard 
                        key={article.id}
                        variant="horizontal"
                        title={article.title}
                        description={article.description}
                        image={article.image}
                        meta={article.subtitle}
                        readMoreLabel="Discover"
                        href={`/blogs/${article.slug}`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* 3. Latest Articles Grid */}
      <section className="container pb-24 space-y-12">
        <div className="text-start space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-primary">Latest Wisdom</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest px-1">
                <SparklesIcon size={14} className="text-accent" />
                Newly Published
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {gridArticles.map((article) => (
                <ArticleCard 
                    key={article.id}
                    title={article.title}
                    description={article.description}
                    image={article.image}
                    meta={article.subtitle}
                    readMoreLabel="Read Story"
                    href={`/blogs/${article.slug}`}
                />
            ))}
        </div>

        <div className="pt-10">
            <AppPagination totalPages={totalPages} />
        </div>
      </section>

      <HelpCard className="py-20 bg-accent/5" />
    </div>
  );
}
