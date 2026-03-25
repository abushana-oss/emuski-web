/**
 * Advanced SEO Head Component
 * Optimizes Core Web Vitals and search engine visibility
 */

import Head from 'next/head'
import React from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  keywords?: string[]
  structuredData?: Record<string, any>
  preloadImages?: string[]
  preloadFonts?: string[]
  prefetchDNS?: string[]
  noIndex?: boolean
}

export function SEOHead({
  title,
  description,
  canonical,
  keywords = [],
  structuredData,
  preloadImages = [],
  preloadFonts = [],
  prefetchDNS = [],
  noIndex = false
}: SEOHeadProps) {
  const defaultPrefetchDNS = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com'
  ]

  const allPrefetchDNS = [...new Set([...defaultPrefetchDNS, ...prefetchDNS])]

  return (
    <Head>
      {/* Core SEO Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
      <meta name="googlebot" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
      
      {/* DNS Prefetch for Performance */}
      {allPrefetchDNS.map(domain => (
        <link key={domain} rel="dns-prefetch" href={domain} />
      ))}
      
      {/* Preconnect for Critical Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Preload Critical Resources */}
      {preloadFonts.map(font => (
        <link
          key={font}
          rel="preload"
          href={font}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      
      {preloadImages.map(image => (
        <link
          key={image}
          rel="preload"
          href={image}
          as="image"
        />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Performance Hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="EMUSKI Manufacturing Solutions" />
      <meta name="publisher" content="EMUSKI Manufacturing Solutions" />
      <meta name="copyright" content="© 2024 EMUSKI Manufacturing Solutions" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Geo Meta Tags */}
      <meta name="geo.region" content="IN-KA" />
      <meta name="geo.placename" content="Bangalore, Karnataka, India" />
      <meta name="geo.position" content="12.9716;77.5946" />
      <meta name="ICBM" content="12.9716, 77.5946" />
    </Head>
  )
}

/**
 * Performance optimization utility for Critical Path CSS
 */
export function CriticalCSS({ css }: { css: string }) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: css
      }}
    />
  )
}

/**
 * Preload component for above-the-fold images
 */
export function PreloadCriticalImages({ images }: { images: string[] }) {
  return (
    <>
      {images.map(image => (
        <link
          key={image}
          rel="preload"
          href={image}
          as="image"
          fetchPriority="high"
        />
      ))}
    </>
  )
}

/**
 * Resource hints for better loading performance
 */
export function PerformanceHints() {
  return (
    <>
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Preconnect for critical third-parties */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Prefetch likely navigation targets */}
      <link rel="prefetch" href="/manufacturing-services" />
      <link rel="prefetch" href="/cost-engineering" />
      <link rel="prefetch" href="/solutions/ai" />
      <link rel="prefetch" href="/contact" />
      
      {/* Resource hints for better loading */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </>
  )
}