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

export async function apiClient<T = unknown>(
  { route, tokenRequire = false, isFormData = false, ...opts }: AppRequestOptions
): Promise<T> {
  const isServer = typeof window === "undefined";

  const baseURL = isServer
    ? (process.env.NEXT_PUBLIC_API_URL ?? "https://saharapi.subcodeco.com/api")
    : "/api/proxy";

  const url = isServer
    ? `${baseURL}${route}`
    : `${baseURL}?route=${encodeURIComponent(route)}`;

  // Build headers
  const headers: Record<string, string> = {
    "Accept-Language": "ar",
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
  return ofetch<T>(url, {
    headers,
    retry: 2,                   // Auto-retry transient failures
    ...opts,
  } as any);
}

export default apiClient;
