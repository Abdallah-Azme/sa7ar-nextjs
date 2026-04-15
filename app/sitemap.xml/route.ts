import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
const LANGUAGE_SITEMAPS = ["pages-ar.xml", "pages-en.xml", "products-ar.xml", "products-en.xml"];

export async function GET() {
  const body = LANGUAGE_SITEMAPS.map((file) => `<sitemap><loc>${BASE_URL}/${file}</loc></sitemap>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
