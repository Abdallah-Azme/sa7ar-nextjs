"use client";

import { cn } from "@/lib/utils";
import {
	ChevronLeftIcon,
	MessageCircleQuestionMarkIcon,
	MinusCircleIcon,
	PlusCircleIcon,
} from "lucide-react";
import { useState } from "react";
import SectionLabel from "@/components/shared/SectionLabel";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import ShowMore from "@/components/shared/buttons/ShowMore";

import { useFaqsQuery } from "../hooks/useHome";

type ApiFaqItem = {
	id: number;
	question: string;
	answer: string;
};

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

/**
 * FAQ - Client Component
 * Handles the interactive accordion for support questions
 */
export default function FAQ({ 
    faqs: initialFaqs, 
    isSection = true 
}: { 
    faqs?: ApiFaqItem[]; 
    isSection?: boolean 
}) {
    const t = useTranslations("faq");
    const locale = useLocale();
    const { data: queryFaqs } = useFaqsQuery();
    const faqs = initialFaqs || queryFaqs || [];
	const [itemSelected, setItemSelected] = useState<string>("");
    const visibleFaqs = isSection ? faqs.slice(0, 5) : faqs;

	return (
		<section className={cn("space-y-10", isSection && "container py-20")}>
			<div className="space-y-6 text-center">
				<SectionLabel
					text={t("label")}
					Icon={<MessageCircleQuestionMarkIcon size={15} />}
					center
				/>

				<h2 className="text-xl sm:text-2xl lg:text-5xl font-medium">
					{t("title.line1")} 
					<b className="font-extrabold mx-2">{t("title.emphasis")}</b>
				</h2>

				<p className="font-light text-black text-lg/10">
					{t("help.description")}
				</p>
			</div>

			<div className="space-y-6">
				<Accordion
					type="single"
					collapsible
					className="max-w-2xl mx-auto space-y-4"
					onValueChange={setItemSelected}
					value={itemSelected}
				>
					{visibleFaqs.map((faq) => (
						<AccordionItem
							className={cn(
								"border-0 px-3 bg-background-cu rounded-4xl transition-all duration-300",
								itemSelected === String(faq.id) && "bg-accent/10",
							)}
							key={faq.id}
							value={String(faq.id)}
						>
							<AccordionTrigger
								className="hover:no-underline hover:cursor-pointer items-center transition-all data-[state=open]:text-secondary data-[state=open]:font-extrabold data-[state=open]:text-lg [&>svg]:hidden"
							>
								<div className="flex items-center gap-3">
									{itemSelected === String(faq.id) ? (
										<MinusCircleIcon className="fill-secondary text-white" />
									) : (
										<PlusCircleIcon className="fill-gray text-background-cu" />
									)}
									<span className="text-start">{faq.question}</span>
								</div>
								<div
									className={cn(
										"bg-white size-12 flex justify-center items-center rounded-full transition-colors",
										itemSelected === String(faq.id) && "bg-transparent",
									)}
								>
									<ChevronLeftIcon
										size={13}
										className={cn(
											"transition-transform duration-300",
											itemSelected === String(faq.id)
												? "-rotate-90"
												: locale === "ar"
													? "rotate-0"
													: "rotate-180",
										)}
									/>
								</div>
							</AccordionTrigger>
							<AccordionContent className="ms-9 text-gray leading-8 text-base">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				{isSection && faqs.length > 5 && (
					<div className="max-w-2xl mx-auto flex justify-center mt-8">
						<ShowMore to="/faq" />
					</div>
				)}
			</div>
		</section>
	);
}
