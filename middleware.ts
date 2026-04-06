import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected paths — matches React's ProtectedRoute usage
// React protects: /cart, /checkout, /account (all sub-routes)
const protectedRoutes = ["/account", "/checkout", "/cart"];

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;

	const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

	if (isProtected && !token) {
        // Redirect completely unauthenticated users away from protected areas
		const url = request.nextUrl.clone();
		url.pathname = "/";
		url.searchParams.set("auth_required", "1");
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
    // Only run middleware on non-static/api routes
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|images|favicon).*)",
	],
};
