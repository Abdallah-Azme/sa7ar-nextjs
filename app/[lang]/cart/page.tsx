"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "@/i18n/routing";
import { ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import CartCard from "@/components/shared/cards/CartCard";
import EmptyCard from "@/components/shared/EmptyCard";
import PriceIcon from "@/components/icons/PriceIcon";
import DiscountIcon from "@/components/icons/DiscountIcon";
import ShippingIcon from "@/components/icons/ShippingIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/**
 * CartPage - Client Component
 * Manages the shopping cart overview, summary, and coupon application.
 */
interface CouponInputs {
	code: string;
}

export default function CartPage() {
	const { cart, isLoading, applyCoupon, applyCouponPending } = useCart();
	const router = useRouter();
    const isCartEmpty = !cart || cart.items.length === 0;
	const [isApplyCouponDialogOpen, setIsApplyCouponDialogOpen] = useState(false);

	const {
		handleSubmit,
		register,
		reset,
		formState: { errors },
	} = useForm<CouponInputs>({
		defaultValues: { code: "" },
	});

	const onSubmit = async (data: CouponInputs) => {
		const code = data.code?.trim();
		if (!code) {
			toast.error("يرجى إدخال الكوبون");
			return;
		}

		const isApplied = await applyCoupon(code);
		if (isApplied) {
			setIsApplyCouponDialogOpen(false);
			reset();
		}
	};

	return (
		<main className="flex flex-col min-h-screen">
			<section className="container space-y-10 py-10 grow">
				{/* Back Button / Title */}
				<Button
					variant="link"
					className="text-gray hover:no-underline p-0 flex items-center gap-2 group transition-all"
					onClick={() => router.back()}
				>
					<ArrowIcon className="rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
					<h1 className="text-xl font-extrabold text-primary">سلة المشتريات</h1>
				</Button>

				<div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
					{/* Items List */}
					<div className="space-y-6">
						{isCartEmpty && !isLoading ? (
							<div className="bg-background-cu border border-black/5 rounded-4xl p-12 text-center space-y-6">
								<EmptyCard
									title="عربة التسوّق فارغة"
									description="لم تقم بإضافة أي عنصر للسلة"
								/>
								<Button asChild className="rounded-full px-10">
									<Link href="/products">تسوّق الآن</Link>
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
								<h2 className="text-xl font-extrabold text-primary">ملخص الطلب</h2>
								<p className="text-gray text-sm">لديك شحن مجاني إذا تجاوز طلبك 5 ر.ع</p>
							</div>

							<div className="space-y-4 text-sm font-semibold text-gray">
								<div className="flex items-center justify-between">
									<span>مجموع العناصر</span>
									<span className="text-accent flex items-center gap-2">
										{cart?.subtotal?.toFixed(3)}
										<PriceIcon className="size-5" />
									</span>
								</div>
								<div className="flex items-center justify-between font-medium">
									<span>الضريبة</span>
									<span className="text-accent flex items-center gap-2">
										{cart?.tax?.toFixed(3)}
										<PriceIcon className="size-5" />
									</span>
								</div>
								{(cart?.coupon_discount ?? 0) > 0 && (
									<div className="flex items-center justify-between text-secondary">
										<span>
											الخصم
											{cart?.applied_coupon?.code ? ` (${cart.applied_coupon.code})` : ""}
										</span>
										<span className="text-secondary flex items-center gap-2">
											-{cart?.coupon_discount?.toFixed(3)}
											<PriceIcon className="size-5" />
										</span>
									</div>
								)}
								<div className="flex items-center justify-between">
									<span>التوصيل</span>
									<span className="text-accent flex items-center gap-2">
										{cart?.delivery_price?.toFixed(3)}
										<PriceIcon className="size-5" />
									</span>
								</div>
							</div>

							<div className="border-t pt-6 flex items-center justify-between text-lg font-extrabold text-secondary">
								<span>الإجمالي</span>
								<span className="text-accent flex items-center gap-2">
									{cart?.total?.toFixed(3)}
									<PriceIcon className="size-6" />
								</span>
							</div>

							<div className="space-y-3">
								<Button
									variant="outline"
									onClick={() => setIsApplyCouponDialogOpen(true)}
									className="w-full bg-white h-13 rounded-full hover:border-accent hover:text-accent group"
								>
									<DiscountIcon size={16} className="fill-black-cu text-white group-hover:fill-white group-hover:text-accent" />
									لديك كوبون خصم؟
								</Button>
								<Button
									className="w-full h-14 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
									variant="secondary"
									asChild
								>
									<Link href="/checkout" className="flex items-center gap-2">
										إتمام الطلب
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
										<p className="font-bold text-xs">توصيل سريع</p>
										<p className="text-[10px] text-gray">نفس اليوم لجميع أنحاء السلطنة</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<div className="size-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                                        <ShieldCheckIcon className="size-5 text-secondary" />
                                    </div>
									<div className="text-start leading-tight">
										<p className="font-bold text-xs">دفع آمن</p>
										<p className="text-[10px] text-gray">100% مضمون</p>
									</div>
								</div>
							</div>
						</aside>
					)}
				</div>
			</section>

			<Dialog
				open={isApplyCouponDialogOpen}
				onOpenChange={(nextOpen) => {
					if (!nextOpen) reset();
					setIsApplyCouponDialogOpen(nextOpen);
				}}
			>
				<DialogContent className="sm:max-w-md p-6 lg:p-10 rounded-3xl" showCloseButton>
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-primary">هل لديك كود خصم؟</DialogTitle>
					</DialogHeader>
					<div className="space-y-6 mt-2">
						<p className="text-sm text-gray">
							فضلاً، قم بإرفاقه واحصل على الخصم فوراً وبكل سهولة.
						</p>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<Label htmlFor="coupon-code" className="mb-2 block font-semibold">
									كود الخصم <span className="text-destructive">*</span>
								</Label>
								<div className="relative">
									<input
										id="coupon-code"
										className="flex h-12 w-full rounded-2xl border border-input bg-background-cu px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ps-12"
										placeholder="X X X X"
										{...register("code", { required: "يرجى الإدخال" })}
									/>
									<DiscountIcon className="absolute top-1/2 -translate-y-1/2 left-4 fill-black-cu text-white" />
								</div>
								{errors.code && (
									<p className="text-sm text-destructive mt-1">{errors.code.message}</p>
								)}
							</div>

							<Button
								type="submit"
								disabled={applyCouponPending}
								className="w-full rounded-full h-12"
							>
								تفعيل
								{applyCouponPending && "..."}
							</Button>
						</form>
					</div>
				</DialogContent>
			</Dialog>
		</main>
	);
}
