import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchBlogs, blogKeys } from "@/features/blogs/services/blogService";
import BlogsPageContent from "@/features/blogs/components/BlogsPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import { fetchSeoSettings } from "@/features/settings/services/settingsService";
import type { BlogItem, BlogsResponse } from "@/features/blogs/services/blogService";

import { getTranslations } from "next-intl/server";

function buildBlogsPageJsonLd({
  lang,
  page,
  title,
  description,
  blogs,
}: {
  lang: string;
  page: number;
  title: string;
  description: string;
  blogs: BlogItem[];
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  const listPath = lang === "ar" ? "/blogs" : `/${lang}/blogs`;
  const listUrl = new URL(page > 1 ? `${listPath}?page=${page}` : listPath, baseUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: listUrl,
    mainEntity: {
      "@type": "ItemList",
      name: title,
      numberOfItems: blogs.length,
      itemListElement: blogs.map((blog, index) => {
        const blogPath = lang === "ar" ? `/blogs/${blog.slug}` : `/${lang}/blogs/${blog.slug}`;

        return {
          "@type": "ListItem",
          position: (page - 1) * blogs.length + index + 1,
          item: {
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.subtitle || blog.description || undefined,
            image: blog.image || undefined,
            datePublished: blog.created_at,
            url: new URL(blogPath, baseUrl).toString(),
          },
        };
      }),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "seo.blog" });
  const seoSettings = await fetchSeoSettings();
  const seoPage = seoSettings?.pages?.blog;

  return generateSeoMetadata({
    title: seoPage?.meta_title || t("title"),
    description: seoPage?.meta_description || t("description"),
    lang,
    path: "/blogs",
  });
}

export default async function BlogsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ page?: string }> 
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "seo.blog" });
  
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: blogKeys.list(page),
    queryFn: () => fetchBlogs(page),
  });
  const blogsResponse = (queryClient.getQueryData(blogKeys.list(page)) ?? null) as BlogsResponse | null;
  const jsonLd = buildBlogsPageJsonLd({
    lang,
    page,
    title: t("title"),
    description: t("description"),
    blogs: blogsResponse?.blogs ?? [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogsPageContent initialPage={page} />
    </HydrationBoundary>
  );
}
