import { ofetch, type FetchOptions } from "ofetch";

/**
 * Isomorphic ofetch client for sa7ar-next.
 * - Server-side  → calls the API directly (no CORS issue)
 * - Client-side  → routes through /api/proxy (avoids CORS)
 */

type AppRequestOptions = FetchOptions & {
  route: string;
  tokenRequire?: boolean;
  isFormData?: boolean;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const SUPPORTED_LOCALES = new Set(["ar", "en"]);

function getClientLocale() {
  if (typeof window === "undefined") return "ar";
  const firstPathSegment = window.location.pathname.split("/").filter(Boolean)[0];
  if (firstPathSegment && SUPPORTED_LOCALES.has(firstPathSegment)) {
    return firstPathSegment;
  }
  const htmlLang = document.documentElement.lang;
  if (htmlLang && SUPPORTED_LOCALES.has(htmlLang)) return htmlLang;
  return "ar";
}

async function getServerLocale() {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const locale = store.get("NEXT_LOCALE")?.value ?? store.get("locale")?.value;
    if (locale && SUPPORTED_LOCALES.has(locale)) return locale;
  } catch {
    // Non-fatal fallback
  }
  return "ar";
}

export async function apiClient<T = unknown>(
  { route, tokenRequire = false, isFormData = false, ...opts }: AppRequestOptions
): Promise<T> {
  const isServer = typeof window === "undefined";
  const locale = isServer ? await getServerLocale() : getClientLocale();

  const baseURL = isServer
    ? (process.env.NEXT_PUBLIC_API_URL ?? "https://saharapi.subcodeco.com/api")
    : "/api/proxy";

  const url = isServer
    ? `${baseURL}${route}`
    : `${baseURL}?route=${encodeURIComponent(route)}&locale=${encodeURIComponent(locale)}`;

  // Build headers
  const headers: Record<string, string> = {
    "Accept-Language": locale,
  };

  if (!isFormData) {
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/json";
  }

  if (tokenRequire) {
    let token: string | null = null;

    if (isServer) {
      try {
        const { cookies } = await import("next/headers");
        const store = await cookies();
        token = store.get("token")?.value ?? null;
      } catch {
        // Non-fatal: SSG context may have no cookie store
      }
    } else {
      token = localStorage.getItem("token");
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  // ofetch merges headers cleanly and handles JSON by default
  // and throws on non-2xx responses
  try {
    const rawRes = await ofetch.native(url, {
      headers,
      ...(opts as any),
    });
    
    const text = await rawRes.text();
    let data: any;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      if (!rawRes.ok) {
        throw new Error(`HTTP Error ${rawRes.status}: ${rawRes.statusText}`);
      }
      console.error(`[apiClient] JSON Parse Error at ${url}`);
      throw parseErr;
    }

    if (!rawRes.ok) {
      // Extract message from common API error shapes
      const errorMessage = data?.message || data?.error || `Request failed with status ${rawRes.status}`;
      const error = new Error(errorMessage) as any;
      error.status = rawRes.status;
      error.data = data;
      throw error;
    }

    return data as T;
  } catch (err: any) {
    throw err;
  }
}

export default apiClient;
