import { MetadataRoute } from "next";

const PAGE_ROUTES = [
  "",
  "/products",
  "/products-list",
  "/about",
  "/faq",
  "/blogs",
  "/contact",
  "/business-partnerships",
  "/privacy",
  "/terms",
  "/brands",
  "/best-selling-products",
  "/best-selling-accessories",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watersohar.om";
  const now = new Date();

  const arPages = PAGE_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const enPages = PAGE_ROUTES.map((route) => ({
    url: `${baseUrl}/en${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...arPages, ...enPages];
}
