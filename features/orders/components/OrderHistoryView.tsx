"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderStatus, type Order } from "../types";
import OrderCard from "./OrderCard";
import EmptyCard from "@/components/shared/EmptyCard";
import AppPagination from "@/components/shared/AppPagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderHistoryViewProps {
	orders: Order[];
}

const statusTabs = [
	{ id: OrderStatus.in_progress, label: "In Progress" },
	{ id: OrderStatus.delivered, label: "Delivered" },
	{ id: OrderStatus.canceled, label: "Canceled" },
];

/**
 * OrderHistoryView - Client Component
 * Interactive order history with filtering tabs and pagination support.
 */
export default function OrderHistoryView({ orders }: OrderHistoryViewProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
    
    // Status Filtering
	const activeTab = useMemo<OrderStatus>(() => {
		const tab = searchParams.get("status") as OrderStatus;
		return Object.values(OrderStatus).includes(tab) ? tab : OrderStatus.in_progress;
	}, [searchParams]);

    // Local Filtering for demo purposes (as backend already supports it via query)
    const filteredOrders = useMemo(() => {
        return orders.filter(o => o.status === activeTab);
    }, [orders, activeTab]);

	const updateStatusParams = (status: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("status", status);
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="space-y-10">
			<header className="flex items-center justify-between gap-6 flex-wrap">
				<h1 className="text-2xl font-extrabold text-primary">Your Orders</h1>
				
				{/* Tab Selector */}
				<div className="flex bg-background-cu p-1.5 rounded-full border border-black/5 shadow-sm">
					{statusTabs.map((tab) => (
						<Button
							key={tab.id}
							size="sm"
							variant={activeTab === tab.id ? "default" : "ghost"}
							className={cn(
								"rounded-full h-10 px-6 font-bold text-xs transition-all",
								activeTab === tab.id ? "shadow-md" : "text-gray hover:bg-black/5"
							)}
							onClick={() => updateStatusParams(tab.id)}
						>
							{tab.label}
						</Button>
					))}
				</div>
			</header>

			{/* List Section */}
			<div className="min-h-[400px] flex flex-col gap-4">
				{filteredOrders.length === 0 ? (
					<div className="bg-white border rounded-4xl p-16 shadow-inner text-center">
						<EmptyCard
							title="No orders found"
							description={`You don't have any ${activeTab.replace('_', ' ')} orders yet. Start your shopping journey now!`}
						/>
						<Button className="rounded-full mt-6 px-10 h-13 text-md" asChild>
                            <Link href="/">Browse Products</Link>
                        </Button>
					</div>
				) : (
					filteredOrders.map((order) => (
						<OrderCard key={order.id} order={order} onReorder={(id) => console.log('reorder', id)} />
					))
				)}
			</div>

			<AppPagination totalPages={1} />
		</div>
	);
}

// Minimal Link helper for internal use in OrderHistoryView (as global Link depends on next/link)
import NextLink from "next/link";
function Link({ href, children, ...props }: any) {
    return <NextLink href={href} {...props}>{children}</NextLink>;
}
