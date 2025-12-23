import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output as standalone for Amplify deployment
  output: 'standalone',
  /**
   * Remote image patterns for Next.js Image optimization.
   * Allows images from CloudFront CDN when NEXT_PUBLIC_ASSETS_CDN_BASE is set.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
    ],
  },

  /**
   * Cache headers for static assets and routes.
   * Per performance requirements:
   * - Static assets: long cache with immutable
   * - Embed pages: short cache (versioned)
   * - Dev routes: no-store in production
   */
  async headers() {
    return [
      {
        // Static assets (JS, CSS, fonts) - immutable
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Font files
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Embed pages - short cache, versioned via logic_version
        source: "/embed/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=60",
          },
        ],
      },
      {
        // Dev routes - no caching
        source: "/dev/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        // API routes - no caching (dynamic)
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
