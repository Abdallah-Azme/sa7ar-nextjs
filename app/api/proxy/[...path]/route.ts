import { NextRequest, NextResponse } from "next/server";
import { getPublicApiBaseUrl } from "@/lib/apiBase";

/**
 * Path-based proxy: POST /api/proxy/cart/add?locale=ar → backend /api/cart/add
 * (Avoids ?route=%2Fcart%2Fadd encoding in DevTools.)
 */
const API_BASE = getPublicApiBaseUrl();
const SUPPORTED_LOCALES = new Set(["ar", "en"]);

type RouteCtx = { params: Promise<{ path: string[] }> };

function getAuthorizationHeader(req: NextRequest) {
  const explicitAuth = req.headers.get("Authorization");
  if (explicitAuth) return explicitAuth;

  const tokenFromCookie = req.cookies.get("token")?.value;
  return tokenFromCookie ? `Bearer ${tokenFromCookie}` : "";
}

function getLocaleFromReferer(referer: string | null) {
  if (!referer) return null;
  try {
    const parsed = new URL(referer);
    const firstPathSegment = parsed.pathname.split("/").filter(Boolean)[0];
    return firstPathSegment && SUPPORTED_LOCALES.has(firstPathSegment)
      ? firstPathSegment
      : null;
  } catch {
    return null;
  }
}

function getRequestLocale(req: NextRequest) {
  const localeFromQuery = req.nextUrl.searchParams.get("locale");
  if (localeFromQuery && SUPPORTED_LOCALES.has(localeFromQuery)) return localeFromQuery;

  const localeFromCookie = req.cookies.get("NEXT_LOCALE")?.value ?? req.cookies.get("locale")?.value;
  if (localeFromCookie && SUPPORTED_LOCALES.has(localeFromCookie)) return localeFromCookie;

  const localeFromReferer = getLocaleFromReferer(req.headers.get("referer"));
  if (localeFromReferer) return localeFromReferer;

  return "ar";
}

function upstreamSearchParams(req: NextRequest) {
  const p = new URLSearchParams(req.nextUrl.searchParams);
  p.delete("locale");
  const s = p.toString();
  return s ? `?${s}` : "";
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  if (!path?.length) {
    return NextResponse.json({ message: "Path required" }, { status: 400 });
  }

  const apiPath = `/${path.join("/")}`;
  const url = `${API_BASE}${apiPath}${upstreamSearchParams(req)}`;
  const locale = getRequestLocale(req);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: getAuthorizationHeader(req),
        "Accept-Language": locale,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ message: "Failed to proxy request" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  if (!path?.length) {
    return NextResponse.json({ message: "Path required" }, { status: 400 });
  }

  const apiPath = `/${path.join("/")}`;

  try {
    const locale = getRequestLocale(req);
    const contentType = req.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");

    const baseHeaders: Record<string, string> = {
      Authorization: getAuthorizationHeader(req),
      "Accept-Language": locale,
      Accept: "application/json",
    };

    const fetchOptions: RequestInit = {
      method: "POST",
      headers: baseHeaders,
    };

    if (isMultipart) {
      const formData = await req.formData();
      fetchOptions.body = formData;
    } else {
      const body = await req.json();
      fetchOptions.body = JSON.stringify(body);
      baseHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${apiPath}`, fetchOptions);

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ message: "Failed to proxy request" }, { status: 500 });
  }
}
