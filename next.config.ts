// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Critical: Creates optimized standalone build
  staticPageGenerationTimeout: 180,

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**' },
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
