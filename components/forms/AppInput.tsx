import { cn } from "@/lib/utils";
import React from "react";

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	Icon?: React.ReactNode;
	bgWhite?: boolean;
	onValueChange?: (value: string) => void;
}

/**
 * AppInput - Shared Client/Server Form Component
 * Unified, high-radius input field with icon support.
 */
export default function AppInput({
	Icon,
	bgWhite = false,
	className,
	value,
	onValueChange,
	...props
}: AppInputProps) {
	return (
		<div
			className={cn(
				"flex items-center sm:h-13 h-12 rounded-full overflow-hidden px-1 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-accent/50",
				bgWhite ? "bg-white" : "bg-background-cu"
			)}
		>
			<input
				className={cn(
					"flex-1 bg-transparent px-4 py-2 text-sm text-primary placeholder:text-gray-400 outline-none w-full",
					className
				)}
				value={value}
				onChange={(e) => {
					onValueChange?.(e.target.value);
					props.onChange?.(e);
				}}
				{...props}
			/>

			{Icon && (
				<div className="flex items-center px-4 shrink-0 transition-opacity">
					<span className="text-black/10 me-4">|</span>
					{Icon}
				</div>
			)}
		</div>
	);
}
