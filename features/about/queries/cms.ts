import apiClient from "@/lib/apiClient";

export interface CmsPage {
	id: number;
	key: string;
	name: string;
	description: string;
	image: string | null;
	seo: {
		slug: string;
		meta_title: string;
		meta_description: string;
		meta_keywords: string;
	} | null;
}

interface CmsSeoMetadataInput {
	title: string;
	description: string;
	keywords?: string;
	path: string;
	image?: string;
}

function cleanValue(value?: string | null): string | undefined {
	const normalized = value?.trim();
	return normalized ? normalized : undefined;
}

export function getCmsSeoMetadataInput(
	page: CmsPage | null,
	fallbacks: { title: string; description: string; path: string },
): CmsSeoMetadataInput {
	const seoSlug = cleanValue(page?.seo?.slug);
	const normalizedPath = seoSlug ? `/${seoSlug.replace(/^\/+/, "")}` : fallbacks.path;

	return {
		title: cleanValue(page?.seo?.meta_title) ?? cleanValue(page?.name) ?? fallbacks.title,
		description: cleanValue(page?.seo?.meta_description) ?? fallbacks.description,
		keywords: cleanValue(page?.seo?.meta_keywords),
		path: normalizedPath,
		image: cleanValue(page?.image),
	};
}

 
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
