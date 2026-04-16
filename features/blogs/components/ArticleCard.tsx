import { cn, htmlToPlainText } from "@/lib/utils";
import { ArrowLeftIcon, SparklesIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
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
	const cleanDesc = htmlToPlainText(description);

	if (variant === "horizontal") {
		return (
			<Link
				href={href}
				className={cn(
					"block rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
					className,
				)}
			>
				<article className="group rounded-4xl bg-background-cu p-5 transition-shadow hover:shadow-md sm:p-6">
					<div className="flex flex-col items-center gap-6 sm:flex-row">
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
							<div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
								<SparklesIcon size={12} className="text-accent" />
								<span>{meta}</span>
							</div>
							<div className="inline-flex items-center gap-1 text-xs font-bold text-accent transition-all group-hover:gap-3">
								{readMoreLabel}
								<ArrowLeftIcon size={14} className="rtl:rotate-180" />
							</div>
						</div>
					</div>
					</div>
				</article>
			</Link>
		);
	}

	return (
		<Link
			href={href}
			className={cn(
				"block rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
				className,
			)}
		>
			<article className="group flex h-full flex-col overflow-hidden rounded-4xl border border-black/5 bg-white transition-all hover:shadow-lg">
				<div className="relative aspect-4/3 overflow-hidden">
					<ImageFallback
						src={image}
						alt={title}
						width={400}
						height={300}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute top-4 inset-s-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-accent shadow-sm backdrop-blur">
						<SparklesIcon size={10} className="text-accent" />
						<span>{meta}</span>
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-4 p-6 text-start">
					<h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-primary">
						{title}
					</h3>
					<p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
						{cleanDesc}
					</p>
					<div className="mt-auto inline-flex items-center gap-2 text-sm font-extrabold text-accent transition-all group-hover:gap-4">
						{readMoreLabel}
						<ArrowLeftIcon size={16} className="rtl:rotate-180" />
					</div>
				</div>
			</article>
		</Link>
	);
}
