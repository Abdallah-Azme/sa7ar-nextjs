"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/shared/cards/ProductCard";
import EmptyCard from "@/components/shared/EmptyCard";
import AppPagination from "@/components/shared/AppPagination";
import {
  useBestSellingAccessoriesProducts,
  useBrandProductsPaginated,
} from "../hooks/useProducts";

type PageSource = "accessories" | "brand";

interface PaginatedProductsPageContentProps {
  source: PageSource;
  brand?: "bard" | "rathath";
  titleKey: string;
}

export default function PaginatedProductsPageContent({
  source,
  brand,
  titleKey,
}: PaginatedProductsPageContentProps) {
  const searchParams = useSearchParams();
  const t = useTranslations();

  const page = useMemo(() => {
    const rawPage = Number(searchParams.get("page"));
    return Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  }, [searchParams]);

  const accessoriesQuery = useBestSellingAccessoriesProducts(page, source === "accessories");
  const brandQuery = useBrandProductsPaginated(brand ?? "bard", page, source === "brand");
  const activeQuery = source === "accessories" ? accessoriesQuery : brandQuery;


  console.log({ activeQuery });
  const products = activeQuery.data?.products ?? [];
  const totalPages = activeQuery.data?.pagination?.total_pages ?? 1;

  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">{t(titleKey)}</h1>

      {activeQuery.isLoading ? (
        <div className="grid min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-3/4 bg-accent/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyCard />
      ) : (
        <div className="grid min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      )}

      <AppPagination totalPages={totalPages} />
    </div>
  );
}
