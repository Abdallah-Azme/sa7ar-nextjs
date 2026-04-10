"use client";

import { XIcon } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AppDialogProps {
	trigger?: React.ReactNode;
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	heading?: string;
	actions?: React.ReactNode;
	Icon?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

export default function AppDialog({
	trigger,
	title,
	description,
	heading,
	actions,
	Icon,
	className,
	children,
	open,
	onOpenChange,
}: AppDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

			<DialogContent
				showCloseButton={false}
				className={cn("p-10 rounded-[40px] max-w-xl mx-auto", className)}
			>
				{/* Header */}
				<div className="flex justify-between items-center gap-4 mb-6 border-b pb-4">
					<h2 className="text-xs font-extrabold">{heading}</h2>
					<DialogClose asChild>
						<button className="transition-all duration-500 cursor-pointer hover:rotate-90 text-gray-400 hover:text-destructive">
							<XIcon size={24} />
						</button>
					</DialogClose>
				</div>
				{children ?? (
					<div className="flex flex-col text-center items-center gap-4">
						{Icon}
						<h3 className="font-extrabold text-2xl mb-2 text-primary">
							{title}
						</h3>
						<p className="text-gray font-medium text-xs mb-6">{description}</p>
						{actions}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
