"use client";

import ImageFallback from "@/components/shared/ImageFallback";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export interface AboutTrustCardItem {
  id: string;
  image: string;
  title: string;
  description: string;
  imageAlt?: string;
}

export interface AboutTrustCardsSectionData {
  title: string;
  description: string;
  cards: AboutTrustCardItem[];
}

interface AboutTrustCardsSectionProps {
  data: AboutTrustCardsSectionData;
}

export default function AboutTrustCardsSection({ data }: AboutTrustCardsSectionProps) {
  if (!data.cards.length) return null;

  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-4xl space-y-4 text-center">
        <h2 className="text-2xl font-extrabold text-primary sm:text-3xl lg:text-4xl">{data.title}</h2>
        <p className="text-base leading-8 text-black/80 sm:text-lg">{data.description}</p>
      </div>

      <Carousel opts={{ align: "start", loop: data.cards.length > 4 }} className="w-full">
        <CarouselContent className="-ml-4">
          {data.cards.map((card) => (
            <CarouselItem key={card.id} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/4">
              <article className="h-full rounded-2xl border border-black/10 bg-white px-6 py-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <ImageFallback
                  src={card.image}
                  alt={card.imageAlt || card.title}
                  width={120}
                  height={120}
                  className="mx-auto mb-5 h-20 w-20 object-contain"
                />

                <h3 className="mb-3 text-lg font-bold text-primary">{card.title}</h3>
                <p className="text-sm leading-7 text-black/75 sm:text-base">{card.description}</p>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
