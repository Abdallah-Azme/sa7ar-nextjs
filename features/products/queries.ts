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

export * from "./services/productService";
import { 
    fetchBestSellingProducts, 
    fetchBestSellingAccessories, 
    fetchBrandSizes, 
    fetchBrandProducts, 
    fetchProductDetail 
} from "./services/productService";

/**
 * Deprecated: Use fetchBestSellingProducts or the useProducts hook instead.
 */
export const getBestSellingProducts = fetchBestSellingProducts;

/**
 * Deprecated: Use fetchBestSellingAccessories or the useProducts hook instead.
 */
export const getBestSellingAccessories = fetchBestSellingAccessories;

/**
 * Deprecated: Use fetchBrandSizes or the useProducts hook instead.
 */
export const getBrandSizes = fetchBrandSizes;

/**
 * Deprecated: Use fetchBrandProducts or the useProducts hook instead.
 */
export const getBrandProducts = fetchBrandProducts;

/**
 * Deprecated: Use fetchProductDetail or the useProducts hook instead.
 */
export async function getProductDetails(id: string): Promise<ProductDetailsResponse | null> {
    try {
        const res = await fetchProductDetail(id);
        return (res as unknown as ProductDetailsResponse) ?? null;
    } catch {
        return null;
    }
}
