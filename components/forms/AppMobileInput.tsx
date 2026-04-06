"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface AppMobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	value?: string;
	onValueChange?: (value: string) => void;
	withoutLabel?: boolean;
}

/**
 * AppMobileInput - Client Component
 * Formatted mobile number input explicitly designed for Oman (+968) structure.
 */
export default function AppMobileInput({
	value,
	onValueChange,
	withoutLabel = false,
	className,
	...props
}: AppMobileInputProps) {
	return (
		<div className="space-y-3">
			{!withoutLabel && (
				<Label htmlFor="mobile" className="font-bold text-gray-700">
					Phone Number
					<span className="text-destructive ms-1">*</span>
				</Label>
			)}
			<div className="relative flex items-center bg-background-cu sm:h-13 h-12 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-accent/50 overflow-hidden">
                {/* Fixed Oman Code Segment */}
				<div className="flex h-full items-center ps-4 pe-3 bg-transparent border-none focus-visible:ring-0 gap-2 shrink-0">
                    <img
                        src="https://country-code-au6g.vercel.app/om.svg"
                        alt="Oman"
                        loading="lazy"
                        width={24}
                        height={24}
                        className="size-6 object-cover rounded-sm shadow-sm"
                    />
                    <span className="text-primary font-extrabold text-sm">+968</span>
					<span className="text-black/10 ms-2">|</span>
				</div>

				<input
					id="mobile"
					inputMode="tel"
					className={cn(
                        "flex-1 w-full bg-transparent border-none placeholder:text-gray-400 text-primary text-sm font-bold ps-2 outline-none",
                        className
                    )}
					placeholder="5x xxx xx xx"
					type="tel"
					value={value}
					onChange={(e) => {
                        onValueChange?.(e.target.value);
                        props.onChange?.(e);
                    }}
					{...props}
				/>
			</div>
		</div>
	);
}
