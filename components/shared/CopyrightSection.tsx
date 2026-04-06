import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * CopyrightSection - RSC (Server Component)
 * Standardized footer copyright row used on specific checkout/auth pages.
 */
export default function CopyrightSection({ className }: { className?: string }) {
	const year = new Date().getFullYear();
	return (
		<div className={cn("py-14 container border-t mt-6 flex font-bold items-center justify-between text-sm text-gray flex-col sm:flex-row gap-4", className)}>
			<span>© {year} Sohar Water. All rights reserved.</span>
			<span className="flex items-center gap-2">
				<Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
				<span aria-hidden>·</span>
				<Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
			</span>
		</div>
	);
}
