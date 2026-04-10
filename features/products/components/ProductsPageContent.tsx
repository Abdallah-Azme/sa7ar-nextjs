"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { 
    productKeys, 
    fetchBestSellingProducts, 
    fetchBrandSizes, 
    fetchBrandProducts, 
    fetchBestSellingAccessories 
} from "../services/productService";
import ProductsCarouselSection, { type ProductFilterOption } from "./ProductsCarouselSection";
import Banner from "@/components/shared/Banner";
import BestSellingAccessories from "@/features/home/components/BestSellingAccessories";
import SearchDialog from "@/components/shared/SearchDialog";

type BrandSize = {
	id: number;
	size: string;
};

const parseSizeToMl = (value?: string | null): number | null => {
	if (!value) return null;
	const normalized = value.trim().toLowerCase().replace(",", ".");
	const numericMatch = normalized.match(/(\d+(\.\d+)?)/);
	if (!numericMatch) return null;

	const amount = Number(numericMatch[1]);
	if (Number.isNaN(amount)) return null;

	if (normalized.includes("l") && !normalized.includes("ml")) {
		return Math.round(amount * 1000);
	}

	return Math.round(amount);
};

const normalizeSizeValue = (value?: string | null): string => {
	if (!value) return "";
	const mlValue = parseSizeToMl(value);
	if (mlValue === null) return value.trim().toLowerCase();
	return String(mlValue);
};

const formatSizeLabel = (
	value: string | null | undefined,
	tCommon: ReturnType<typeof useTranslations<"common">>,
): string => {
	if (!value) return "";
	const mlValue = parseSizeToMl(value);
	if (mlValue === null) return value;

	const literUnit = tCommon("units.liter");
	const milliliterUnit = tCommon("units.milliliter");
	if (mlValue >= 1000) {
		const litersValue = mlValue / 1000;
		const formattedLiters = Number.isInteger(litersValue)
			? String(litersValue)
			: litersValue.toFixed(2).replace(/\.0+$|0+$/, "");
		return `${formattedLiters} ${literUnit}`;
	}

	return `${mlValue} ${milliliterUnit}`;
};

const getSizeIdsByFilter = (sizes: BrandSize[], filterValue: string): number[] => {
	if (filterValue === "all") return [];
	const ids = sizes
		.filter((item) => normalizeSizeValue(item.size) === filterValue)
		.map((item) => item.id);
	return Array.from(new Set(ids));
};

const buildProductsListShowMoreRoute = (
	section: "bard" | "rathath",
	sizeIds: number[],
) => {
	const params = new URLSearchParams({ section });
	if (sizeIds.length > 0) {
		params.set("size_id", sizeIds.join(","));
	}

	return `/products-list?${params.toString()}`;
};

const buildFilterOptions = (
	sizes: BrandSize[],
	allLabel: string,
	tCommon: ReturnType<typeof useTranslations<"common">>,
): ProductFilterOption[] => {
	const filters: ProductFilterOption[] = [{ value: "all", label: allLabel }];
	const seen = new Set<string>();
	sizes.forEach((item) => {
		const value = normalizeSizeValue(item.size);
		if (seen.has(value)) return;
		seen.add(value);
		filters.push({
			value,
			label: formatSizeLabel(item.size, tCommon),
		});
	});
	return filters;
};

