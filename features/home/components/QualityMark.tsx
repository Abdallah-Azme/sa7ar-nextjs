"use client";

import ImageFallback from "@/components/shared/ImageFallback";
import type { QualityMarkSectionData } from "../types";

interface QualityMarkProps {
  data: QualityMarkSectionData;
}

export default function QualityMark({ data }: QualityMarkProps) {
  return (
    <section className="container">
      <div className="rounded-2xl bg-linear-to-b from-[#d8ecff] to-[#88c5f7] p-6 sm:p-8 lg:p-10">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-[#0d4ea6] sm:text-3xl lg:text-4xl">
              {data.title}
            </h2>
            <p className="max-w-3xl text-base font-medium leading-relaxed text-[#0f3f87] sm:text-lg">
              {data.description}
            </p>
          </div>

          <ImageFallback
            src={data.image}
            alt={data.imageAlt}
            width={170}
            height={120}
            className="h-auto w-36 justify-self-start object-contain sm:w-44 lg:w-52"
          />
        </div>
      </div>
    </section>
  );
}
