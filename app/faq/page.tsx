import Header from "@/components/shared/header/Header";
import Banner from "@/components/shared/Banner";
import FAQ from "@/features/home/components/FAQ";
import HelpCard from "@/components/shared/cards/HelpCard";
import Footer from "@/components/shared/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Sohar Water",
  description: "Commonly asked questions about Sohar Water delivery, brands, and premium quality standards.",
};

/**
 * FAQ Page - RSC (Server Component)
 * Provides detailed information and support fallback.
 */
export default function FaqPage() {
  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Visual background lights consistent with legacy Page */}
      <div className="absolute top-1/4 -z-1 start-20 size-72 bg-accent/5 rounded-full blur-[100px]" />
      <div className="absolute top-[40%] -z-1 end-20 size-72 bg-secondary/5 rounded-full blur-[100px]" />

      <Banner 
        title="Common Questions" 
        desc="Everything you need to know about our products and services." 
        bannerUrl="/images/products-hero.webp" 
      />

      <div className="py-20">
        <FAQ />
      </div>

      <section className="container py-10">
        <div className="bg-background-cu border rounded-4xl p-10 text-center">
            <h2 className="text-3xl font-extrabold mb-4">Still Have Questions?</h2>
            <p className="text-gray mb-8">We're here to help you 24/7. Reach out via our support channels.</p>
        </div>
      </section>

      <HelpCard />
      <Footer />
    </main>
  );
}
