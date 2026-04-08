import apiClient from "@/lib/apiClient";

export interface BlogItem {
	id: number;
	title: string;
	subtitle: string;
	slug: string;
	image: string;
	description: string;
	is_active: boolean;
	viewers_count: number;
	created_at: string;
}

export interface BlogsResponse {
	blogs: BlogItem[];
	pagination: {
		current_page: number;
		per_page: number;
		total: number;
		total_pages: number;
	};
}

export const blogKeys = {
  all: ["blogs"] as const,
  list: (page: number) => [...blogKeys.all, "list", page] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
};

export async function fetchBlogs(page = 1) {
  const res = await apiClient<{ data: BlogsResponse }>({
    route: `/blogs?page=${page}`,
  });
  return res.data;
}

export async function fetchBlogBySlug(slug: string) {
  const res = await apiClient<{ data: BlogItem }>({
    route: `/blogs/${slug}`,
  });
  return (res as unknown as { data: BlogItem }).data;
}
