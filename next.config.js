/**
 * Next.js Configuration - Optimized for Next.js 16+ with Turbopack
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 * @type {import('next').NextConfig}
 */

import path from 'path';
import { fileURLToPath } from 'url';

// Environment variables - consolidated
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// ES Module compatibility: Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Security Headers Configuration
 * Implements OWASP best practices
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
];

/**
 * Image optimization configuration
 * Allows images from trusted CDN sources and local proxy
 */
const imageConfig = {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'blogger.googleusercontent.com',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'via.placeholder.com',
      pathname: '/**',
    },
  ],
  localPatterns: [
    {
      pathname: '/api/image-proxy**',
      search: '**',
    },
    {
      pathname: '/assets/**',
    },
    {
      pathname: '/images/**',
    },
    {
      pathname: '/**',
    },
  ],
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  qualities: [40, 60, 75],
  minimumCacheTTL: 60,
};

/**
 * Main Next.js Configuration
 */
const nextConfig = {
  // Enable React Strict Mode for development best practices
  reactStrictMode: true,

  // Security: Remove X-Powered-By header
  poweredByHeader: false,

  // Enable gzip compression
  compress: true,

  // Explicitly set project root (prevents multi-lockfile warnings)
  outputFileTracingRoot: __dirname,

  // Production optimizations
  productionBrowserSourceMaps: false,
  generateEtags: true,

  // Turbopack configuration for Next.js 16+
  turbopack: {
    // Basic configuration for Turbopack
    // Let Turbopack handle optimizations automatically
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['ioredis', 'redis', 'pg', 'mysql2'],

  // Experimental features
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-tabs',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      'react-phone-number-input',
    ],
    // Server actions configuration
    serverActions: {
      bodySizeLimit: '2mb', // Prevent large payload attacks
    },
  },

  // Custom Webpack configuration for build optimizations
  webpack: (config, { isServer, dev }) => {
    // Exclude server-only packages from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        dns: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        events: false,
      };
    }

    return config;
  },

  // Custom headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/social-banner.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Content-Type',
            value: 'image/jpeg'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS'
          },
        ],
      },
      {
        source: '/:path*\\.(png|jpg|jpeg|gif|webp|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
        ],
      },
      {
        source: '/:path*\\.pdf',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          },
        ],
      },
    ];
  },

  // Proxy CAD engine requests to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/api/cad-engine/:path*',
        destination: `${process.env.CAD_ENGINE_URL || 'http://localhost:5000'}/:path*`,
      },
    ];
  },

  // SEO-friendly redirects for old/incorrect URLs
  async redirects() {
    return [
      // Trailing slash redirects (SEO best practice: consistent URLs)
      {
        source: '/services/',
        destination: '/manufacturing-services',
        permanent: true, // 301
      },
      {
        source: '/about/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contact-us/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/gallery/',
        destination: '/gallery',
        permanent: true,
      },
      {
        source: '/cost-engineering/',
        destination: '/cost-engineering',
        permanent: true,
      },
      {
        source: '/manufacturing-services/',
        destination: '/manufacturing-services',
        permanent: true,
      },
      {
        source: '/contact/',
        destination: '/contact',
        permanent: true,
      },

      // Old service URLs to current pages
      {
        source: '/services',
        destination: '/manufacturing-services',
        permanent: true,
      },
      {
        source: '/platform',
        destination: '/solutions/ai',
        permanent: true,
      },
      {
        source: '/platform/',
        destination: '/solutions/ai',
        permanent: true,
      },
      {
        source: '/cnc-machining-services',
        destination: '/manufacturing-services',
        permanent: true,
      },
      {
        source: '/ai-manufacturing-solutions',
        destination: '/solutions/ai',
        permanent: true,
      },
      {
        source: '/rapid-prototyping-bangalore',
        destination: '/manufacturing-services',
        permanent: true,
      },

      // Language variants redirect to main site (no i18n implemented)
      {
        source: '/es/:path*',
        destination: '/',
        permanent: false, // 302 - temporary until i18n is implemented
      },
      {
        source: '/fr/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/cn/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/kr/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/jp/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/de/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/it/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/us/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },

  // Image optimization
  images: imageConfig,

  // Compiler options - Industry Standard: Zero console logs in production
  compiler: {
    // Remove ALL console statements in production for security and performance
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warning logs
    } : false,
    // Enable SWC minification for better performance
    styledComponents: true,
  },
};

export default nextConfig;