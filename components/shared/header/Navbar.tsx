"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import {
	MenuIcon,
	ArchiveIcon,
	ShoppingBagIcon,
	FlameIcon,
	BookTextIcon,
	MessageCircleQuestionMarkIcon,
	NewspaperIcon,
	CircleStarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import CartIcon from "@/components/icons/CartIcon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import AccountDropdown from "@/components/auth/AccountDropdown";
import LoginDropdown from "@/components/auth/LoginDropdown";
import AuthActionWrapper from "@/components/shared/AuthActionWrapper";
import ScrollToTop from "@/components/shared/ScrollToTop";
import LanguageSwitcher from "@/components/shared/header/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import { useCmsPagesQuery } from "@/features/about/hooks/useCms";
import { getCmsPagePathByKey } from "@/features/about/services/cmsService";

/**
 * Nav links — mirrors React's navLinks array exactly (same paths, same icons)
 */
const navLinks = [
	{ path: "/", key: "home", Icon: ArchiveIcon },
	{ path: "/products", key: "products", Icon: ShoppingBagIcon, hasDropdown: true },
	{ path: "/about", key: "about", Icon: BookTextIcon },
	{ path: "/faq", key: "faq", Icon: MessageCircleQuestionMarkIcon },
	{ path: "/blogs", key: "blog", Icon: NewspaperIcon },
	{ path: "/contact", key: "contact", Icon: CircleStarIcon },
] as const;

/**
 * Navbar - Client Component
 */
