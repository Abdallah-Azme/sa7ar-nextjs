import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchBlogBySlug, blogKeys } from "@/features/blogs/services/blogService";
import BlogDetailPageContent from "@/features/blogs/components/BlogDetailPageContent";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

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
  const { lang, slug } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.blogDetails" });
  
  try {
    const blog = await fetchBlogBySlug(slug);
    if (!blog) return { title: t("title") };

    return {
      title: `${blog.title} | ${t("title").split("|")[1]?.trim() || "صحار"}`,
      description: blog.subtitle || blog.description.substring(0, 160).replace(/<[^>]*>/g, ""),
    };
  } catch (error) {
    console.error("Error fetching blog for metadata:", error);
    return { title: t("title") };
  }
}

/**
 * Blog Details Page - RSC (Server Component)
 */
export default async function BlogDetailsPage({ params }: BlogDetailsProps) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const queryClient = makeQueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: blogKeys.detail(slug),
      queryFn: () => fetchBlogBySlug(slug),
    });
  } catch (error) {
    console.error("Error prefetching blog detail:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogDetailPageContent slug={slug} />
    </HydrationBoundary>
  );
}
