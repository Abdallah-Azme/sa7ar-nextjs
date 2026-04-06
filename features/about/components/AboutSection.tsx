import { cn } from "@/lib/utils";
import ImageFallback from "@/components/shared/ImageFallback";

interface AboutSectionProps {
	title: string;
	description: string;
	label: string;
	imageUrl: string;
	imageAlt?: string;
	side?: "start" | "end";
}

/**
 * AboutSection - RSC (Server Component)
 * Grid section with alternating image/text layout for Vision & Mission.
 */
export default function AboutSection({
	title,
	description,
	label,
	imageUrl,
	imageAlt,
	side = "start",
}: AboutSectionProps) {
	return (
		<section className="grid lg:grid-cols-2 gap-16 items-center">
			<div className={cn(
                "rounded-[60px] overflow-hidden shadow-xl aspect-video lg:aspect-square flex items-center justify-center bg-gray-50",
                side === "start" ? "lg:order-first" : "lg:order-last"
            )}>
                <ImageFallback
                    src={imageUrl}
                    alt={imageAlt || title}
                    width={955}
                    height={720}
                    className="w-full h-full object-cover p-10 hover:scale-105 transition-transform duration-700"
                />
            </div>

			<div
				className={cn(
					"flex flex-col gap-6 text-start max-w-xl",
					side === "start" ? "lg:order-last lg:ms-auto" : "lg:order-first lg:me-auto",
				)}
			>
				<span className="font-extrabold text-accent bg-accent/5 px-4 py-1.5 rounded-full w-fit text-sm uppercase tracking-widest">{label}</span>
				<h2 className="text-3xl lg:text-5xl font-extrabold text-primary leading-tight">{title}</h2>
				<p className="text-gray-600 font-light text-xl/10 leading-relaxed">{description}</p>
			</div>
		</section>
	);
}
