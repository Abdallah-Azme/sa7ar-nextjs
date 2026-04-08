"use client";

import { useQuery } from "@tanstack/react-query";
import { blogKeys, fetchBlogs } from "../services/blogService";
import { useSearchParams } from "next/navigation";
import BlogsView from "./BlogsView";

export default function BlogsPageContent({ initialPage }: { initialPage: number }) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || initialPage.toString(), 10);

  const { data: blogsData } = useQuery({
    queryKey: blogKeys.list(page),
    queryFn: () => fetchBlogs(page),
  });

  const blogs = blogsData?.blogs || [];
  const totalPages = blogsData?.pagination?.total_pages || 1;

  return <BlogsView blogs={blogs} totalPages={totalPages} />;
}
