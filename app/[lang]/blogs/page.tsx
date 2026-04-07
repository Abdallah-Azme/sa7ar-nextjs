import { getBlogs } from "@/features/blogs/queries";
import BlogsView from "@/features/blogs/components/BlogsView";
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
  const page = pageStr || "1";
  const data = await getBlogs(page);

  const blogs = data?.blogs || [];
  const totalPages = data?.pagination?.total_pages || 1;

  return <BlogsView blogs={blogs} totalPages={totalPages} />;
}
