import { Card, CardContent } from "@/components/ui/card";

interface AboutCardProps {
	index: number;
	title: string;
	description: string;
	icon: React.ReactNode;
}

/**
 * AboutCard - RSC (Server Component)
 * Feature card for home page "About Us" section
 */
export default function AboutCard({
	index,
	title,
	description,
	icon,
}: AboutCardProps) {
	return (
		<Card className="bg-accent/10 text-primary border-0 shadow-none rounded-4xl">
			<CardContent className="space-y-10">
				{/* Top row */}
				<div className="flex items-center justify-between gap-3">
					{/* Index */}
					<span className="text-3xl font-bold">{index + 1},</span>

					{/* Icon */}
					<div className="flex size-13 items-center justify-center rounded-full bg-white">
						{icon}
					</div>
				</div>

				{/* Text */}
				<div className="space-y-2">
					<h2 className="text-xl font-extrabold">{title}</h2>
					<p className="text-lg font-light text-gray">
						{description}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
