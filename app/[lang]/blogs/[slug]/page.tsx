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
    "@type": "Article",
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
    articleSection: "Blog",
    inLanguage: lang === "ar" ? "ar" : "en",
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

function buildBlogBreadcrumbJsonLd({
  lang,
  slug,
  title,
}: {
  lang: string;
  slug: string;
  title: string;
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const homePath = lang === "ar" ? "/" : `/${lang}`;
  const blogsPath = lang === "ar" ? "/blogs" : `/${lang}/blogs`;
  const articlePath = lang === "ar" ? `/blogs/${slug}` : `/${lang}/blogs/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "ar" ? "الرئيسية" : "Home",
        item: new URL(homePath, baseUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: lang === "ar" ? "المدونة" : "Blogs",
        item: new URL(blogsPath, baseUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: new URL(articlePath, baseUrl).toString(),
      },
    ],
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
  const breadcrumbJsonLd = blogData
    ? buildBlogBreadcrumbJsonLd({
        lang,
        slug,
        title: blogData.title,
      })
    : null;
  const schemas = [jsonLd, breadcrumbJsonLd].filter(Boolean);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {schemas.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <BlogDetailPageContent slug={slug} />
    </HydrationBoundary>
  );
}
