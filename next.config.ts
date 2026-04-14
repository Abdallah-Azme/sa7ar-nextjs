import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // mcpServer: true,
  },

  images: {
    // All external image hosts used by the API
    remotePatterns: [
      // Primary backend (saharapi)
      {
        protocol: "https",
        hostname: "saharapi.subcodeco.com",
        pathname: "/**",
      },
      // Secondary backend (road-80)
      {
        protocol: "https",
        hostname: "portal.road-80.com",
        pathname: "/**",
      },
      // Common CDN/storage hosts (covers S3, Cloudflare, etc.)
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "country-code-au6g.vercel.app",
        pathname: "/**",
      },
      // Allow any http for local/dev
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
    // Formats optimized for modern browsers
    formats: ["image/avif", "image/webp"],
    // Allow unoptimized for SVG and GIF passthrough
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // ⚡ Performance Optimization: Browser Caching
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/en",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
