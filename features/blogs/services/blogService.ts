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
  detail: (slug: string) => [...blogKeys.all, "detail", normalizeBlogSlug(slug)] as const,
};

/**
 * Normalize route slug to support Arabic and encoded values safely.
 */
export function normalizeBlogSlug(slug: string): string {
  const trimmed = slug.trim();
  if (!trimmed) return "";

  try {
    // If we receive percent-encoded slug from URL, decode once.
    return decodeURIComponent(trimmed).normalize("NFC");
  } catch {
    // If decoding fails (or already plain text), keep original value.
    return trimmed.normalize("NFC");
  }
}

export async function fetchBlogs(page = 1) {
  const res = await apiClient<{ data: BlogsResponse }>({
    route: `/blogs?page=${page}`,
  });
  return res.data;
}

export async function fetchBlogBySlug(slug: string) {
  const normalizedSlug = normalizeBlogSlug(slug);
  const encodedSlug = encodeURIComponent(normalizedSlug);
  const res = await apiClient<{ data: BlogItem | { blog: BlogItem } }>({
    route: `/blogs/${encodedSlug}`,
  });
  
  const data = res.data;
  if (!data) return null;
  
  return "blog" in data ? data.blog : data;
}

