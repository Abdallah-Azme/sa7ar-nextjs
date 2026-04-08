import apiClient from "@/lib/apiClient";

export interface CmsPage {
	description: string;
}

/**
 * Fetch CMS Page Content (Privacy, Terms, etc.)
 * Server-side cached query with 24-hour revalidation for static-like content.
 */
export async function getCmsPage(id: string | number) {
	try {
        const res = await apiClient<{ data: CmsPage }>({
            route: `/pages?page_id=${id}`,
        });
        return res.data;
    } catch (error) {
        console.error(`Error fetching CMS page ${id}:`, error);
        return null;
    }
}
