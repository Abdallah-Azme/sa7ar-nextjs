"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { OrderStatus, type Order } from "../types";
import OrderCard from "./OrderCard";
import EmptyCard from "@/components/shared/EmptyCard";
import AppPagination from "@/components/shared/AppPagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";


import { useTranslations } from "next-intl";


interface OrderHistoryViewProps {
	orders: Order[];
	totalPages?: number;
}

/**
 * OrderHistoryView - Client Component
 * Full parity with React's AccountOrder.tsx:
 *   - Localized status tab labels
 *   - Reorder with cart-clear + re-add via apiClient
 *   - Reorder confirmation dialog when cart has items
 *   - Pagination support
 */
export default function OrderHistoryView({ orders, totalPages = 1 }: OrderHistoryViewProps) {
	const t = useTranslations("orders");
	const searchParams = useSearchParams();
	const router = useRouter();

	const { cart, refreshCart } = useCart();

	const [reorderDialogId, setReorderDialogId] = useState<number | null>(null);
	const [isReordering, setIsReordering] = useState(false);
	const [reorderingId, setReorderingId] = useState<number | null>(null);

	const statusTabs = [
		{ id: OrderStatus.in_progress, label: t("tabs.in_progress") },
		{ id: OrderStatus.delivered, label: t("tabs.delivered") },
		{ id: OrderStatus.canceled, label: t("tabs.canceled") },
	];

	// Status Filtering
	const activeTab = useMemo<OrderStatus>(() => {
		const tab = searchParams.get("status") as OrderStatus;
		return Object.values(OrderStatus).includes(tab) ? tab : OrderStatus.in_progress;
	}, [searchParams]);

	const filteredOrders = useMemo(() => {
		return orders.filter((o) => o.status === activeTab);
	}, [orders, activeTab]);

	const updateStatusParams = (status: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("status", status);
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	const hasCartItems = (cart?.items?.length ?? 0) > 0;

	const doReorder = async (orderId: number) => {
		setIsReordering(true);
		setReorderingId(orderId);
		try {
			// 1. Fetch the order details
			type OrderDetailsResponse = {
				status: OrderStatus;
				notes: string | null;
				items: { product_id: number; quantity: number }[];
				address: { id: number } | null;
			};
			const orderRes = await apiClient<{ data: OrderDetailsResponse }>({
				route: `/orders/${orderId}`,
				tokenRequire: true,
			});

			const order = orderRes.data;
			if (!order) throw new Error(t("details.fetchError"));

			// 2. Clear existing cart items
			const currentItems = cart?.items ?? [];
			await Promise.all(
				currentItems.map((item) =>
					apiClient({
						route: "/cart/update",
						method: "POST",
						body: JSON.stringify({ cart_item_id: item.id, quantity: 0, _method: "PUT" }),
						tokenRequire: true,
					}),
				),
			);

			// 3. Re-add all items from original order
			for (const item of order.items) {
				await apiClient({
					route: "/cart/add",
					method: "POST",
					body: JSON.stringify({ product_id: item.product_id, quantity: item.quantity }),
					tokenRequire: true,
				});
			}

			await refreshCart();
			toast.success(t("card.reorderSuccess"));
			setReorderDialogId(null);
			router.push("/checkout");
		} catch (err: unknown) {
			const error = err as { message?: string };
			toast.error(error?.message || t("errors.reorderInvalid"));
		} finally {
			setIsReordering(false);
			setReorderingId(null);
		}
	};

	const handleReorderClick = (orderId: number) => {
		if (!hasCartItems) {
			doReorder(orderId);
			return;
		}
		setReorderDialogId(orderId);
	};

	return (
		<div className="space-y-10">
			<header className="flex items-center justify-between gap-6 flex-wrap">
				<h1 className="text-2xl font-extrabold text-primary">{t("pageTitle")}</h1>

				{/* Tab Selector */}
				<div className="flex bg-background-cu p-1.5 rounded-full border border-black/5 shadow-sm">
					{statusTabs.map((tab) => (
						<Button
							key={tab.id}
							size="sm"
							variant={activeTab === tab.id ? "default" : "ghost"}
							className={cn(
								"rounded-full h-10 px-6 font-bold text-xs transition-all",
								activeTab === tab.id ? "shadow-md" : "text-gray hover:bg-black/5",
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
							title={t("emptyTitle")}
							description={t("emptyDescription")}
						/>
						<Button className="rounded-full mt-6 px-10 h-13" asChild>
							<Link href="/products">{t("details.products")}</Link>
						</Button>
					</div>
				) : (
					filteredOrders.map((order) => (
						<OrderCard
							key={order.id}
							order={order}
							onReorder={handleReorderClick}
							isReordering={isReordering && reorderingId === order.id}
						/>
					))
				)}
			</div>

			<AppPagination totalPages={totalPages} />

			{/* Reorder Confirmation Dialog */}
			<Dialog
				open={reorderDialogId !== null}
				onOpenChange={(open) => {
					if (!open && !isReordering) setReorderDialogId(null);
				}}
			>
				<DialogContent className="sm:max-w-md p-6 rounded-3xl" showCloseButton>
					<DialogHeader>
						<DialogTitle>{t("reorderDialog.heading")}</DialogTitle>
					</DialogHeader>
					<div className="space-y-5 mt-2">
						<p className="text-sm text-gray">
							{t("reorderDialog.description")}
						</p>
						<div className="flex items-center justify-center gap-3">
							<Button
								variant="outline"
								disabled={isReordering}
								onClick={() => setReorderDialogId(null)}
								className="rounded-full px-6"
							>
								{t("reorderDialog.cancel")}
							</Button>
							<Button
								disabled={isReordering}
								onClick={() => reorderDialogId && doReorder(reorderDialogId)}
								className="rounded-full px-6"
							>
								{isReordering ? t("reorderDialog.confirmPending") : t("reorderDialog.confirm")}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
