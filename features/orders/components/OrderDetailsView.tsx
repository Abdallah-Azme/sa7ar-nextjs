"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";
import type { OrderDetails, OrderItem } from "@/features/orders/types";

export default function OrderDetailsView({ order, mapSrc }: { order: OrderDetails; mapSrc: string }) {
	const router = useRouter();
	const [isCancelling, setIsCancelling] = useState(false);

	const productsNames = order?.items?.map((item: OrderItem) => item.name || item.product_name).join(", ");
	const canCancel = Boolean(order) && !order?.cancelled_at;

	const handleCancel = async () => {
        setIsCancelling(true);
        try {
            await apiClient({
                route: `/orders/${order.id}/cancel`,
                method: "POST",
                tokenRequire: true,
            });
            alert("Order cancelled successfully");
            router.push("/account/orders?tab=cancelled");
            router.refresh();
        } catch (err: any) {
            alert(err.message || "Failed to cancel order");
            setIsCancelling(false);
        }
	};

	return (
		<div className="space-y-6 animate-in fade-in zoom-in duration-500">
			<h2 className="text-gray-700 font-extrabold text-lg">Order Details</h2>

			<div className="relative space-y-10 group">
				<iframe
					src={mapSrc}
					width="100%"
					height="610"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					className="rounded-[40px] w-full shadow-md object-cover bg-gray-100"
					title="Delivery Map"
				/>

                {/* Floating Order Card */}
				<div 
                    className="static sm:absolute sm:bottom-8 sm:right-8 bg-white/95 backdrop-blur-md rounded-[40px] p-8 w-full sm:w-[360px] shadow-2xl border-2 border-primary/10 transition-transform duration-500 group-hover:-translate-y-2"
                >
					<div className="flex items-center justify-between gap-3 text-gray-700 mb-8 border-b pb-4">
						<h2 className="font-extrabold text-lg">#{order.id}</h2>
						<span className="text-xs font-bold bg-primary/10 px-3 py-1 rounded-full text-primary">
                            {order.created_at?.split(" ")[0]}
                        </span>
					</div>

					<div className="flex gap-4">
                        {/* Custom Animated Delivery Progression */}
						<div className="flex flex-col items-center gap-2 mt-2">
							<div className="size-3 rounded-full border-2 border-accent bg-white z-10" />
							<div className="flex flex-col gap-1.5 overflow-hidden py-1">
								{Array.from({ length: 6 }).map((_, i) => (
									<div
										className="w-1 h-1.5 rounded-full bg-accent/30 animate-pulse"
										key={i}
										style={{ animationDelay: `${i * 0.15}s` }}
									/>
								))}
							</div>
							<div className="size-3 rounded-full bg-accent z-10" />
						</div>

						<div className="flex flex-col gap-6 w-full">
							<div>
								<span className="font-bold text-xs text-gray-400 uppercase tracking-wider">Status</span>
								<p className="font-extrabold text-sm text-secondary mt-1">{order.delivery_status || "In Progress"}</p>
							</div>

							<div>
								<span className="font-bold text-xs text-gray-400 uppercase tracking-wider">Items in Order</span>
								<p className="font-bold text-sm text-gray-800 mt-1 line-clamp-2 leading-relaxed">
                                    {productsNames}
                                </p>
							</div>
						</div>
					</div>

					{canCancel && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="w-full mt-8 h-12 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold transition-all"
                                >
                                    Cancel Order
                                    <AlertCircle className="size-5 ms-2" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md rounded-[30px] p-8 text-center border-none shadow-2xl">
                                <DialogHeader>
                                    <div className="mx-auto bg-destructive/10 text-destructive w-20 h-20 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="size-10" />
                                    </div>
                                    <DialogTitle className="text-2xl font-extrabold text-primary text-center">
                                        Cancel <span className="text-destructive">Order</span>?
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium text-gray-500 text-center mt-2 leading-relaxed">
                                        Are you absolutely sure you want to cancel this order? This action is irreversible.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-3 mt-6">
                                    <Button
                                        variant="destructive"
                                        className="h-12 rounded-full font-bold shadow-none hover:scale-[1.02] transition-transform"
                                        disabled={isCancelling}
                                        onClick={handleCancel}
                                    >
                                        {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
                                    </Button>
                                    <DialogClose asChild>
                                        <Button variant="ghost" className="h-12 rounded-full font-bold text-gray-500 bg-gray-50 hover:bg-gray-100">
                                            Keep my order
                                        </Button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>
					)}
				</div>
			</div>
		</div>
	);
}
