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

/**
 * Fetch Blogs List
 * Server-side cached query for the list of health and education articles.
 */
export async function getBlogs(page: string | number = 1) {
	try {
        const res = await apiClient<BlogsResponse>({
            route: `/blogs?page=${page}`,
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return null;
    }
}

/**
 * Fetch Single Blog Post by Slug
 */
export async function getBlogBySlug(slug: string) {
    try {
        const res = await apiClient<BlogItem>({
            route: `/blogs/${slug}`,
        });
        return res.data;
    } catch (error) {
        console.error(`Error fetching blog ${slug}:`, error);
        return null;
    }
}
