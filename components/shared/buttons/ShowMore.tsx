import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

/**
 * ShowMore - RSC (Server Component)
 * Used as a "View All" or "Read More" button link
 */
export default function ShowMore({ to }: { to?: string }) {
	return (
		<Button asChild className="bg-gray h-13 rounded-xl">
			<Link href={to ?? "#"} className="flex items-center gap-3">
				<div className="bg-white text-gray rounded-lg p-2">
					<Eye size={10} />
				</div>
				<span>Show More</span> {/* Replace with translation call if needed */}
				<ArrowLeft className="rtl:rotate-180" />
			</Link>
		</Button>
	);
}
