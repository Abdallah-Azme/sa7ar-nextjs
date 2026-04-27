"use client";

import ImageFallback from "@/components/shared/ImageFallback";

export interface AboutExcellenceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}

export interface AboutExcellenceSectionData {
  title: string;
  description: string;
  badgeImage?: string;
  badgeImageAlt?: string;
  items: AboutExcellenceItem[];
}

interface AboutExcellenceSectionProps {
  data: AboutExcellenceSectionData;
}

export default function AboutExcellenceSection({ data }: AboutExcellenceSectionProps) {
  if (!data.items.length) return null;

  return (
    <section className="space-y-10">
      <div className="mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-[auto_1fr]">
        {data.badgeImage ? (
          <ImageFallback
            src={data.badgeImage}
            alt={data.badgeImageAlt || data.title}
            width={120}
            height={120}
            className="mx-auto h-20 w-20 object-contain md:h-24 md:w-24"
          />
        ) : null}

        <div className="space-y-3 text-center md:text-start">
          <h2 className="text-2xl font-extrabold text-primary sm:text-3xl lg:text-4xl">{data.title}</h2>
          <p className="text-sm leading-8 text-black/80 sm:text-base">{data.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4">
        {data.items.map((item) => (
          <article key={item.id} className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div className="rounded-md border border-black/10 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <h3 className="mb-2 text-xl font-bold text-primary">{item.title}</h3>
              <p className="text-sm leading-7 text-black/75">{item.description}</p>
            </div>

            <ImageFallback
              src={item.image}
              alt={item.imageAlt || item.title}
              width={90}
              height={90}
              className="mx-auto h-18 w-18 object-contain md:h-20 md:w-20"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
