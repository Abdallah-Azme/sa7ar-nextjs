import { getPublicApiBaseUrl } from "@/lib/apiBase";

const ROBOTS_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=300",
} as const;

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://watersohar.om";
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

function defaultRobotsContent(): string {
  const siteUrl = resolveSiteUrl();
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${siteUrl}/sitemap.xml`, ""].join("\n");
}

function pickTextValue(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const candidates = [
    record.robots,
    record.robots_txt,
    record.robotsText,
    record.content,
    record.text,
    record.file_content,
    record.value,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }

  if (record.data && typeof record.data === "object") {
    return pickTextValue(record.data);
  }

  return null;
}

function pickFileUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const candidates = [
    record.robots_url,
    record.robotsUrl,
    record.robots_file,
    record.robots_file_url,
    record.file_url,
    record.url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && /^https?:\/\//i.test(candidate)) return candidate.trim();
  }

  if (record.data && typeof record.data === "object") {
    return pickFileUrl(record.data);
  }

  return null;
}

async function fetchTextFile(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return text || null;
  } catch {
    return null;
  }
}

async function fetchAdminManagedRobots(): Promise<string | null> {
  const apiBase = getPublicApiBaseUrl();
  const endpoint = `${apiBase}/settings/robots`;

  try {
    const res = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        Accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload: unknown = await res.json();
      const inlineText = pickTextValue(payload);
      if (inlineText) return inlineText;

      const fileUrl = pickFileUrl(payload);
      if (fileUrl) {
        const fileText = await fetchTextFile(fileUrl);
        if (fileText) return fileText;
      }

      return null;
    }

    const text = (await res.text()).trim();
    return text || null;
  } catch {
    // Ignore and continue to fallback options.
  }

  const envFileUrl = process.env.ROBOTS_FILE_URL?.trim();
  if (envFileUrl && /^https?:\/\//i.test(envFileUrl)) {
    const fileText = await fetchTextFile(envFileUrl);
    if (fileText) return fileText;
  }

  return null;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const robotsText = (await fetchAdminManagedRobots()) || defaultRobotsContent();
  return new Response(robotsText, { headers: ROBOTS_HEADERS });
}

export async function HEAD() {
  return new Response(null, { headers: ROBOTS_HEADERS });
}
