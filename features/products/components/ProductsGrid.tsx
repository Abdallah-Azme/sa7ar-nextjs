"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/shared/cards/ProductCard";
import EmptyCard from "@/components/shared/EmptyCard";
import { Product } from "@/types";
import {
  fetchBestSellingProducts,
  fetchBestSellingAccessories,
  fetchBrandProducts,
} from "@/features/products/services/productService";

interface ProductsGridProps {
  queryKey: (string | number)[];
  source: "best-selling" | "accessories" | "brand";
  brand?: "bard" | "rathath";
}

export default function ProductsGrid({ queryKey, source, brand }: ProductsGridProps) {
  const fetchFn = async (): Promise<Product[]> => {
    if (source === "best-selling") return fetchBestSellingProducts();
    if (source === "accessories") return fetchBestSellingAccessories();
    if (source === "brand" && brand) return fetchBrandProducts(brand);
    return [];
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isLoading) {
    return (
      <div className="grid min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-3/4 bg-accent/5 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyCard />;
  }

  return (
    <div className="grid min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} item={product} />
      ))}
    </div>
  );
}
