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
import CartIcon from "@/components/icons/CartIcon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import AccountDropdown from "@/components/auth/AccountDropdown";
import LoginDropdown from "@/components/auth/LoginDropdown";
import AuthActionWrapper from "@/components/shared/AuthActionWrapper";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useTranslations } from "next-intl";

/**
 * Nav links — mirrors React's navLinks array exactly (same paths, same icons)
 */
const navLinks = [
	{ path: "/", key: "home", Icon: ArchiveIcon },
	{ path: "/products", key: "products", Icon: ShoppingBagIcon },
	{ path: "/best-selling-products", key: "bestSellingProducts", Icon: FlameIcon },
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
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { isAuthenticated } = useAuth();
	const { cartCount } = useCart();
	const pathname = usePathname();

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
						{navLinks.map((item) => (
							<li key={item.path}>
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
							</li>
						))}
					</ul>

					{/* Right-side actions */}
					<div className="flex gap-4 items-center">
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
											{navLinks.map((item) => (
												<Link
													key={item.path}
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
											))}
										</div>
										<div className="border-t pt-4" />
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
