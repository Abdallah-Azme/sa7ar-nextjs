import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

/**
 * Legacy proxy function for backward compatibility
 */
export async function proxy(request: NextRequest) {
  const pathname = request?.nextUrl?.pathname;
  if (!pathname) return intlMiddleware(request);

  // Guardrail: if any static asset is accidentally requested with locale prefix
  // (e.g. /en/images/logo.svg), redirect it to root-absolute asset path.
  const localizedStaticAsset = pathname.match(/^\/(en|ar)\/(images|fonts)\/(.+)$/);
  if (localizedStaticAsset) {
    const [, , assetFolder, assetPath] = localizedStaticAsset;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${assetFolder}/${assetPath}`;
    return NextResponse.redirect(redirectUrl);
  }

  // First, let next-intl handle parsing the locale
  const response = intlMiddleware(request);

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
    
    loginUrl.pathname = locale === routing.defaultLocale ? "/" : `/${locale}`;
    loginUrl.searchParams.set("auth_required", "1");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// Next.js middleware export (proxy convention)
export default proxy;
export { proxy as middleware };

export const config = {
  // Exclude API, Next internals, and any path containing a file extension.
  // This prevents locale middleware from rewriting static assets like /images/*.svg.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
