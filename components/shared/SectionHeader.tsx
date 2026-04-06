import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionLabel from "./SectionLabel";

type SectionHeaderProps = {
	label: string;
	title: string;
	labelIcon?: ReactNode;
	titleIcon?: ReactNode;
	center?: boolean;
};

/**
 * SectionHeader - RSC (Server Component)
 * Uniform header used across the application sections
 */
export default function SectionHeader({
	label,
	title,
	labelIcon,
	titleIcon,
	center = false,
}: SectionHeaderProps) {
	return (
		<div className={cn("space-y-4", center && "text-center")}>
			<SectionLabel text={label} Icon={labelIcon} center={center} />
			<div
				className={cn("flex items-center gap-2", center && "justify-center")}
			>
				{titleIcon}
				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">{title}</h2>
			</div>
		</div>
	);
}
