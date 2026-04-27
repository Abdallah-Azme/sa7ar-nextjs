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

function buildBlogDetailsJsonLd({
  lang,
  slug,
  title,
  subtitle,
  description,
  image,
  createdAt,
}: {
  lang: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  image?: string | null;
  createdAt?: string | null;
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const articlePath = lang === "ar" ? `/blogs/${slug}` : `/${lang}/blogs/${slug}`;
  const articleUrl = new URL(articlePath, baseUrl).toString();
  const cleanedDescription = subtitle || htmlToPlainText(description).slice(0, 160);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: title,
    description: cleanedDescription,
    image: image || undefined,
    datePublished: createdAt || undefined,
    dateModified: createdAt || undefined,
    url: articleUrl,
    author: {
      "@type": "Organization",
      name: "Sohar Water",
    },
    publisher: {
      "@type": "Organization",
      name: "Sohar Water",
    },
  };
}

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
  let blogData: Awaited<ReturnType<typeof fetchBlogBySlug>> | null = null;
  try {
    blogData = await queryClient.ensureQueryData({
      queryKey: blogKeys.detail(slug),
      queryFn: () => fetchBlogBySlug(slug),
    });
  } catch {
    blogData = null;
  }

  const jsonLd = blogData
    ? buildBlogDetailsJsonLd({
        lang,
        slug,
        title: blogData.title,
        subtitle: blogData.subtitle,
        description: blogData.description,
        image: blogData.image,
        createdAt: blogData.created_at,
      })
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <BlogDetailPageContent slug={slug} />
    </HydrationBoundary>
  );
}