export default function Navbar({ logo }: { logo?: ReactNode }) {
	const t = useTranslations("nav");
	const tCommon = useTranslations("common");
	const tProducts = useTranslations("products");
	const locale = useLocale();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { isAuthenticated } = useAuth();
	const { cartCount } = useCart();
	const pathname = usePathname();
	const { data: cmsPages } = useCmsPagesQuery();
	const aboutPath = getCmsPagePathByKey(cmsPages, "about_us");
	const resolvedNavLinks = navLinks.map((item) =>
		item.key === "about" ? { ...item, path: aboutPath } : item,
	);

	// Active link helper — mirrors React NavLink's isActive logic
	const isActive = (path: string) => {
		if (!pathname) return false;
		if (path === "/") return pathname === "/";
		return pathname.startsWith(path);
	};

	// Scroll sticky effect — identical to React version
	useEffect(() => {
		const handleScroll = () => {
			const shouldStick = window.scrollY > 20;

			setIsScrolled((prev) => {
				if (prev === shouldStick) return prev;

				if (shouldStick) {
					setIsTransitioning(false);
					if (transitionTimeoutRef.current) {
						clearTimeout(transitionTimeoutRef.current);
					}
					transitionTimeoutRef.current = setTimeout(() => {
						setIsTransitioning(true);
					}, 120);
				} else {
					if (transitionTimeoutRef.current) {
						clearTimeout(transitionTimeoutRef.current);
						transitionTimeoutRef.current = null;
					}
					setIsTransitioning(false);
				}

				return shouldStick;
			});
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (transitionTimeoutRef.current) {
				clearTimeout(transitionTimeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			{/* ScrollToTop — fires on every pathname change */}
			<ScrollToTop />

			<nav
				className={cn(
					"border-b transition-all duration-600 py-4 ease-out",
					isScrolled &&
						"bg-background/95 opacity-0 -translate-y-30 fixed inset-x-0 top-0 z-50 backdrop-blur-md shadow-sm",
					isTransitioning && "opacity-100 translate-y-0",
				)}
			>
				<div className="w-full flex justify-between items-center container">
					{/* Logo */}
					{logo}

					{/* Desktop nav links */}
					<ul className="hidden lg:flex transition-all duration-1000 items-center gap-2 text-nowrap">
						{resolvedNavLinks.map((item) => (
							<li key={item.key}>
								{"hasDropdown" in item && item.hasDropdown ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button
												className={cn(
													"flex items-center gap-2 py-2 px-3 rounded-full text-xs 2xl:text-sm font-medium transition-colors outline-none",
													isActive(item.path) || pathname.startsWith("/best-selling") || pathname.startsWith("/brands")
														? "bg-primary text-white font-bold"
														: "text-gray hover:bg-primary/10",
												)}
											>
												<item.Icon size={18} />
												<span>{t(item.key)}</span>
												<ChevronDownIcon size={14} className="opacity-50" />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="w-[200px]">
											<DropdownMenuItem asChild>
												<Link href="/products" className="w-full cursor-pointer">
													{t("products")} ({tCommon("all")})
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/best-selling-products" className="w-full cursor-pointer">
													{t("bestSellingProducts")}
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/brands/bard" className="w-full cursor-pointer">
													{tProducts("sections.bard")}
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/brands/rathath" className="w-full cursor-pointer">
													{tProducts("sections.rathath")}
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/best-selling-accessories" className="w-full cursor-pointer">
													{locale === "ar" ? "إكسسوارات الأكثر مبيعًا" : "Best Selling Accessories"}
												</Link>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<Link
										href={item.path}
										className={cn(
											"flex items-center gap-2 py-2 px-3 rounded-full text-xs 2xl:text-sm font-medium transition-colors",
											isActive(item.path)
												? "bg-primary text-white font-bold"
												: "text-gray hover:bg-primary/10",
										)}
									>
										<item.Icon size={18} />
										<span>{t(item.key)}</span>
									</Link>
								)}
							</li>
						))}
					</ul>

					{/* Right-side actions */}
					<div className="flex gap-4 items-center">
						{isAuthenticated && (
							<div className="hidden sm:block">
								<LanguageSwitcher />
							</div>
						)}

						{/* Cart button — guarded by AuthActionWrapper for guests */}
						<AuthActionWrapper>
							<Button
								size={"icon-lg"}
								asChild
								className="rounded-full relative size-14 flex place-content-center bg-[#4FA1B0] hover:bg-[#438D9A] transition-colors border-none shadow-none"
							>
								<Link href="/cart" aria-label={tCommon("cart")}>
									{cartCount > 0 && (
										<span
											className="absolute size-5 border-2 border-white top-0 -inline-end-1 flex justify-center items-center bg-[#FF0084] text-[10px] font-bold text-white rounded-full z-10"
											suppressHydrationWarning
										>
											{cartCount}
										</span>
									)}
									<CartIcon className="size-6 text-white" />
								</Link>
							</Button>
						</AuthActionWrapper>

						{/* Auth section — desktop only shows AccountDropdown or LoginDropdown */}
						{isAuthenticated ? (
							<div className="hidden lg:block">
								<AccountDropdown />
							</div>
						) : (
							<LoginDropdown />
						)}

						{/* Mobile hamburger */}
						<div className="block lg:hidden">
							<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
								<SheetTrigger asChild>
									<Button
										size={"icon-lg"}
										variant="secondary"
										className="rounded-full size-12 flex place-content-center"
										aria-label={tCommon("openMenu")}
									>
										<MenuIcon />
									</Button>
								</SheetTrigger>
								<SheetContent side="end" className="w-72 sm:w-80">
									<div className="flex flex-col gap-6 p-2 mt-10">
										<div className="text-sm font-bold text-gray">{tCommon("menu")}</div>
										<div className="flex flex-col gap-2">
											{resolvedNavLinks.map((item) => {
												if ("hasDropdown" in item && item.hasDropdown) {
													return (
														<div key={item.key} className="flex flex-col gap-2">
															<Link
																href="/products"
																onClick={() => setIsSheetOpen(false)}
																className={cn(
																	"flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
																	isActive("/products")
																		? "bg-primary text-white font-bold"
																		: "text-gray hover:bg-primary/10",
																)}
															>
																<item.Icon size={18} />
																<span>{t(item.key)} ({tCommon("all")})</span>
															</Link>
															<Link
																href="/best-selling-products"
																onClick={() => setIsSheetOpen(false)}
																className={cn(
																	"flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ms-4",
																	isActive("/best-selling-products") ? "bg-primary text-white font-bold" : "text-gray hover:bg-primary/10"
																)}
															>
																<FlameIcon size={18} />
																<span>{t("bestSellingProducts")}</span>
															</Link>
															<Link
																href="/brands/bard"
																onClick={() => setIsSheetOpen(false)}
																className={cn(
																	"flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ms-4",
																	isActive("/brands/bard") ? "bg-primary text-white font-bold" : "text-gray hover:bg-primary/10"
																)}
															>
																<ShoppingBagIcon size={18} />
																<span>{tProducts("sections.bard")}</span>
															</Link>
															<Link
																href="/brands/rathath"
																onClick={() => setIsSheetOpen(false)}
																className={cn(
																	"flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ms-4",
																	isActive("/brands/rathath") ? "bg-primary text-white font-bold" : "text-gray hover:bg-primary/10"
																)}
															>
																<ShoppingBagIcon size={18} />
																<span>{tProducts("sections.rathath")}</span>
															</Link>
															<Link
																href="/best-selling-accessories"
																onClick={() => setIsSheetOpen(false)}
																className={cn(
																	"flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ms-4",
																	isActive("/best-selling-accessories") ? "bg-primary text-white font-bold" : "text-gray hover:bg-primary/10"
																)}
															>
																<ShoppingBagIcon size={18} />
																<span>{locale === "ar" ? "إكسسوارات الأكثر مبيعًا" : "Best Selling Accessories"}</span>
															</Link>
														</div>
													);
												}

												return (
													<Link
														key={item.key}
														href={item.path}
														onClick={() => setIsSheetOpen(false)}
														className={cn(
															"flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
															isActive(item.path)
																? "bg-primary text-white font-bold"
																: "text-gray hover:bg-primary/10",
														)}
													>
														<item.Icon size={18} />
														<span>{t(item.key)}</span>
													</Link>
												);
											})}
										</div>
										<div className="border-t pt-4" />
										{isAuthenticated && (
											<div className="sm:hidden -mt-1 mb-2 px-2">
												<LanguageSwitcher />
											</div>
										)}
										{/* Account dropdown inside mobile sheet (authenticated only) */}
										{isAuthenticated && (
											<div className="lg:hidden">
												<AccountDropdown />
											</div>
										)}
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
}
