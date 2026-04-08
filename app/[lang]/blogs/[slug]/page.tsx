import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchBlogBySlug, blogKeys } from "@/features/blogs/services/blogService";
import BlogDetailPageContent from "@/features/blogs/components/BlogDetailPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface BlogDetailsProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

/**
 * Generate Dynamic SEO Metadata for individual blog posts.
 */
export async function generateMetadata({ params }: BlogDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);
  if (!blog) return { title: "Article Not Found" };

  return {
    title: `${blog.title} | سحر`,
    description: blog.subtitle || blog.description.substring(0, 160).replace(/<[^>]*>/g, ""),
  };
}

/**
 * Blog Details Page - RSC (Server Component)
 */
export default async function BlogDetailsPage({ params }: BlogDetailsProps) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => fetchBlogBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogDetailPageContent slug={slug} />
    </HydrationBoundary>
  );
}
