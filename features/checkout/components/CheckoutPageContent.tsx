"use client";

import { useEffect, useMemo, useState } from "react";

/** API may return decimals as strings; keeps summary rows visible. */
function formatCartMoney(value: unknown) {
	const n = Number(value);
	return Number.isFinite(n) ? n.toFixed(3) : "0.000";
}
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import CartCard from "@/components/shared/cards/CartCard";
import PriceIcon from "@/components/icons/PriceIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddressesQuery } from "@/features/addresses/hooks/useAddresses";

import { useLocale, useTranslations } from "next-intl";

type AddressItem = {
	id: number;
	location: string;
	address_label: string | null;
	address_details: string | null;
	is_default: number;
};

export default function CheckoutPageContent() {
	const t = useTranslations("account.checkout");
	const { cart, refreshCart, isLoading: isLoadingCart } = useCart();
	const router = useRouter();
    const searchParams = useSearchParams();

    // Check for payment success (landing back from gateway)
    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        const status = searchParams.get("status");

        if (sessionId || status === "success") {
             toast.success(t("success"));
             refreshCart();
             router.push("/");
        }
    }, [searchParams, router, t, refreshCart]);

     // Redirect to home if accessed with empty cart (unless loading)
     useEffect(() => {
        if (!isLoadingCart && cart && cart.items.length === 0 && !searchParams.get("session_id")) {
           // Optionally redirect home if they land here with empty cart
           // but let's keep it for now unless specific success param is present
        }
    }, [cart, isLoadingCart, searchParams]);
    
    const { data: addressesRaw, isLoading: isLoadingAddresses } = useAddressesQuery();
    const addresses = useMemo(() => (addressesRaw?.data || []) as AddressItem[], [addressesRaw]);

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
	const [deliveryNotes, setDeliveryNotes] = useState("");
	const [checkoutPending, setCheckoutPending] = useState(false);
	const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

	useEffect(() => {
		if (addresses.length > 0) {
            const toSelect = cart?.address_id 
                ? addresses.find(c => c.id === cart.address_id) 
                : addresses.find(c => Number(c.is_default) === 1);
            setSelectedAddressId(toSelect?.id ?? addresses[0].id);
        }
	}, [cart?.address_id, addresses]);

	// Keep server cart address in sync so delivery_price / totals match the selected address
	// (shipping is calculated after /cart/set-address — not only at pay click).
	useEffect(() => {
		if (isLoadingCart || isLoadingAddresses || selectedAddressId == null) return;
		if (selectedAddressId === cart?.address_id) return;

		let cancelled = false;
		(async () => {
			try {
				await apiClient({
					route: "/cart/set-address",
					method: "POST",
					body: JSON.stringify({ address_id: selectedAddressId }),
					tokenRequire: true,
				});
				if (!cancelled) await refreshCart();
			} catch {
				if (!cancelled) toast.error(t("error"));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		cart?.address_id,
		isLoadingCart,
		isLoadingAddresses,
		refreshCart,
		selectedAddressId,
		t,
	]);

	const selectedAddress = useMemo(
		() => addresses.find((address) => address.id === selectedAddressId) ?? null,
		[addresses, selectedAddressId],
	);

	const locale = useLocale();

	const handleCheckout = async () => {
		if (!selectedAddressId) {
			toast.error(t("selectAddressError"));
			return;
		}

		setCheckoutPending(true);
		try {
			await apiClient({
				route: "/cart/set-address",
				method: "POST",
				body: JSON.stringify({ address_id: selectedAddressId }),
				tokenRequire: true,
			});

			const res = await apiClient<{ message?: string; data: { payment_url?: string } }>({
				route: "/orders/checkout",
				method: "POST",
				body: JSON.stringify({
					address_id: selectedAddressId,
					payment_method: "online",
					notes: deliveryNotes.trim() || undefined,
				}),
				tokenRequire: true,
			});

			toast.success(res.message || t("success"));
			await refreshCart();

			const paymentUrl = res.data?.payment_url;
			if (paymentUrl) {
				const checkoutUrl = new URL(paymentUrl);
				checkoutUrl.searchParams.set("lang", locale);
				window.location.assign(checkoutUrl.toString());
				return;
			}
			router.push("/");
		} catch {
			toast.error(t("error"));
		} finally {
			setCheckoutPending(false);
		}
	};

	return (
		<main className="flex flex-col min-h-screen">
			<section className="container space-y-10 py-10 grow">
				{/* Back Button / Title */}
				<Button
					variant="link"
					className="text-gray hover:no-underline p-0 flex items-center gap-2 group"
					onClick={() => router.back()}
				>
					<ArrowIcon className="rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
					<h1 className="text-xl font-extrabold text-primary">{t("pageTitle")}</h1>
				</Button>

				<div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
					{/* Checkout Sections */}
					<div className="space-y-6">
						
                        {/* 1. Delivery Address */}
						<section className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-extrabold text-primary">{t("deliveryAddress")}</h2>
								<Button variant="outline" className="rounded-full h-10" onClick={() => setIsAddressDialogOpen(true)}>
									{t("change")}
								</Button>
							</div>

                            {isLoadingAddresses ? (
								<div className="border rounded-2xl p-4 space-y-3 bg-white">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-60" />
								</div>
							) : selectedAddress ? (
								<div className="border border-black/10 rounded-2xl p-4 bg-white flex items-center justify-between gap-3">
									<div className="flex items-center gap-2.5 text-[#432DD7]">
										<LocationPinIcon />
										<div>
											<h3 className="text-sm font-bold text-primary">
												{selectedAddress.address_label || selectedAddress.location || "-"}
											</h3>
											<p className="text-gray text-xs font-light">
												{selectedAddress.address_details || "-"}
											</p>
										</div>
									</div>
									<div className="size-5 shrink-0 text-white bg-accent flex items-center justify-center rounded-full">
										<CheckIcon size={14} />
									</div>
								</div>
							) : (
								<p className="text-sm text-gray">
									{t("noAddresses")}
								</p>
							)}

							{/* Add New Address link — matches React */}
							<Link
								href="/account/addresses/new"
								className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:underline underline-offset-4"
							>
								<PlusIcon size={16} />
								{t("addNewAddress")}
							</Link>
						</section>

                        {/* 2. Order Items */}
						<section className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-6">
							<h2 className="text-xl font-extrabold text-primary">{t("orderItems")}</h2>
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
							<h2 className="text-xl font-extrabold text-primary">{t("paymentMethod")}</h2>
							<div className="border border-accent ring-1 ring-accent rounded-2xl p-5 bg-white flex items-center justify-between">
								<div className="text-start">
                                    <h3 className="font-bold text-primary">{t("onlinePayment")}</h3>
                                    <p className="text-xs text-gray">{t("paymentDescription")}</p>
                                </div>
                                <div className="size-6 bg-accent text-white rounded-full flex items-center justify-center">
                                    <CheckIcon size={14} />
                                </div>
							</div>
						</section>

                        {/* 4. Delivery Notes */}
						<section className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-4">
							<h2 className="text-xl font-extrabold text-primary">{t("deliveryNotes")}</h2>
							<textarea
								value={deliveryNotes}
								onChange={(e) => setDeliveryNotes(e.target.value)}
								placeholder={t("deliveryNotesPlaceholder")}
								className="w-full min-h-32 rounded-2xl border bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-secondary transition-all"
							/>
						</section>
					</div>

					{/* Summary Sidebar */}
					<aside className="bg-background-cu border border-black/5 rounded-4xl p-8 space-y-8 sticky top-24">
						<div className="space-y-2 text-start">
							<h2 className="text-xl font-extrabold text-primary">{t("orderSummary")}</h2>
							<p className="text-gray text-sm">{t("summaryHint")}</p>
						</div>

						<div className="space-y-4 text-sm font-semibold text-gray">
							<div className="flex items-center justify-between">
								<span>{t("subtotal")}</span>
								<span className="text-accent flex items-center gap-2">
									{formatCartMoney(cart?.subtotal)}
									<PriceIcon className="size-5" />
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span>{t("tax")}</span>
								<span className="text-accent flex items-center gap-2">
									{formatCartMoney(cart?.tax)}
									<PriceIcon className="size-5" />
								</span>
							</div>
							{(Number(cart?.coupon_discount) || 0) > 0 && (
								<div className="flex items-center justify-between text-secondary">
									<span>
										{t("couponDiscount")}
										{cart?.applied_coupon?.code ? ` (${cart.applied_coupon.code})` : ""}
									</span>
									<span className="text-secondary flex items-center gap-2">
										-{formatCartMoney(cart?.coupon_discount)}
										<PriceIcon className="size-5" />
									</span>
								</div>
							)}
							<div className="flex items-center justify-between border-t border-black/5 pt-3 mt-1">
								<span className="text-primary font-bold">{t("shippingFee")}</span>
								<span className="text-accent flex items-center gap-2 font-bold">
									{Number(cart?.delivery_price) === 0 ? (
										<span className="text-secondary">{t("shippingFree")}</span>
									) : (
										<>
											{formatCartMoney(cart?.delivery_price)}
											<PriceIcon className="size-5" />
										</>
									)}
								</span>
							</div>
						</div>

						<div className="border-t pt-6 flex items-center justify-between text-lg font-extrabold text-secondary">
							<span>{t("total")}</span>
							<span className="text-accent flex items-center gap-2">
								{formatCartMoney(cart?.total)}
								<PriceIcon className="size-6" />
							</span>
						</div>

						<Button
							className="w-full h-14 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
							variant="secondary"
							disabled={checkoutPending || !selectedAddressId}
							onClick={handleCheckout}
						>
							{checkoutPending ? t("sending") : t("sendOrder")}
							<ArrowIcon className="rtl:rotate-180" />
						</Button>
					</aside>
				</div>
			</section>

			<Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
				<DialogContent className="sm:max-w-xl" showCloseButton>
					<DialogHeader>
						<DialogTitle>{t("changeAddressTitle")}</DialogTitle>
					</DialogHeader>
					<div className="space-y-3 mt-4">
						{isLoadingAddresses ? (
							Array.from({ length: 3 }).map((_, idx) => (
								<div key={idx} className="border border-black/10 rounded-xl p-3 bg-white space-y-2">
									<Skeleton className="h-4 w-36" />
									<Skeleton className="h-3 w-52" />
								</div>
							))
						) : addresses.length > 0 ? (
							addresses.map((address) => {
								const isSelected = selectedAddressId === address.id;
								return (
									<button
										key={address.id}
										type="button"
										onClick={() => {
											setSelectedAddressId(address.id);
											setIsAddressDialogOpen(false);
										}}
										className="w-full text-start border border-black/10 rounded-xl p-3 bg-white hover:bg-background-cu/80 transition-all"
									>
										<div className="flex items-center justify-between gap-2">
											<div>
												<h3 className="text-sm font-bold text-primary">
													{address.address_label || address.location || "-"}
												</h3>
												<p className="text-gray text-xs font-light">
													{address.address_details || "-"}
												</p>
											</div>
											{isSelected ? (
												<div className="size-5 shrink-0 text-white bg-accent flex items-center justify-center rounded-full">
													<CheckIcon size={14} />
												</div>
											) : null}
										</div>
									</button>
								);
							})
						) : (
							<p className="text-sm text-gray">{t("noAddressesFound")}</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</main>
	);
}
