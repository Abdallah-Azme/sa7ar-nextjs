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

import { generateSeoMetadata } from "@/lib/seo";
import { htmlToPlainText } from "@/lib/utils";

/**
 * Generate Dynamic SEO Metadata for individual blog posts.
 */
export async function generateMetadata({ params }: BlogDetailsProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.blogDetails" });
  
  try {
    const blog = await fetchBlogBySlug(slug);
    if (!blog) return generateSeoMetadata({ title: t("title"), description: "", lang, path: `/blogs/${slug}` });

    return generateSeoMetadata({
      title: `${blog.title} | ${t("title").split("|")[1]?.trim() || "Sohar"}`,
      description: blog.subtitle || htmlToPlainText(blog.description).substring(0, 160),
      lang,
      path: `/blogs/${slug}`,
    });
  } catch (error) {
    return generateSeoMetadata({ title: t("title"), description: "", lang, path: `/blogs/${slug}` });
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
  } catch {
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogDetailPageContent slug={slug} />
    </HydrationBoundary>
  );
}
