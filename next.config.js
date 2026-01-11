/**
 * Next.js Configuration
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 * @type {import('next').NextConfig}
 */

import path from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility: Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables
const isProduction = process.env.NODE_ENV === 'production';

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
    value: 'SAMEORIGIN'
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
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.gstatic.com https://*.googletagmanager.com https://*.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://cdn.mxpnl.com",
      "script-src-elem 'self' 'unsafe-inline' https://*.google.com https://*.gstatic.com https://*.googletagmanager.com https://*.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://cdn.mxpnl.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: https://*.google.com https://*.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net https://*.blogger.com https://*.blogspot.com https://blogger.googleusercontent.com https://images.unsplash.com https://via.placeholder.com",
      "connect-src 'self' https://*.google.com https://www.googleapis.com https://*.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.doubleclick.net https://*.googletagmanager.com https://*.blogger.com https://blogger.googleusercontent.com https://api.mixpanel.com https://api-js.mixpanel.com https://cdn.mxpnl.com https://*.supabase.co",
      "frame-src 'self' https://*.google.com https://*.googletagmanager.com https://td.doubleclick.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

/**
 * Image optimization configuration
 * Allows images from trusted CDN sources only
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
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  qualities: [60, 75],
  minimumCacheTTL: 60,
};

/**
 * Webpack optimization for production builds
 * Implements code splitting and tree shaking
 */
const configureWebpack = (config, { isServer, dev }) => {
  // Production optimizations only
  if (!isServer && !dev) {
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      minimize: true,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Framework chunk (React, React-DOM)
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'framework',
            priority: 40,
            enforce: true,
            reuseExistingChunk: true,
          },
          // UI library chunks
          radixUI: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 35,
            reuseExistingChunk: true,
          },
          // Icon library
          icons: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'icons',
            priority: 30,
            reuseExistingChunk: true,
          },
          // Other vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context?.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return packageName ? `vendor.${packageName.replace('@', '')}` : 'vendor';
            },
            priority: 20,
            reuseExistingChunk: true,
          },
          // CSS optimization
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
            priority: 10,
          },
          // Common code
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      // Enable tree shaking
      usedExports: true,
      sideEffects: true,
    };

    // Skip parsing for known safe modules
    config.module.noParse = /^(react|react-dom|scheduler)$/;
  }

  // Performance budgets
  config.performance = {
    hints: dev ? false : 'warning',
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000,
  };

  return config;
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

  // Custom headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
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
        source: '/precision-engineering/',
        destination: '/precision-engineering',
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
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: isProduction ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Turbopack configuration (Next.js 15+)
  turbopack: {},

  // Webpack configuration
  webpack: (config, options) => {
    // Fix SWC helpers resolution issue in Next.js 16
    config.resolve.alias = {
      ...config.resolve.alias,
      '@swc/helpers/_/_async_to_generator': '@swc/helpers/_async_to_generator',
      '@swc/helpers/_/_call_super': '@swc/helpers/_call_super',
      '@swc/helpers/_/_class_call_check': '@swc/helpers/_class_call_check',
      '@swc/helpers/_/_class_private_field_get': '@swc/helpers/_class_private_field_get',
      '@swc/helpers/_/_class_private_field_init': '@swc/helpers/_class_private_field_init',
      '@swc/helpers/_/_class_private_field_set': '@swc/helpers/_class_private_field_set',
      '@swc/helpers/_/_class_private_method_get': '@swc/helpers/_class_private_method_get',
      '@swc/helpers/_/_class_private_method_init': '@swc/helpers/_class_private_method_init',
      '@swc/helpers/_/_construct': '@swc/helpers/_construct',
      '@swc/helpers/_/_create_class': '@swc/helpers/_create_class',
      '@swc/helpers/_/_define_property': '@swc/helpers/_define_property',
      '@swc/helpers/_/_inherits': '@swc/helpers/_inherits',
      '@swc/helpers/_/_instanceof': '@swc/helpers/_instanceof',
      '@swc/helpers/_/_interop_require_default': '@swc/helpers/_interop_require_default',
      '@swc/helpers/_/_interop_require_wildcard': '@swc/helpers/_interop_require_wildcard',
      '@swc/helpers/_/_object_spread': '@swc/helpers/_object_spread',
      '@swc/helpers/_/_object_spread_props': '@swc/helpers/_object_spread_props',
      '@swc/helpers/_/_object_without_properties': '@swc/helpers/_object_without_properties',
      '@swc/helpers/_/_sliced_to_array': '@swc/helpers/_sliced_to_array',
      '@swc/helpers/_/_to_array': '@swc/helpers/_to_array',
      '@swc/helpers/_/_to_consumable_array': '@swc/helpers/_to_consumable_array',
      '@swc/helpers/_/_ts_generator': '@swc/helpers/_ts_generator',
      '@swc/helpers/_/_type_of': '@swc/helpers/_type_of',
      '@swc/helpers/_/_wrap_native_super': '@swc/helpers/_wrap_native_super',
    };

    return configureWebpack(config, options);
  },

  // Security: Request body size limits
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // Prevent large payload attacks
    },
  },
};

export default nextConfig;