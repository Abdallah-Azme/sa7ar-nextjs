import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queryClient";
import { fetchBlogs, blogKeys } from "@/features/blogs/services/blogService";
import BlogsPageContent from "@/features/blogs/components/BlogsPageContent";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "مدونة الصحة والتعليم | مياه صحار",
  description: "تابع أحدث مقالاتنا حول الصحة والترطيب ومعايير جودة المياه النقية.",
};

export default async function BlogsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ page?: string }> 
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: blogKeys.list(page),
    queryFn: () => fetchBlogs(page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogsPageContent initialPage={page} />
    </HydrationBoundary>
  );
}
