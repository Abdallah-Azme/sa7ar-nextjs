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
  // Prevent locale cookie writes that force no-store on HTML responses.
  localeCookie: false
});

/** Locales that use right-to-left layout (Embla `direction`, CSS `dir`, etc.) */
export const RTL_LOCALES = ['ar'] as const;

export function isRtlLocale(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}
