import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

/**
 * Legacy proxy function for backward compatibility
 */
export async function proxy(request: NextRequest) {
  // First, let next-intl handle parsing the locale
  const response = intlMiddleware(request);
  
  const pathname = request?.nextUrl?.pathname;
  if (!pathname) return response;

  // Protected paths check
  const isProtectedPath = 
    pathname.includes('/cart') || 
    pathname.includes('/checkout') || 
    pathname.includes('/account');

  const token = request.cookies.get('token')?.value;

  if (isProtectedPath && !token) {
    // Redirect to login if not authenticated on a protected route
    const loginUrl = new URL(request.nextUrl.origin);
    
    // Find current locale
    const localeMatch = pathname.match(/^\/(en|ar)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    
    loginUrl.pathname = `/${locale}/?auth_required=1`;
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// Next.js middleware export (proxy convention)
export default proxy;
export { proxy as middleware };

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (static files)
  // - /_vercel (Vercel internals)
  // - /static (static assets)
  // - all root files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_static|_vercel|static|[\\w-]+\\.\\w+).*)']
};
