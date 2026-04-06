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
	return (
		<div className="relative w-full">
			<input
				className={cn(
					"border-b border-gray-200 pb-3 h-12 bg-transparent rounded-none shadow-none w-full outline-none focus:border-accent transition-colors",
                    "placeholder:text-gray-400 text-primary text-sm font-medium",
					className,
				)}
				{...props}
			/>

			{Icon && (
				<div className="absolute end-2 top-1/2 transform -translate-y-1/2 text-gray-400">
					{Icon}
				</div>
			)}
		</div>
	);
}
