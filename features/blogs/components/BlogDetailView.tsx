"use client";

import { useMemo } from "react";
import ImageFallback from "@/components/shared/ImageFallback";
import { Link } from "@/i18n/routing";
import { CalendarIcon, Share2Icon } from "lucide-react";
import type { BlogItem } from "../services/blogService";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

export default function BlogDetailView({ blog }: { blog: BlogItem }) {
  const t = useTranslations("blogDetails");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const formattedDate = new Date(blog.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shareText = `${blog.title} - ${blog.subtitle}`;

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(tCommon("linkCopied"));
    } catch {
      toast.error(tCommon("errorOccurred"));
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Let the user copy the link if native share is cancelled or unsupported.
      }
    }

    await copyLink();
  };

  const openShareWindow = async (platform: "facebook" | "twitter") => {
    if (!shareUrl) return;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const shareTargets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    };

    const didOpen = window.open(shareTargets[platform], "_blank", "noopener,noreferrer,width=640,height=720");

    if (!didOpen) {
      await copyLink();
    }
  };

  return (
    <article className="flex flex-col min-h-screen bg-white">
      {/* 1. Breadcrumbs */}
      <nav className="container pt-10 pb-6">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-accent transition-colors">{tNav("home")}</Link>
          <span className="size-1 bg-gray-300 rounded-full" />
          <Link href="/blogs" className="hover:text-accent transition-colors">{tNav("blog")}</Link>
          <span className="size-1 bg-gray-300 rounded-full" />
          <span className="text-primary truncate max-w-[200px] sm:max-w-none">{blog.title}</span>
        </div>
      </nav>

      <div className="container max-w-4xl pb-24 space-y-12">
        {/* 2. Header Info */}
        <header className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/5 text-secondary rounded-full text-xs font-bold uppercase tracking-wider">
                <CalendarIcon size={14} />
                <span>{formattedDate}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-primary leading-tight tracking-tight">
                {blog.title}
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto italic">
                &ldquo;{blog.subtitle}&rdquo;
            </p>
        </header>

        {/* 3. Featured Image */}
        <div className="rounded-[60px] overflow-hidden shadow-2xl bg-gray-100 border-8 border-gray-50 aspect-video">
            <ImageFallback 
                src={blog.image} 
                alt={blog.title} 
                width={1200} 
                height={800} 
                className="w-full h-full object-cover"
            />
        </div>

        {/* 4. Article Content (Rich Text) */}
        <div className="relative">
            {/* Aesthetic Side Decoration */}
            <div className="hidden lg:block absolute -inset-s-24 top-0 space-y-6">
                <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase vertical-text transform -rotate-180 mb-4 whitespace-nowrap">{t("shareLabel")}</p>
                    <button
                      type="button"
                      onClick={() => openShareWindow("facebook")}
                      aria-label={t("social.facebook")}
                      className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-sm font-bold"
                    >
                      F
                    </button>
                    <button
                      type="button"
                      onClick={() => openShareWindow("twitter")}
                      aria-label={t("social.twitter")}
                      className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-sm font-bold"
                    >
                      X
                    </button>
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      aria-label={tCommon("copyLink")}
                      className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-sm font-bold"
                    >
                      <Share2Icon size={16} />
                    </button>
                </div>
            </div>

            <div 
                className="prose prose-lg max-w-none prose-primary px-4 sm:px-0
                prose-headings:text-primary prose-headings:font-extrabold
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
                prose-strong:text-secondary
                prose-img:rounded-4xl prose-img:shadow-lg
                [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-6
                [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6"
                dangerouslySetInnerHTML={{ __html: blog.description }}
            />
        </div>

        {/* 5. Footer Social Buttons (Mobile Friendly) */}
        <footer className="pt-16 border-t border-gray/5 text-center flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 text-sm font-extrabold text-secondary uppercase tracking-widest">
                <Share2Icon size={18} className="text-accent" />
                {t("shareLabel")}
            </div>
            <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => openShareWindow("facebook")}
                  className="px-8 h-12 bg-primary text-white rounded-full flex items-center gap-3 font-bold hover:bg-accent transition-all shadow-md"
                >
                    {t("social.facebook")}
                </button>
                <button
                  type="button"
                  onClick={() => openShareWindow("twitter")}
                  className="px-8 h-12 bg-primary text-white rounded-full flex items-center gap-3 font-bold hover:bg-accent transition-all shadow-md"
                >
                    {t("social.twitter")}
                </button>
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="px-8 h-12 bg-primary text-white rounded-full flex items-center gap-3 font-bold hover:bg-accent transition-all shadow-md"
                >
                    {tCommon("copyLink")}
                </button>
            </div>
        </footer>
      </div>
    </article>
  );
}
