import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Define protected paths — matches React's ProtectedRoute usage
const protectedRoutes = ["/account", "/checkout", "/cart"];

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  // First, let next-intl handle parsing the locale
  const response = intlMiddleware(request);
  
  // Extract path without the locale prefix to check if it's protected
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.includes(route) // Simple includes works since locale might be prepended like /en/cart
  );

  if (isProtected && !token) {
    // Redirect completely unauthenticated users away from protected areas
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}`; // Start at default language root
    url.searchParams.set("auth_required", "1");
    // Ensure we keep the locale format
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",
    
    // Set a cookie to remember the previous locale for all requests that have a locale prefix
    "/(ar|en)/:path*",
    
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
