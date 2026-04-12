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
		<section className="grid lg:grid-cols-2 gap-10">
			<div className={cn(
                "rounded-[40px] overflow-hidden flex items-center justify-center bg-gray-50",
                side === "start" ? "lg:order-first" : "lg:order-last"
            )}>
                <ImageFallback
                    src={imageUrl}
                    alt={imageAlt || title}
                    width={955}
                    height={720}
                    className="w-full h-full object-cover"
                />
            </div>

			<div
				className={cn(
					"flex flex-col gap-6 text-start max-w-148",
					side === "start" ? "lg:order-last lg:ms-auto" : "lg:order-first lg:me-auto",
				)}
			>
				<span className="font-bold text-gray">{label}</span>
				<h2 className="text-3xl lg:text-5xl font-bold">{title}</h2>
				<p className="text-gray font-light text-xl/10">{description}</p>
			</div>
		</section>
	);
}
