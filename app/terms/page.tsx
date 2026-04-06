import { getCmsPage } from "@/features/about/queries/cms";
import Header from "@/components/shared/header/Header";
import CopyrightSection from "@/components/shared/CopyrightSection";
import { FileTextIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Sohar Water",
  description: "Review our service terms, conditions, and usage guidelines at Sohar Water.",
};

/**
 * Terms & Conditions Page - RSC (Server Component)
 * Dynamically fetches the terms agreement from the CMS.
 */
export default async function TermsPage() {
  const data = await getCmsPage(2); // CMS Page ID for Terms

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Header />

      <section className="container py-16 space-y-12 flex-grow">
        <header className="flex flex-col items-center gap-6 text-center max-w-2xl mx-auto">
            <div className="size-16 rounded-3xl bg-secondary/10 text-secondary flex items-center justify-center shadow-sm">
                <FileTextIcon size={32} />
            </div>
            <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">Terms & Conditions</h1>
                <p className="text-gray-500 font-medium italic">
                    By using our services, you agree to the guidelines listed below.
                </p>
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
                <p className="text-center text-gray-400 italic py-10">Terms content is being updated...</p>
            )}
        </article>
      </section>

      <CopyrightSection />
    </main>
  );
}
