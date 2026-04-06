import Link from "next/link";
import { MessageCircleMoreIcon, ArrowUpLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionLabel from "@/components/shared/SectionLabel";

/**
 * ContactUsSection - Shared CTA component
 * Matches React's ContactUsSection with Arabic text parity.
 */
export default function ContactUsSection() {
	return (
		<section className="container">
			<div className="rounded-4xl bg-accent/10 px-6 py-12 text-center sm:px-10 sm:py-14">
				<SectionLabel
					text="تواصل معنا"
					Icon={<MessageCircleMoreIcon size={16} />}
					center
					white
				/>
				<h2 className="mt-6 text-2xl font-extrabold text-primary sm:text-4xl">
					هل لديك أي استفسار؟ تواصل معنا الآن
				</h2>
				<p className="mx-auto mt-4 max-w-2xl text-sm text-black sm:text-base">
					فريقنا جاهز للإجابة على جميع استفساراتك وتقديم أفضل خدمة لك في أقرب وقت ممكن.
				</p>
				<Button asChild className="mt-8 h-12 min-w-56 rounded-full">
					<Link href="/contact" className="flex items-center justify-center gap-2">
						<MessageCircleMoreIcon size={20} />
						تواصل معنا
						<ArrowUpLeftIcon className="rtl:rotate-180" size={18} />
					</Link>
				</Button>
			</div>
		</section>
	);
}
