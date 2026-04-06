import { BadgeCheck, BookTextIcon, Leaf, Truck } from "lucide-react";
import AboutCard from "@/components/shared/cards/AboutCard";
import SectionLabel from "@/components/shared/SectionLabel";
import ImageFallback from "@/components/shared/ImageFallback";

type AboutValuesCard = {
	icon: string | null;
	title: string;
	description: string;
};

/**
 * About - RSC (Server Component)
 * Home page "About Us" section. 
 * Data is passed in from parent to keep it purely RSC.
 */
export default function About({ 
    aboutValuesCards 
}: { 
    aboutValuesCards?: AboutValuesCard[] 
}) {
	const fallbackFeatures = [
		{
			icon: <BadgeCheck className="h-6 w-6 text-primary" />,
			title: "شهادة الجودة",
			description: "معتمدة وموثقة حسب المعايير العمانية.",
		},
		{
			icon: <Truck className="h-6 w-6 text-primary" />,
			title: "راحة العملاء",
			description: "نوصلها لباب بيتك بكل عناية.",
		},
		{
			icon: <Leaf className="h-6 w-6 text-primary" />,
			title: "الاستدامة",
			description: "ممارسات صديقة للبيئة لعمان أكثر خضرة.",
		},
	];

	const featureIcons = [
		<BadgeCheck key="badge" className="h-6 w-6 text-primary" />,
		<Truck key="truck" className="h-6 w-6 text-primary" />,
		<Leaf key="leaf" className="h-6 w-6 text-primary" />,
	];

	const features = aboutValuesCards?.length
		? aboutValuesCards.map((item, index) => ({
				icon: item.icon ? (
					<ImageFallback
						src={item.icon}
						alt={item.title}
						width={24}
						height={24}
						className="h-6 w-6 object-contain"
					/>
				) : (
					featureIcons[index % featureIcons.length]
				),
				title: item.title,
				description: item.description, // HTML stripping can be done in queries helper if needed
			}))
		: fallbackFeatures;

	return (
		<section className="container grid lg:grid-cols-3 gap-10">
			<div className="gap-6 flex flex-col">
				<SectionLabel
					text="من نحن"
					Icon={<BookTextIcon size={15} />}
				/>

				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
					أكثر من مجرد مياه
					<b className="text-secondary block mt-3 font-extrabold">
						جودة وتفاني
					</b>
				</h2>

				<p className="text-black font-light text-base/10 text-justify">
					مياه صحار ليست مجرد علامة تجارية؛ بل هي التزام بتوفير العنصر الأساسي للحياة في أنقى صورة. بدأت رحلتنا برؤية تقديم مياه نقية وعالية الجودة.
				</p>
			</div>

            <div className="grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 col-span-2">
                {features.slice(0, 3).map((item, index) => (
                    <AboutCard key={index} index={index} {...item} />
                ))}
            </div>
		</section>
	);
}
