"use client";

import { useDeferredValue, useState, type KeyboardEvent } from "react";
import { Link } from "@/i18n/routing";
import AppInput from "@/components/forms/AppInput";
import ImageFallback from "@/components/shared/ImageFallback";
import PriceIcon from "@/components/icons/PriceIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type SearchProduct = {
	id: number;
	name: string;
	image: string;
	price: number;
	offer_price: number | null;
	points_value: number;
	is_accessory: boolean;
	size: string;
	seo?: import("@/types").Seo;
};

type SearchResponse = {
	products: SearchProduct[];
};

/**
 * Formats a size label (e.g. "1.5-liter" → "1.5 لتر")
 * Mirrors React's formatSizeLabel helper
 */
function formatSizeLabel(size: string): string {
	if (!size) return "";
	return size.replace(/-/g, " ");
}

import { useTranslations } from "next-intl";

/**
 * SearchDialog - Client Component
 * Mirrors React's SearchDialog: trigger input + dialog with live search results.
 * Uses the /search?keyword=... API endpoint.
 */
export default function SearchDialog() {
    const tProductsPage = useTranslations("productsPage");
	const [open, setOpen] = useState(false);
	const [keyword, setKeyword] = useState("");
	const [products, setProducts] = useState<SearchProduct[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const deferredKeyword = useDeferredValue(keyword.trim());

	// Fetch results when deferred keyword changes
	const handleSearch = async (value: string) => {
		setKeyword(value);
		const trimmed = value.trim();
		if (!trimmed) {
			setProducts([]);
			return;
		}
		setIsSearching(true);
		try {
			const res = await fetch(
				`/api/proxy?route=${encodeURIComponent(`/search?keyword=${encodeURIComponent(trimmed)}`)}`
			);
			if (res.ok) {
				const data: { data: SearchResponse } = await res.json();
				setProducts(data.data?.products ?? []);
			}
		} catch {
			setProducts([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleOpen = () => setOpen(true);

	const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleOpen();
		}
	};

	const isTyping = keyword.trim() !== deferredKeyword;
	const showLoading = isSearching || isTyping;

	return (
		<>
			{/* Trigger: read-only input + icon button */}
			<div
				role="button"
				tabIndex={0}
				onClick={handleOpen}
				onKeyDown={handleTriggerKeyDown}
				className="mx-auto flex w-full max-w-2xl items-center gap-2"
			>
				<div className="flex-1">
					<AppInput
						bgWhite
						readOnly
						placeholder={tProductsPage("searchPlaceholder")}
						Icon={<SearchIcon />}
					/>
				</div>
				<div
					aria-hidden
					className="flex cursor-pointer size-10 sm:size-13 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
				>
					<SearchIcon />
				</div>
			</div>

			{/* Search Dialog */}
			<Dialog
				open={open}
				onOpenChange={(next) => {
					setOpen(next);
					if (!next) {
						setKeyword("");
						setProducts([]);
					}
				}}
			>
				<DialogContent className="sm:max-w-xl p-6 rounded-[2.5rem]">
					<DialogHeader className="mb-4">
						<DialogTitle className="text-xl font-bold text-primary">
							{tProductsPage("searchDialog.title")}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						<AppInput
							autoFocus
							placeholder={tProductsPage("searchPlaceholder")}
							value={keyword}
							onValueChange={handleSearch}
							Icon={<SearchIcon />}
						/>

						<div className="max-h-[30rem] overflow-y-auto pe-1 scrollbar-thin scrollbar-thumb-gray-200">
							{keyword.trim().length === 0 ? (
								<p className="py-8 text-center text-sm text-gray">
									{tProductsPage("searchDialog.startTyping")}
								</p>
							) : showLoading ? (
								<p className="py-8 text-center text-sm text-gray">{tProductsPage("searchDialog.loading")}</p>
							) : products.length === 0 ? (
								<p className="py-8 text-center text-sm text-gray">
									{tProductsPage("searchDialog.noResults")}
								</p>
							) : (
								<div className="space-y-3">
									<p className="px-1 text-sm font-bold text-primary mb-2">
										{tProductsPage("searchDialog.results")}
									</p>
									{products.map((product) => (
										<Link
											key={product.id}
											href={`/products/${product.seo?.slug || product.id}`}
											onClick={() => setOpen(false)}
											className="flex items-center justify-between gap-4 rounded-3xl border border-black/5 bg-background-cu p-4 transition-all hover:bg-accent/5"
										>
											<div className="flex min-w-0 items-center gap-4">
												<div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm border border-black/5">
													<ImageFallback
														src={product.image}
														alt={product.name}
														className="object-contain p-1"
													/>
												</div>
												<div className="min-w-0 space-y-1">
													<p className="truncate text-base font-bold text-primary">
														{product.name}
													</p>
													<p className="text-xs text-gray">
														{formatSizeLabel(product.size)}
													</p>
												</div>
											</div>

											<div className="text-end text-xs font-bold text-accent">
												{product.offer_price ? (
													<div className="space-y-1">
														<p className="flex items-center gap-1">
															{product.offer_price}
															<PriceIcon />
														</p>
														<p className="flex items-center justify-end gap-1 text-[11px] text-gray line-through">
															{product.price}
															<PriceIcon />
														</p>
													</div>
												) : (
													<p className="flex items-center gap-1">
														{product.price}
														<PriceIcon />
													</p>
												)}
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
