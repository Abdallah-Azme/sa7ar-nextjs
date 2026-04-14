import { NextResponse } from "next/server";
import {
  PAGE_ROUTES,
  getDynamicPageLikePaths,
  getDynamicProductSlugPaths,
  withLocalePath,
} from "@/lib/sitemap-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";

export async function GET() {
  const [arDynamicPageLike, enDynamicPageLike, productPaths] = await Promise.all([
    getDynamicPageLikePaths("ar"),
    getDynamicPageLikePaths("en"),
    getDynamicProductSlugPaths(),
  ]);

  const arRoutes = [...PAGE_ROUTES, ...arDynamicPageLike, ...productPaths].map((route) =>
    withLocalePath(route, "ar"),
  );
  const enRoutes = [...PAGE_ROUTES, ...enDynamicPageLike, ...productPaths].map((route) =>
    withLocalePath(route, "en"),
  );

  const allUrls = Array.from(new Set([...arRoutes, ...enRoutes])).map(
    (route) => `${BASE_URL}${route}`,
  );
  const body = allUrls.map((url) => `<url><loc>${url}</loc></url>`).join("");
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
