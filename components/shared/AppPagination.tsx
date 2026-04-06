"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useMemo } from "react";

interface AppPaginationProps {
	totalPages: number;
	className?: string;
}

/**
 * AppPagination - Client Component
 * Optimized for Next.js App Router navigation.
 */
export default function AppPagination({ totalPages, className }: AppPaginationProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentPage = useMemo(() => {
		const page = Number(searchParams.get("page")) || 1;
		return Math.min(Math.max(page, 1), totalPages);
	}, [searchParams, totalPages]);

	const createUrl = (page: number) => {
		if (!pathname) return "";
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		return `${pathname}?${params.toString()}`;
	};

	const goToPage = (page: number) => {
		router.push(createUrl(page));
	};

	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    // Simple page windowing logic for demo (can be expanded like legacy version)
    const visiblePages = totalPages > 5 
        ? pages.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
        : pages;

	return (
		<Pagination className={cn("mt-10", className)}>
			<PaginationContent className="gap-2">
				<PaginationItem>
					<PaginationPrevious
						href={createUrl(currentPage - 1)}
						onClick={(e) => { e.preventDefault(); if (currentPage > 1) goToPage(currentPage - 1); }}
						className={cn(
							"bg-background-cu shadow hover:bg-primary hover:text-white rounded-full size-11",
							currentPage === 1 && "pointer-events-none opacity-50 shadow-none"
						)}
					/>
				</PaginationItem>

				{visiblePages.map((page) => (
					<PaginationItem key={page}>
						<PaginationLink
							href={createUrl(page)}
							isActive={page === currentPage}
							onClick={(e) => { e.preventDefault(); goToPage(page); }}
							className={cn(
								"bg-background-cu shadow size-11 rounded-full",
								page === currentPage && "bg-primary text-white"
							)}
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem><PaginationEllipsis /></PaginationItem>
                )}

				<PaginationItem>
					<PaginationNext
						href={createUrl(currentPage + 1)}
						onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) goToPage(currentPage + 1); }}
						className={cn(
							"bg-background-cu shadow hover:bg-primary hover:text-white rounded-full size-11",
							currentPage === totalPages && "pointer-events-none opacity-50 shadow-none"
						)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
