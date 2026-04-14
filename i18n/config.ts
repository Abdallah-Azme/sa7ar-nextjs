import { defineRouting } from 'next-intl/routing';

/**
 * Core i18n routing configuration.
 * Separated from navigation hooks to prevent evaluation side-effects in RSC/Metadata.
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Don't prefix the default language
  localePrefix: 'as-needed',

  // Enable locale cookie so the user's choice persists between requests.
  // Without this, navigating to "/" would re-detect locale from Accept-Language
  // and potentially redirect back to /en even when the user chose Arabic.
  localeCookie: true,

  // Disable browser-based locale detection so the URL (and cookie) are
  // the sole source of truth. Prevents Accept-Language from overriding.
  localeDetection: false,
});

/** Locales that use right-to-left layout (Embla `direction`, CSS `dir`, etc.) */
export const RTL_LOCALES = ['ar'] as const;

export function isRtlLocale(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}
