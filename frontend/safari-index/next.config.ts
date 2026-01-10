import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output as standalone for Amplify deployment
  output: 'standalone',

  // Expose server-side environment variables to Next.js runtime
  // These must be set in Amplify Console > Environment variables
  env: {
    DYNAMO_ACCESS_KEY_ID: process.env.DYNAMO_ACCESS_KEY_ID,
    DYNAMO_SECRET_ACCESS_KEY: process.env.DYNAMO_SECRET_ACCESS_KEY,
    DYNAMO_REGION: process.env.DYNAMO_REGION,
    INQUIRY_TABLE: process.env.INQUIRY_TABLE,
    SES_REGION: process.env.SES_REGION,
    OPERATOR_EMAIL: process.env.OPERATOR_EMAIL,
    FROM_EMAIL: process.env.FROM_EMAIL,
    OPS_KEY: process.env.OPS_KEY,
    // Google Calendar integration
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
    BOOKING_TIMEZONE: process.env.BOOKING_TIMEZONE,
  },
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
