import apiClient from "@/lib/apiClient";
import type { Product } from "@/types";
import type { Pagination } from "@/types";

export const productKeys = {
  all:         ["products"] as const,
  bestSelling: () => [...productKeys.all, "best-selling"] as const,
  mostSold:    (page: number) => [...productKeys.all, "most-sold", page] as const,
  accessories: () => [...productKeys.all, "accessories"] as const,
  accessoriesPaged: (page: number) => [...productKeys.all, "accessories", page] as const,
  brand:       (b: string) => [...productKeys.all, "brand", b] as const,
  brandPaged:  (b: string, page: number) => [...productKeys.all, "brand", b, page] as const,
  brandSizes:  (b: string) => [...productKeys.brand(b), "sizes"] as const,
  detail:      (id: string) => [...productKeys.all, "detail", id] as const,
};

export interface MostSoldProductsResponse {
  products: Product[];
  pagination: Pagination;
}

const FALLBACK_PAGINATION: Pagination = {
  current_page: 1,
  per_page: 15,
  total: 0,
  total_pages: 1,
};

export const fetchMostSoldProducts = async (page = 1): Promise<MostSoldProductsResponse> => {
  const response = await apiClient<{
    data?: { products?: Product[] };
    pagination?: Pagination;
  }>({
    route: `/products/most-sold?page=${page}`,
  });

  return {
    products: response.data?.products ?? [],
    pagination: response.pagination ?? FALLBACK_PAGINATION,
  };
};

export const fetchBestSellingProducts = async (): Promise<Product[]> => {
  try {
    const direct = await apiClient<{ data: Product[] }>({
      route: "/products/best-selling",
    });
    return direct.data ?? [];
  } catch {
    // Fallback for environments where best-selling endpoint is unavailable.
    try {
      const home = await apiClient<{ data: { most_sold_products?: Product[] } }>({
        route: "/home",
      });
      return home.data?.most_sold_products ?? [];
    } catch {
      return [];
    }
  }
};

export const fetchBestSellingAccessories = () =>
  apiClient<{ data: Product[] }>({ route: "/products-accessories" })
    .then(r => r.data ?? []);

export interface PaginatedProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export const fetchBestSellingAccessoriesPaginated = async (
  page = 1,
): Promise<PaginatedProductsResponse> => {
  const response = await apiClient<{
    data?: Product[] | { products?: Product[] };
    pagination?: Pagination;
  }>({
    route: `/products-accessories?page=${page}`,
  });

  const products = Array.isArray(response.data)
    ? response.data
    : (response.data?.products ?? []);

  return {
    products,
    pagination: response.pagination ?? FALLBACK_PAGINATION,
  };
};

export const fetchBrandSizes = (brand: "bard" | "rathath") =>
  apiClient<{ data: { sizes: { id: number; size: string }[] } }>({
    route: `/brands/${brand}/sizes`,
  }).then(r => r.data?.sizes ?? []);

export const fetchBrandProducts = (brand: "bard" | "rathath", sizeIds?: number[]) => {
  let route = `/brands/${brand}/products`;
  if (sizeIds?.length) route += `?size_id=${sizeIds.join(",")}`;
  return apiClient<{ data: Product[] }>({ route }).then(r => r.data ?? []);
};

export const fetchBrandProductsPaginated = async (
  brand: "bard" | "rathath",
  page = 1,
): Promise<PaginatedProductsResponse> => {
  const response = await apiClient<{
    data?: Product[] | { products?: Product[] };
    pagination?: Pagination;
  }>({
    route: `/brands/${brand}/products?page=${page}`,
  });

  const products = Array.isArray(response.data)
    ? response.data
    : (response.data?.products ?? []);

  return {
    products,
    pagination: response.pagination ?? FALLBACK_PAGINATION,
  };
};

export interface ProductDetailResponse {
  product: import("../components/ProductDetailsView").ProductDetail;
  related_products: Product[];
}

export const fetchProductDetail = (id: string) =>
  apiClient<{ data: ProductDetailResponse }>({ route: `/products/${id}` })
    .then((r) => {
       return r.data;
    });

export interface ProductSchemaResponse {
  status: boolean;
  message: string;
  data?: {
    schema?: Record<string, unknown> | null;
  } | null;
}

export const fetchProductSchema = async (
  productId: number | string,
): Promise<Record<string, unknown> | null> => {
  const response = await apiClient<ProductSchemaResponse>({
    route: `/products/${productId}/schema`,
  });

  if (!response?.status) return null;

  const schema = response.data?.schema;
  if (!schema || typeof schema !== "object") return null;

  return schema;
};
