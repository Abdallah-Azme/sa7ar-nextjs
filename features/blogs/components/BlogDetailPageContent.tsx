"use client";

import { useQuery } from "@tanstack/react-query";
import { blogKeys, fetchBlogBySlug } from "../services/blogService";
import BlogDetailView from "./BlogDetailView"; // Assuming it exists

export default function BlogDetailPageContent({ slug }: { slug: string }) {
  const { data: blog, isLoading } = useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => fetchBlogBySlug(slug),
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">تحميل...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">المقال غير موجود</div>;

  return <BlogDetailView blog={blog} />;
}
