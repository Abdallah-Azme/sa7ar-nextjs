import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE_URL}/pages-ar.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/pages-en.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/products-ar.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/products-en.xml</loc></sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
