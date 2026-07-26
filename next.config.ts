// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Critical: Creates optimized standalone build

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    // Add real production image domains here when needed.
    // Example:
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'cdn.example.com', pathname: '/**' },
    // ],
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
};

export default nextConfig;
