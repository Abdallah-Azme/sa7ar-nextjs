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
};

export default withNextIntl(nextConfig);
