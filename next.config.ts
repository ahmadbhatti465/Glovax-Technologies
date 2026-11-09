// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// 'unsafe-inline' is required for scripts because Next.js injects inline
// bootstrap scripts into prerendered pages. The alternative, per-request
// nonces, would force every page to render dynamically and lose ISR caching.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self' https://res.cloudinary.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  output: 'standalone', // Critical: Creates optimized standalone build
  staticPageGenerationTimeout: 180,

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/ds0fbflvi/**' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },

  compress: true, // Enable compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  reactStrictMode: true,

  // Removed: swcMinify is now enabled by default in Next.js 15+
  // swcMinify: true, // Faster minification

  // Optional performance optimizations you might want:
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.log in production
  },

  // Optional: Add experimental features if needed
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    scrollRestoration: true, // Better scroll position restoration
    optimizePackageImports: ['lucide-react', 'framer-motion'], // Tree-shake unused exports
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  // Host and path redirects
  async redirects() {
    return [
      // Direct 301 from apex domain (glovaxtechnologies.com) to www canonical domain
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "glovaxtechnologies.com",
          },
        ],
        destination: "https://www.glovaxtechnologies.com/:path*",
        permanent: true,
      },
      // Legacy route redirects
      {
        source: "/portfolio",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/portfolio/:path*",
        destination: "/work/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
