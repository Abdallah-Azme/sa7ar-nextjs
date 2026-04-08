"use client";

import { useCmsPageQuery } from "../hooks/useCms";
import { ShieldCheckIcon, FileTextIcon } from "lucide-react";

interface CmsPageContentProps {
  id: number;
  title: string;
  subtitle: string;
  iconType: "privacy" | "terms";
}

export default function CmsPageContent({ id, title, subtitle, iconType }: CmsPageContentProps) {
  const { data } = useCmsPageQuery(id);

  return (
    <section className="container py-16 space-y-12 grow">
      <header className="flex flex-col items-center gap-6 text-center max-w-2xl mx-auto">
        <div className={`size-16 rounded-3xl flex items-center justify-center shadow-sm ${
          iconType === "privacy" ? "bg-accent/10 text-accent" : "bg-secondary/10 text-secondary"
        }`}>
          {iconType === "privacy" ? <ShieldCheckIcon size={32} /> : <FileTextIcon size={32} />}
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">{title}</h1>
          <p className="text-gray-500 font-medium italic">{subtitle}</p>
        </div>
      </header>

      <article className="max-w-4xl mx-auto rounded-[40px] bg-background-cu border border-black/5 p-8 sm:p-14 shadow-xl">
        {data?.description ? (
          <div 
            className="prose prose-lg prose-primary max-w-none text-start
            prose-headings:text-primary prose-headings:font-extrabold
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
            prose-strong:text-secondary
            [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6"
            dangerouslySetInnerHTML={{ __html: data.description }} 
          />
        ) : (
          <p className="text-center text-gray-400 italic py-10">Content is being updated...</p>
        )}
      </article>
    </section>
  );
}
