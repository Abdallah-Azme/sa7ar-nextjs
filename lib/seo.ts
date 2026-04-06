import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

interface SeoProps {
  title: string;
  description: string;
  lang: string;
  path?: string; // Relative path without language prefix (e.g. '/about')
  image?: string;
  noIndex?: boolean;
}

export function generateSeoMetadata({ title, description, lang, path = '', image, noIndex = false }: SeoProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.soharwater.com';
  
  // Format the relative path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const isRoot = normalizedPath === '/' || normalizedPath === '';
  
  // Create alternate language dictionary
  const languages: Record<string, string> = {};
  
  routing.locales.forEach((locale) => {
    // If root path is needed and locale is not default locale
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    languages[locale] = `${baseUrl}${prefix}${isRoot ? '' : normalizedPath}`;
  });

  const currentPrefix = lang === routing.defaultLocale ? '' : `/${lang}`;
  const currentUrl = `${baseUrl}${currentPrefix}${isRoot ? '' : normalizedPath}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: 'Sohar Water',
      images: image ? [{ url: image }] : [],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}
