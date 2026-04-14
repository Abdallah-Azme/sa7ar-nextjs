import { NextResponse } from "next/server";
import { getDynamicProductSlugPaths, withLocalePath } from "@/lib/sitemap-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";

export async function GET() {
  const productPaths = await getDynamicProductSlugPaths();
  const urls = productPaths.map((route) => `${BASE_URL}${withLocalePath(route, "ar")}`);
  const body = urls.map((url) => `<url><loc>${url}</loc></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
