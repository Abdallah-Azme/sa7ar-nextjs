"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheckIcon, ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/shared/header/Header";
import Navbar from "@/components/shared/header/Navbar";
import CartCard from "@/components/shared/cards/CartCard";
import EmptyCard from "@/components/shared/EmptyCard";
import CopyrightSection from "@/components/shared/CopyrightSection";
import PriceIcon from "@/components/icons/PriceIcon";
import DiscountIcon from "@/components/icons/DiscountIcon";
import ShippingIcon from "@/components/icons/ShippingIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";

/**
 * CartPage - Client Component
 * Manages the shopping cart overview, summary, and coupon application.
 */
export default function CartPage() {
	const { cart, isLoading } = useCart();
	const router = useRouter();
    const isCartEmpty = !cart || cart.items.length === 0;

	return (
		<main className="flex flex-col min-h-screen">
			<Header />

			<section className="container space-y-10 py-10 flex-grow">
				{/* Back Button / Title */}
				<Button
					variant="link"
					className="text-gray hover:no-underline p-0 flex items-center gap-2 group transition-all"
					onClick={() => router.back()}
				>
					<ArrowIcon className="group-hover:-translate-x-1 transition-transform" />
					<h1 className="text-xl font-extrabold text-primary">Shopping Cart</h1>
				</Button>

				<div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
					{/* Items List */}
					<div className="space-y-6">
						{isCartEmpty && !isLoading ? (
							<div className="bg-background-cu/50 border rounded-4xl p-12 text-center space-y-6">
								<EmptyCard
									title="Your cart is empty"
									description="Check out our premium water products and start shopping today!"
								/>
								<Button asChild className="rounded-full px-10">
									<Link href="/products">Shop Now</Link>
								</Button>
							</div>
						) : (
							cart?.items?.map((item) => <CartCard key={item.id} item={item} />)
						)}
					</div>

					{/* Summary Sidebar */}
					{!isCartEmpty && (
						<aside className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-8 sticky top-24">
							<div className="space-y-2 text-start">
								<h2 className="text-xl font-extrabold text-primary">Order Summary</h2>
								<p className="text-gray text-sm">Review your items and shipping details.</p>
							</div>

							<div className="space-y-4 text-sm font-semibold text-gray">
								<div className="flex items-center justify-between">
									<span>Items Total</span>
									<span className="text-accent flex items-center gap-2">
										{cart?.subtotal?.toFixed(3)}
										<PriceIcon className="size-5" />
									</span>
								</div>
								<div className="flex items-center justify-between font-medium">
									<span>Tax</span>
									<span className="text-accent flex items-center gap-2">
										{cart?.tax?.toFixed(3)}
										<PriceIcon className="size-5" />
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Shipping</span>
									<span className="text-accent flex items-center gap-2">
										{cart?.delivery_price?.toFixed(3)}
										<PriceIcon className="size-5" />
									</span>
								</div>
							</div>

							<div className="border-t pt-6 flex items-center justify-between text-lg font-extrabold text-secondary">
								<span>Total Amount</span>
								<span className="text-accent flex items-center gap-2">
									{cart?.total?.toFixed(3)}
									<PriceIcon className="size-6" />
								</span>
							</div>

							<div className="space-y-3">
								<Button
									variant="outline"
									className="w-full h-13 rounded-full border-dashed hover:border-accent hover:text-accent"
								>
									<DiscountIcon className="size-5" />
									Have a promo code?
								</Button>
								<Button
									className="w-full h-14 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
									variant="secondary"
									asChild
								>
									<Link href="/checkout" className="flex items-center gap-2">
										Proceed to Checkout
										<ArrowIcon className="rtl:rotate-180" />
									</Link>
								</Button>
							</div>

							{/* Trust Badges */}
							<div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray/5">
								<div className="flex items-center gap-2">
									<div className="size-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                                        <ShippingIcon className="size-5 text-secondary" />
                                    </div>
									<div className="text-start leading-tight">
										<p className="font-bold text-xs">Fast Delivery</p>
										<p className="text-[10px] text-gray">Same day Oman</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<div className="size-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                                        <ShieldCheckIcon className="size-5 text-secondary" />
                                    </div>
									<div className="text-start leading-tight">
										<p className="font-bold text-xs">Secure Shop</p>
										<p className="text-[10px] text-gray">100% Guaranteed</p>
									</div>
								</div>
							</div>
						</aside>
					)}
				</div>
			</section>

			<CopyrightSection />
		</main>
	);
}
