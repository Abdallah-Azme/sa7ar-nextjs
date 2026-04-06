"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/shared/header/Header";
import Navbar from "@/components/shared/header/Navbar";
import CartCard from "@/components/shared/cards/CartCard";
import CopyrightSection from "@/components/shared/CopyrightSection";
import PriceIcon from "@/components/icons/PriceIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";

/**
 * CheckoutPage - Client Component
 * Final stage of the ordering process including address selection and payment.
 */
export default function CheckoutPage() {
	const { cart, isLoading } = useCart();
	const router = useRouter();
    
    // Mocking addresses for now until addresses feature is ported
    const addresses = [
        { id: 1, label: "Home", details: "Sohar, Al Hajrah St.", isDefault: true },
        { id: 2, label: "Office", details: "Muscat, Al Khuwair", isDefault: false }
    ];
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1);

	return (
		<main className="flex flex-col min-h-screen">
			<Header />

			<section className="container space-y-10 py-10 flex-grow">
				{/* Back Button / Title */}
				<Button
					variant="link"
					className="text-gray hover:no-underline p-0 flex items-center gap-2 group"
					onClick={() => router.back()}
				>
					<ArrowIcon className="group-hover:-translate-x-1 transition-transform" />
					<h1 className="text-xl font-extrabold text-primary">Checkout</h1>
				</Button>

				<div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
					{/* Checkout Sections */}
					<div className="space-y-6">
						
                        {/* 1. Delivery Address */}
						<section className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-extrabold text-primary">Delivery Address</h2>
								<Button variant="outline" className="rounded-full h-10">
									Change
								</Button>
							</div>

                            <div className="space-y-3">
                                {addresses.map((address) => (
                                    <div 
                                        key={address.id}
                                        onClick={() => setSelectedAddressId(address.id)}
                                        className={cn(
                                            "border rounded-2xl p-5 bg-white flex items-center justify-between gap-4 cursor-pointer transition-all",
                                            selectedAddressId === address.id ? "border-accent ring-1 ring-accent" : "hover:border-gray/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                                                <LocationPinIcon />
                                            </div>
                                            <div className="text-start">
                                                <h3 className="font-bold text-primary">{address.label}</h3>
                                                <p className="text-xs text-gray">{address.details}</p>
                                            </div>
                                        </div>
                                        {selectedAddressId === address.id && (
                                            <div className="size-6 bg-accent text-white rounded-full flex items-center justify-center">
                                                <CheckIcon size={14} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Button variant="link" className="text-accent p-0 h-auto font-bold flex items-center gap-2">
                                    <PlusIcon size={16} />
                                    Add New Address
                                </Button>
                            </div>
						</section>

                        {/* 2. Order Items */}
						<section className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-6">
							<h2 className="text-xl font-extrabold text-primary">Order Items</h2>
							<div className="space-y-4">
								{cart?.items?.map((item) => (
                                    <div key={item.id} className="opacity-80 grayscale-[0.5]">
									    <CartCard item={item} />
                                    </div>
								))}
							</div>
						</section>

                        {/* 3. Payment Method */}
						<section className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-6">
							<h2 className="text-xl font-extrabold text-primary">Payment Method</h2>
							<div className="border border-accent ring-1 ring-accent rounded-2xl p-5 bg-white flex items-center justify-between">
								<div className="text-start">
                                    <h3 className="font-bold text-primary">Online Payment</h3>
                                    <p className="text-xs text-gray">VIsa, MasterCard, Benefit, Thawani</p>
                                </div>
                                <div className="size-6 bg-accent text-white rounded-full flex items-center justify-center">
                                    <CheckIcon size={14} />
                                </div>
							</div>
						</section>

                        {/* 4. Delivery Notes */}
						<section className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-4">
							<h2 className="text-xl font-extrabold text-primary">Delivery Notes</h2>
							<textarea
								placeholder="E.g. Please leave at the door or ring the bell..."
								className="w-full min-h-32 rounded-2xl border bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-secondary transition-all"
							/>
						</section>
					</div>

					{/* Summary Sidebar */}
					<aside className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-8 sticky top-24">
						<div className="space-y-2 text-start">
							<h2 className="text-xl font-extrabold text-primary">Summary</h2>
							<p className="text-gray text-sm">Please review before confirming order.</p>
						</div>

						<div className="space-y-4 text-sm font-semibold text-gray">
							<div className="flex items-center justify-between">
								<span>Subtotal</span>
								<span className="text-accent flex items-center gap-2">
									{cart?.subtotal?.toFixed(3)}
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
							<span>Order Total</span>
							<span className="text-accent flex items-center gap-2">
								{cart?.total?.toFixed(3)}
								<PriceIcon className="size-6" />
							</span>
						</div>

						<Button
							className="w-full h-14 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
							variant="secondary"
						>
							Place Order Now
							<ArrowIcon className="rtl:rotate-180" />
						</Button>
					</aside>
				</div>
			</section>

			<CopyrightSection />
		</main>
	);
}

// Helper utility for class merging
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}
