"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/routing";

/**
 * ScrollToTop - Client Component
 * Mirrors React's ScrollToTop (uses useLocation → usePathname in Next.js)
 * Scrolls window to top on every route change.
 */
export default function ScrollToTop() {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname) {
			window.scrollTo(0, 0);
		}
	}, [pathname]);

	return null;
}
