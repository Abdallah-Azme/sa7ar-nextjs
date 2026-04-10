"use client";

import { useQuery } from "@tanstack/react-query";
import {
  productKeys,
  fetchBestSellingProducts,
  fetchMostSoldProducts,
  fetchProductDetail,
  fetchBrandProducts,
  fetchBestSellingAccessoriesPaginated,
  fetchBrandProductsPaginated,
} from "../services/productService";

export function useBestSellingProducts() {
  return useQuery({
    queryKey: productKeys.bestSelling(),
    queryFn: fetchBestSellingProducts,
  });
}

export function useMostSoldProducts(page: number) {
  return useQuery({
    queryKey: productKeys.mostSold(page),
    queryFn: () => fetchMostSoldProducts(page),
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductDetail(id),
    enabled: !!id,
  });
}

export function useBrandProducts(brand: "bard" | "rathath", sizeIds?: number[]) {
  return useQuery({
    queryKey: sizeIds?.length ? [...productKeys.brand(brand), sizeIds] : productKeys.brand(brand),
    queryFn: () => fetchBrandProducts(brand, sizeIds),
  });
}

export function useBestSellingAccessoriesProducts(page: number, enabled = true) {
  return useQuery({
    queryKey: productKeys.accessoriesPaged(page),
    queryFn: () => fetchBestSellingAccessoriesPaginated(page),
    enabled,
  });
}

export function useBrandProductsPaginated(
  brand: "bard" | "rathath",
  page: number,
  enabled = true,
) {
  return useQuery({
    queryKey: productKeys.brandPaged(brand, page),
    queryFn: () => fetchBrandProductsPaginated(brand, page),
    enabled,
  });
}
