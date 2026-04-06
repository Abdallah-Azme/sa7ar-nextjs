"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollToTop - Client Component
 * Mirrors React's ScrollToTop (uses useLocation → usePathname in Next.js)
 * Scrolls window to top on every route change.
 */
export default function ScrollToTop() {
	const pathname = usePathname();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}
