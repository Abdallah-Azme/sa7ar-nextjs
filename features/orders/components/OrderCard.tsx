"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import WaterDrop from "@/components/icons/WaterDrop";
import TargetIcon from "@/components/icons/TargetIcon";
import ImageFallback from "@/components/shared/ImageFallback";
import { OrderStatus, type Order } from "../types";

interface OrderCardProps {
	order: Order;
	onReorder?: (orderId: number) => void;
	isReordering?: boolean;
}

/**
 * OrderCard - Client Component
 * Displays summary info for a single historical order.
 */
export default function OrderCard({
	order,
	onReorder,
	isReordering = false,
}: OrderCardProps) {
	return (
		<Card className="border border-black/5 rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center gap-4 px-4 py-5 sm:px-6 sm:py-6">
				{/* Thumbnail */}
				<div className="flex justify-center items-center bg-background-cu shrink-0 size-20 sm:size-24 rounded-3xl overflow-hidden border">
					<ImageFallback
						src={order.image}
						alt={`Order #${order.id}`}
						width={80}
						height={80}
						className="object-contain"
					/>
				</div>

				<div className="flex-1 flex flex-col gap-4">
					{/* Details Grid */}
					<div className="flex items-center justify-between text-gray gap-3">
						<div className="space-y-1">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
								<WaterDrop size={14} className="text-accent" />
								<span>{order.total} OMR</span>
							</div>
							<h2 className="text-primary font-extrabold text-sm sm:text-base line-clamp-1">
								{order.items_summary}
							</h2>
						</div>
						<div className="text-end space-y-1 shrink-0">
							<p className="text-xs font-extrabold text-primary">#{order.id}</p>
							<p className="text-[10px] text-gray uppercase tracking-wider">{order.created_at}</p>
						</div>
					</div>

					{/* Responsive Actions */}
					<div className="flex flex-wrap items-center gap-2">
                        {order.status === OrderStatus.delivered ? (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-full px-6"
                                disabled={isReordering}
                                onClick={() => onReorder?.(order.id)}
                            >
                                {isReordering ? "Processing..." : "Reorder"}
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" className="rounded-full px-6" asChild>
                                <Link href={`/account/orders/${order.id}`}>
                                    <TargetIcon size={14} className="me-2" />
                                    Track Order
                                </Link>
                            </Button>
                        )}
                        
                        {/* Status Badge */}
						<div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            order.status === OrderStatus.delivered ? "bg-green-100 text-green-700" :
                            order.status === OrderStatus.canceled ? "bg-red-100 text-red-700" :
                            "bg-accent/10 text-secondary"
                        )}>
							{order.order_status_value}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
