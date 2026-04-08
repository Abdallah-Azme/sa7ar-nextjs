"use client";

import { useQuery } from "@tanstack/react-query";
import { productKeys, fetchBestSellingProducts, fetchProductDetail, fetchBrandProducts } from "../services/productService";

export function useBestSellingProducts() {
  return useQuery({
    queryKey: productKeys.bestSelling(),
    queryFn: fetchBestSellingProducts,
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
