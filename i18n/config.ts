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
  localePrefix: 'as-needed'
});
