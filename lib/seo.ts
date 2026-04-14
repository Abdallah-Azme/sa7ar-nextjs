import type { Metadata } from 'next';
import { headers } from 'next/headers';
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

function getAlternateLanguageUrls(path = ''): { baseUrl: string; languages: Record<string, string> } {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watersohar.om';
  if (!baseUrl.startsWith('http')) baseUrl = `https://${baseUrl}`;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const isRoot = normalizedPath === '/' || normalizedPath === '';

  const languages: Record<string, string> = {};

  routing.locales.forEach((locale) => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    const urlPath = `${prefix}${isRoot ? '' : normalizedPath}`;
    languages[locale] = urlPath || '/';
  });

  languages['x-default'] = isRoot ? '/' : normalizedPath;

  return { baseUrl, languages };
}

async function resolveRequestBaseUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      return `${proto}://${host}`;
    }
  } catch {
    // Fallback to configured site URL below.
  }

  let fallback = process.env.NEXT_PUBLIC_SITE_URL || 'https://watersohar.om';
  if (!fallback.startsWith('http')) fallback = `https://${fallback}`;
  return fallback;
}

export function generateAlternateMetadata(path = ''): Pick<Metadata, 'alternates'> {
  const { languages } = getAlternateLanguageUrls(path);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const isRoot = normalizedPath === '/' || normalizedPath === '';

  return {
    alternates: {
      canonical: isRoot ? '/' : normalizedPath,
      languages,
    },
  };
}

export async function generateSeoMetadata({ title, description, lang, path = '', image, noIndex = false, keywords }: SeoProps): Promise<Metadata> {
  const baseUrl = await resolveRequestBaseUrl();
  const { languages: relativeLanguages } = getAlternateLanguageUrls(path);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const isRoot = normalizedPath === '/' || normalizedPath === '';
  const currentPrefix = lang === routing.defaultLocale ? '' : `/${lang}`;
  const currentUrl = `${currentPrefix}${isRoot ? '' : normalizedPath}` || '/';
  const absoluteLanguages = Object.fromEntries(
    Object.entries(relativeLanguages).map(([locale, localePath]) => [locale, new URL(localePath, baseUrl).toString()]),
  );
  const absoluteCanonical = new URL(currentUrl, baseUrl).toString();

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: absoluteCanonical,
      languages: absoluteLanguages,
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