export default function ProductsPageContent() {
  const tCommon = useTranslations("common");
  const tProducts = useTranslations("products");
  const tProductsPage = useTranslations("productsPage");
  const [selectedBardFilter, setSelectedBardFilter] = useState<string>("all");
  const [selectedRathathFilter, setSelectedRathathFilter] = useState<string>("all");

  const { data: bestSellers = [] } = useQuery({ queryKey: productKeys.bestSelling(), queryFn: fetchBestSellingProducts });
  const bardSizesQuery = useQuery({ queryKey: productKeys.brandSizes("bard"), queryFn: () => fetchBrandSizes("bard") });
  const rathathSizesQuery = useQuery({ queryKey: productKeys.brandSizes("rathath"), queryFn: () => fetchBrandSizes("rathath") });

  const bardFilters = useMemo(
		() => buildFilterOptions(bardSizesQuery.data ?? [], tProducts("filters.all"), tCommon),
		[bardSizesQuery.data, tCommon, tProducts],
	);
  const rathathFilters = useMemo(
		() => buildFilterOptions(rathathSizesQuery.data ?? [], tProducts("filters.all"), tCommon),
		[rathathSizesQuery.data, tCommon, tProducts],
	);

  const resolvedBardFilter = bardFilters.some((filter) => filter.value === selectedBardFilter)
		? selectedBardFilter
		: "all";
  const resolvedRathathFilter = rathathFilters.some((filter) => filter.value === selectedRathathFilter)
		? selectedRathathFilter
		: "all";

  const bardSizeIds = useMemo(
		() => getSizeIdsByFilter(bardSizesQuery.data ?? [], resolvedBardFilter),
		[bardSizesQuery.data, resolvedBardFilter],
	);
  const rathathSizeIds = useMemo(
		() => getSizeIdsByFilter(rathathSizesQuery.data ?? [], resolvedRathathFilter),
		[rathathSizesQuery.data, resolvedRathathFilter],
	);

  const bardProductsQuery = useQuery({
		queryKey: [...productKeys.brand("bard"), bardSizeIds.join(",")],
		queryFn: () => fetchBrandProducts("bard", bardSizeIds),
	});
  const rathathProductsQuery = useQuery({
		queryKey: [...productKeys.brand("rathath"), rathathSizeIds.join(",")],
		queryFn: () => fetchBrandProducts("rathath", rathathSizeIds),
	});

  const bardProducts = bardProductsQuery.data ?? [];
  const rathathProducts = rathathProductsQuery.data ?? [];
  const { data: accessories = [] } = useQuery({ queryKey: productKeys.accessories(), queryFn: fetchBestSellingAccessories });

  return (
    <main className="space-y-16 pb-20">
      {/* 1. Header Banner */}
      <div className="relative">
        <Banner 
          title={tProductsPage("banner.title")} 
          desc={tProductsPage("banner.description")} 
          bannerUrl="/images/products-hero.webp"
        />
        <div className="absolute inset-x-4 bottom-8 z-20 sm:inset-x-auto sm:inset-e-8 sm:w-full sm:max-w-sm">
          <SearchDialog />
        </div>
      </div>

      <div className="container space-y-20">
        {/* 2. Best Sellers */}
        {bestSellers.length > 0 && (
            <ProductsCarouselSection
                label={tProducts("label")}
                title={tProducts("mostSold")}
                filters={[]}
                products={bestSellers}
                showMoreTo="/best-selling-products"
                emptyTitle={tProductsPage("empty.title")}
                emptyDescription={tProductsPage("empty.description")}
            />
        )}

        {/* 3. Bard Brand Section */}
        <ProductsCarouselSection
          label={tProducts("label")}
          title={tProducts("sections.bard")}
          filters={bardFilters}
          selectedFilter={resolvedBardFilter}
          onFilterChange={setSelectedBardFilter}
          products={bardProducts}
          isLoading={bardProductsQuery.isLoading}
          isFiltersLoading={bardSizesQuery.isLoading}
          showMoreTo={buildProductsListShowMoreRoute("bard", bardSizeIds)}
          emptyTitle={tProductsPage("empty.title")}
          emptyDescription={tProductsPage("empty.description")}
        />

        {/* 4. Rathath Brand Section */}
        <ProductsCarouselSection
          label={tProducts("label")}
          title={tProducts("sections.rathath")}
          filters={rathathFilters}
          selectedFilter={resolvedRathathFilter}
          onFilterChange={setSelectedRathathFilter}
          products={rathathProducts}
          isLoading={rathathProductsQuery.isLoading}
          isFiltersLoading={rathathSizesQuery.isLoading}
          showMoreTo={buildProductsListShowMoreRoute("rathath", rathathSizeIds)}
          emptyTitle={tProductsPage("empty.title")}
          emptyDescription={tProductsPage("empty.description")}
        />
      </div>

      {/* 5. Best Selling Accessories */}
      <BestSellingAccessories accessories={accessories} showMoreTo="/best-selling-accessories" />
    </main>
  );
}
