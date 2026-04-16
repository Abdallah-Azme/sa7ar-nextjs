import { cn } from "@/lib/utils";
import React from "react";

interface ContactUsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	Icon?: React.ReactNode;
}

/**
 * ContactUsInput - Shared Component
 * Minimalist input field with bottom border and icon support, used in contact forms.
 */
export default function ContactUsInput({
	Icon,
	className,
	...props
}: ContactUsInputProps) {
	const isLtr = props.dir === "ltr";

	return (
		<div className="relative w-full">
			<input
				className={cn(
					"border-b border-gray-200 pb-3 h-12 bg-transparent rounded-none shadow-none w-full outline-none focus:border-accent transition-colors",
					"placeholder:text-gray-400 text-primary text-sm font-medium",
					isLtr ? "text-left placeholder:text-left" : "text-right placeholder:text-right",
					Icon && (isLtr ? "pl-8" : "ps-8"),
					className,
				)}
				{...props}
			/>

			{Icon && (
				<div
					className={cn(
						"absolute top-1/2 transform -translate-y-1/2 text-gray-400",
						isLtr ? "left-2" : "inset-s-2",
					)}
				>
					{Icon}
				</div>
			)}
		</div>
	);
}
