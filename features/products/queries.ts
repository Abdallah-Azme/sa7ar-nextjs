import apiClient from "@/lib/apiClient";
import type { Product } from "@/types";
import type { ProductDetail } from "@/features/products/components/ProductDetailsView";

export interface ProductDetailsResponse {
	product: ProductDetail;
	related_products: Product[];
}

export interface BrandSize {
	id: number;
	size: string;
}

export async function getBestSellingProducts() {
	try {
		const res = await apiClient<Product[]>({
			route: "/products/best-selling",
			next: { revalidate: 3600 },
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching best selling products:", error);
		return [];
	}
}

export async function getBestSellingAccessories() {
	try {
		const res = await apiClient<Product[]>({
			route: "/products-accessories",
			next: { revalidate: 3600 },
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching accessories:", error);
		return [];
	}
}


export async function getBrandSizes(brand: "bard" | "rathath") {
	try {
		const res = await apiClient<{ sizes: BrandSize[] }>({
			route: `/brands/${brand}/sizes`,
			next: { revalidate: 3600 },
		});
		return res.data?.sizes ?? [];
	} catch (error) {
		console.error(`Error fetching ${brand} sizes:`, error);
		return [];
	}
}

export async function getBrandProducts(brand: "bard" | "rathath", sizeIds?: number[]) {
	try {
        let route = `/brands/${brand}/products`;
        if (sizeIds && sizeIds.length > 0) {
            route += `?size_id=${sizeIds.join(",")}`;
        }
		const res = await apiClient<Product[]>({
			route,
			next: { revalidate: 3600 },
		});
		return res.data ?? [];
	} catch (error) {
		console.error(`Error fetching ${brand} products:`, error);
		return [];
	}
}

export async function getProductDetails(id: string): Promise<ProductDetailsResponse | null> {
	try {
		const res = await apiClient<ProductDetailsResponse>({
			route: `/products/${id}`,
			next: { revalidate: 3600 },
		});
		return res.data;
	} catch (error) {
		console.error(`Error fetching product ${id} details:`, error);
		return null;
	}
}
