import apiClient from "@/lib/apiClient";

export interface InstitutionType {
	id: number;
	name?: string;
	name_ar?: string;
	name_en?: string;
}

/**
 * Fetch Institution Types
 * Server-side cached query for the list of available organization types.
 */
export async function getInstitutionTypes() {
	try {
        const res = await apiClient<{ data: InstitutionType[] }>({
            route: "/institution-types",
        });
        return res.data ?? [];
    } catch (error) {
        console.error("Error fetching institution types:", error);
        return [];
    }
}
