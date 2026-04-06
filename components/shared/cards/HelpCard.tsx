import { cn } from "@/lib/utils";
import { MessageCircleMoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HelpCardProps {
	className?: string;
	withContainer?: boolean;
	contactPage?: boolean;
}

/**
 * HelpCard - RSC (Server Component)
 * Call to action for support, used at the bottom of many pages.
 */
export default function HelpCard({
	className,
	withContainer = true,
	contactPage = false,
}: HelpCardProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between py-10",
				withContainer && "container",
				className,
			)}
		>
			<div className="space-y-3">
				<h3 className="text-xl sm:text-2xl font-extrabold">
					Need Any Help?
				</h3>
				<p className="font-light text-gray">Our support team is ready to assist you anytime.</p>
			</div>
			<Button
				asChild
				className="rounded-4xl min-w-[200px] text-white h-13 text-sm font-medium bg-black hover:bg-black/90"
			>
				<Link
					href={contactPage ? "/contact" : "/contact"}
					className="flex items-center gap-2"
				>
					<MessageCircleMoreIcon
						size={20}
						className="fill-white text-black"
					/>
					Contact Us
				</Link>
			</Button>
		</div>
	);
}
