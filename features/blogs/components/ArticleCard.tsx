import { cn } from "@/lib/utils";
import { ArrowLeftIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import ImageFallback from "@/components/shared/ImageFallback";

type ArticleCardVariant = "horizontal" | "vertical";

type ArticleCardProps = {
	title: string;
	description: string;
	image: string;
	meta: string;
	readMoreLabel: string;
	href?: string;
	variant?: ArticleCardVariant;
	className?: string;
};

/**
 * ArticleCard - RSC (Server Component)
 * Versatile blog card supporting vertical (grid) and horizontal (side-by-side) layouts.
 */
export default function ArticleCard({
	title,
	description,
	image,
	meta,
	readMoreLabel,
	href = "#",
	variant = "vertical",
	className,
}: ArticleCardProps) {
    
    // Clean description helper for consistent display
    const cleanDesc = description.replace(/<[^>]*>/g, "");

	if (variant === "horizontal") {
		return (
			<article
				className={cn(
					"group rounded-4xl bg-background-cu p-5 sm:p-6 hover:shadow-md transition-shadow",
					className,
				)}
			>
				<div className="flex flex-col sm:flex-row items-center gap-6">
					<div className="shrink-0 w-full sm:w-auto">
						<ImageFallback
							src={image}
							alt={title}
							width={160}
							height={160}
							className="size-full sm:size-32 rounded-3xl object-cover"
						/>
					</div>
					<div className="flex flex-1 flex-col justify-between gap-3 text-start">
						<div className="space-y-2">
							<h3 className="text-base font-extrabold text-primary line-clamp-2">
								{title}
							</h3>
							<p className="text-xs text-gray leading-relaxed line-clamp-2">
								{cleanDesc}
							</p>
						</div>
						<div className="flex items-center justify-between mt-1">
                            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                                <SparklesIcon size={12} className="text-accent" />
                                <span>{meta}</span>
                            </div>
                            <Link
                                href={href}
                                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:gap-3 transition-all"
                            >
                                {readMoreLabel}
                                <ArrowLeftIcon size={14} className="rtl:rotate-180" />
                            </Link>
                        </div>
					</div>
				</div>
			</article>
		);
	}

	return (
		<article className={cn("group flex h-full flex-col bg-white border border-black/5 rounded-4xl overflow-hidden hover:shadow-lg transition-all", className)}>
			<div className="relative aspect-[4/3] overflow-hidden">
				<ImageFallback
					src={image}
					alt={title}
					width={400}
					height={300}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				/>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full inline-flex items-center gap-1.5 text-[10px] font-bold text-accent shadow-sm">
					<SparklesIcon size={10} className="text-accent" />
					<span>{meta}</span>
				</div>
			</div>
			<div className="flex flex-col flex-1 p-6 text-start gap-4">
				<h3 className="text-xl font-extrabold text-primary leading-tight line-clamp-2">
					{title}
				</h3>
				<p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
					{cleanDesc}
				</p>
				<Link
					href={href}
					className="mt-auto inline-flex items-center gap-2 text-sm font-extrabold text-accent group-hover:gap-4 transition-all"
				>
					{readMoreLabel}
					<ArrowLeftIcon size={16} className="rtl:rotate-180" />
				</Link>
			</div>
		</article>
	);
}
