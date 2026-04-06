import { cn } from "@/lib/utils";
import TwoLinesIcon from "@/components/icons/TwoLinesIcon";

interface EmptyCardProps {
	title?: string;
	description?: string;
	Icon?: React.ReactNode;
	className?: string;
}

/**
 * EmptyCard - RSC (Server Component)
 * Reusable component for empty lists or searches
 */
export default function EmptyCard({
	title = "No data found",
	description = "Browse our best brands and shop now...",
	Icon = <TwoLinesIcon className="mx-auto size-7 lg:size-11" />,
	className,
}: EmptyCardProps) {
	return (
		<div className={cn("text-center space-y-2.5 py-12", className)}>
			{Icon}
			<h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
			<p className="text-gray text-sm">{description}</p>
		</div>
	);
}
