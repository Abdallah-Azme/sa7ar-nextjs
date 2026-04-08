"use client";

import { useQuery } from "@tanstack/react-query";
import { blogKeys, fetchBlogBySlug } from "../services/blogService";
import { useTranslations } from "next-intl";
import BlogDetailView from "./BlogDetailView"; // Assuming it exists

export default function BlogDetailPageContent({ slug }: { slug: string }) {
  const t = useTranslations("blogDetails");
  const tCommon = useTranslations("common");

  const { data: blog, isLoading } = useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => fetchBlogBySlug(slug),
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">{tCommon("loading")}</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">{t("notFound")}</div>;

  return <BlogDetailView blog={blog} />;
}
