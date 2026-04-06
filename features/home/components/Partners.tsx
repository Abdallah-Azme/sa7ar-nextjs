import { HandshakeIcon } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import { Card } from "@/components/ui/card";
import ImageFallback from "@/components/shared/ImageFallback";

const partners = [
	{ image: "/rzaz.svg", color: "#52A1FF1A", title: "Rzaz" },
	{ image: "/barad.svg", color: "#2C6C8D1A", title: "Barad" },
];

/**
 * Partners - RSC (Server Component)
 * Partner/Category showcases on home page
 */
export default function Partners() {
	return (
		<section className="container grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
			<div className="grid sm:grid-cols-2 gap-6">
				{partners.map((item, index) => (
					<Card
						key={index}
						style={{ background: item.color, borderColor: item.color }}
						className="w-full rounded-[80px] border flex items-center justify-center p-8"
					>
						<ImageFallback
							src={`/images/placeholder/${item.image}`}
							alt={item.title}
							width={260}
							height={260}
							className="size-60 object-contain"
						/>
					</Card>
				))}
			</div>

			<div className="gap-6 flex flex-col">
				<SectionLabel
					text="شركاؤنا"
					Icon={<HandshakeIcon size={15} />}
				/>

				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
					شراكات
					<b className="text-secondary block mt-3 font-extrabold">
						استراتيجية
					</b>
				</h2>

				<p className="text-black text-lg/10 text-justify mt-auto">
					نتعاون مع أفضل الأسماء في الصناعة لضمان وصول مياه صحار إلى كل ركن من أركان المجتمع بأعلى معايير الموثوقية.
				</p>
			</div>
		</section>
	);
}
