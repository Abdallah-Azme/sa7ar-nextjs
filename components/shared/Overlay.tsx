import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Overlay - RSC (Server Component)
 * Used for background image overlays
 */
export default function Overlay({
	degree = 45,
	children,
	className,
}: {
	degree?: number;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div className={cn("relative size-full overflow-hidden", className)}>
			<div
				style={{ backgroundColor: `rgba(0,0,0,${degree / 100})` }}
				className={cn("absolute inset-0")}
			/>
			{children}
		</div>
	);
}
