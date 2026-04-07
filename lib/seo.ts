import type { Metadata } from 'next';
import { routing } from '@/i18n/config';

interface SeoProps {
  title: string;
  description: string;
  lang: string;
  path?: string; // Relative path without language prefix (e.g. '/about')
  image?: string;
  noIndex?: boolean;
}

export function generateSeoMetadata({ title, description, lang, path = '', image, noIndex = false }: SeoProps): Metadata {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.soharwater.com';
  if (!baseUrl.startsWith('http')) baseUrl = `https://${baseUrl}`;
  
  // Format the relative path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const isRoot = normalizedPath === '/' || normalizedPath === '';
  
  // Create alternate language dictionary
  const languages: Record<string, string> = {};
  
  routing.locales.forEach((locale) => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    languages[locale] = `${prefix}${isRoot ? '' : normalizedPath}`;
  });

  // Add x-default
  languages['x-default'] = `${isRoot ? '/' : normalizedPath}`;

  const currentPrefix = lang === routing.defaultLocale ? '' : `/${lang}`;
  const currentUrl = `${currentPrefix}${isRoot ? '' : normalizedPath}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl || '/',
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
