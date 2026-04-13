import type { Metadata } from 'next';
import { routing } from '@/i18n/config';

interface SeoProps {
  title: string;
  description: string;
  lang: string;
  path?: string; // Relative path without language prefix (e.g. '/about')
  image?: string;
  noIndex?: boolean;
  keywords?: string;
}

export function generateSeoMetadata({ title, description, lang, path = '', image, noIndex = false, keywords }: SeoProps): Metadata {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watersohar.om';
  if (!baseUrl.startsWith('http')) baseUrl = `https://${baseUrl}`;
  
  // Format the relative path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const isRoot = normalizedPath === '/' || normalizedPath === '';
  
  // Create alternate language dictionary
  const languages: Record<string, string> = {};
  
  routing.locales.forEach((locale) => {
    // With localePrefix: 'as-needed', the default locale (ar) has no prefix
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    const urlPath = `${prefix}${isRoot ? '' : normalizedPath}`;
    languages[locale] = urlPath || '/';
  });

  // Add x-default (pointing to the default language version)
  languages['x-default'] = isRoot ? '/' : normalizedPath;

  const currentPrefix = lang === routing.defaultLocale ? '' : `/${lang}`;
  const currentUrl = `${currentPrefix}${isRoot ? '' : normalizedPath}` || '/';
  const absoluteCanonical = new URL(currentUrl, baseUrl).toString();

  const isLocalBaseUrl = /localhost|127\.0\.0\.1/.test(baseUrl);

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: absoluteCanonical,
      ...(isLocalBaseUrl ? {} : { languages }),
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
