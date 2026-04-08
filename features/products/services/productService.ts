import apiClient from "@/lib/apiClient";
import type { Product } from "@/types";

export const productKeys = {
  all:         ["products"] as const,
  bestSelling: () => [...productKeys.all, "best-selling"] as const,
  accessories: () => [...productKeys.all, "accessories"] as const,
  brand:       (b: string) => [...productKeys.all, "brand", b] as const,
  brandSizes:  (b: string) => [...productKeys.brand(b), "sizes"] as const,
  detail:      (id: string) => [...productKeys.all, "detail", id] as const,
};

export const fetchBestSellingProducts = () =>
  apiClient<{ data: Product[] }>({ route: "/products/best-selling", next: { revalidate: 3600 } })
    .then(r => r.data ?? []);

export const fetchBestSellingAccessories = () =>
  apiClient<{ data: Product[] }>({ route: "/products-accessories", next: { revalidate: 3600 } })
    .then(r => r.data ?? []);

export const fetchBrandSizes = (brand: "bard" | "rathath") =>
  apiClient<{ data: { sizes: { id: number; size: string }[] } }>({
    route: `/brands/${brand}/sizes`, next: { revalidate: 3600 },
  }).then(r => r.data?.sizes ?? []);

export const fetchBrandProducts = (brand: "bard" | "rathath", sizeIds?: number[]) => {
  let route = `/brands/${brand}/products`;
  if (sizeIds?.length) route += `?size_id=${sizeIds.join(",")}`;
  return apiClient<{ data: Product[] }>({ route, next: { revalidate: 3600 } }).then(r => r.data ?? []);
};

export interface ProductDetailResponse {
  product: import("../components/ProductDetailsView").ProductDetail;
  related_products: Product[];
}

export const fetchProductDetail = (id: string) =>
  apiClient<{ data: ProductDetailResponse }>({ route: `/products/${id}`, next: { revalidate: 3600 } })
    .then(r => r.data);
