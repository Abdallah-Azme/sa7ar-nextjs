/**
 * Backend JSON API root (e.g. https://host/api).
 * If NEXT_PUBLIC_API_URL is only the origin (no path), routes like /cart/add resolve to
 * https://host/cart/add and the server returns 404 instead of hitting the API.
 */
export function getPublicApiBaseUrl(): string {
  const fallback = "https://saharapi.subcodeco.com/api";
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return fallback;
  try {
    const u = new URL(raw);
    const path = u.pathname.replace(/\/+$/, "");
    if (path === "" || path === "/") {
      u.pathname = "/api";
    }
    return u.href.replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}
