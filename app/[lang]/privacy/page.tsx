import { getCmsPage } from "@/features/about/queries/cms";
import { ShieldCheckIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Sohar Water",
  description: "Learn how we handle your personal data and protect your privacy at Sohar Water.",
};

/**
 * Privacy Policy Page - RSC (Server Component)
 * Dynamically fetches the privacy policy from the CMS.
 */
export default async function PrivacyPage() {
  const data = await getCmsPage(3); // CMS Page ID for Privacy

  return (
    <main className="flex flex-col min-h-screen bg-white">
      
      <section className="container py-16 space-y-12 grow">
        <header className="flex flex-col items-center gap-6 text-center max-w-2xl mx-auto">
            <div className="size-16 rounded-3xl bg-accent/10 text-accent flex items-center justify-center shadow-sm">
                <ShieldCheckIcon size={32} />
            </div>
            <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">Privacy Policy</h1>
                <p className="text-gray-500 font-medium italic">
                    Your trust is our priority. This document outlines our standards for data protection.
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
                <p className="text-center text-gray-400 italic py-10">Policy content is being updated...</p>
            )}
        </article>
      </section>
    </main>
  );
}
