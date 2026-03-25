/**
 * Enterprise SEO Configuration for EMUSKI Manufacturing Solutions
 * Optimized for manufacturing industry keywords and global markets
 */

import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    type?: 'website' | 'article' | 'product' | 'profile'
  }
  twitter?: {
    title?: string
    description?: string
    image?: string
  }
  structuredData?: Record<string, any>
  robots?: {
    index?: boolean
    follow?: boolean
    googleBot?: {
      index?: boolean
      follow?: boolean
      'max-video-preview'?: number
      'max-image-preview'?: 'none' | 'standard' | 'large'
      'max-snippet'?: number
    }
  }
}

// Core business keywords for manufacturing industry
export const CORE_KEYWORDS = {
  primary: [
    'OEM manufacturing',
    'precision engineering',
    'manufacturing solutions',
    'CNC machining',
    'rapid prototyping',
    'injection molding',
    'sheet metal fabrication',
    'cost engineering',
    'VAVE methodology',
    'manufacturing Bangalore',
    'ISO certified manufacturing'
  ],
  location: [
    'manufacturing Bangalore',
    'precision engineering Bangalore',
    'OEM manufacturing India',
    'manufacturing Electronic City',
    'engineering services Bangalore',
    'manufacturing Karnataka',
    'precision machining Bangalore'
  ],
  industry: [
    'automotive manufacturing',
    'aerospace manufacturing',
    'medical device manufacturing',
    'electronics manufacturing',
    'defense manufacturing',
    'industrial manufacturing'
  ],
  services: [
    'design for manufacturing',
    'rapid prototyping services',
    'CNC machining services',
    'injection molding services',
    'sheet metal services',
    'quality assurance manufacturing',
    'manufacturing consulting',
    'production optimization'
  ],
  technology: [
    'AI manufacturing',
    'smart manufacturing',
    'Industry 4.0',
    'manufacturing automation',
    'CAD CAM services',
    'manufacturing simulation',
    'predictive maintenance'
  ]
}

// Default metadata base
export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL('https://www.emuski.com'),
  title: {
    default: 'EMUSKI - Leading OEM Manufacturing & Precision Engineering Solutions | Bangalore, India',
    template: '%s | EMUSKI Manufacturing Solutions'
  },
  description: 'EMUSKI delivers world-class OEM manufacturing, precision engineering, and AI-powered production solutions in Bangalore, India. ISO 9001:2015 certified with 15+ years expertise serving automotive, aerospace, medical device, and electronics industries globally.',
  keywords: [
    ...CORE_KEYWORDS.primary,
    ...CORE_KEYWORDS.location,
    ...CORE_KEYWORDS.services
  ],
  authors: [{ name: 'EMUSKI Manufacturing Solutions', url: 'https://www.emuski.com' }],
  creator: 'EMUSKI Manufacturing Solutions',
  publisher: 'EMUSKI Manufacturing Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.emuski.com',
    siteName: 'EMUSKI Manufacturing Solutions',
    title: 'EMUSKI - Leading OEM Manufacturing & Precision Engineering | Bangalore, India',
    description: 'World-class OEM manufacturing, precision engineering, and AI-powered production solutions. ISO 9001:2015 certified manufacturing partner in Bangalore, India.',
    images: [
      {
        url: '/social-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'EMUSKI - ISO Certified OEM Manufacturing & Precision Engineering Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@emuski',
    creator: '@emuski',
    title: 'EMUSKI - Leading OEM Manufacturing & Precision Engineering',
    description: 'ISO 9001:2015 certified manufacturing solutions in Bangalore, India. Serving automotive, aerospace, medical device, and electronics industries.',
    images: ['/social-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.emuski.com',
  },
  category: 'Manufacturing',
  classification: 'Manufacturing and Engineering Solutions',
}

// Page-specific SEO configurations
export const PAGE_SEO: Record<string, SEOConfig> = {
  home: {
    title: 'EMUSKI - Leading OEM Manufacturing & Precision Engineering Solutions | Bangalore, India',
    description: 'EMUSKI delivers world-class OEM manufacturing, precision engineering, and AI-powered production solutions in Bangalore, India. ISO 9001:2015 certified with 15+ years expertise serving automotive, aerospace, medical device, and electronics industries globally.',
    keywords: [...CORE_KEYWORDS.primary, ...CORE_KEYWORDS.location],
    canonical: 'https://www.emuski.com',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness'],
      '@id': 'https://www.emuski.com/#organization',
      name: 'EMUSKI Manufacturing Solutions',
      legalName: 'EMUSKI Manufacturing Solutions Private Limited',
      url: 'https://www.emuski.com',
      logo: 'https://www.emuski.com/og-image.png',
      description: 'Leading OEM manufacturing and precision engineering solutions provider in Bangalore, India',
      foundingDate: '2008',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '126, RNS Plaza, Electronic City Phase 2',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        postalCode: '560100',
        addressCountry: 'IN'
      },
      telephone: '+91-86670-88060',
      email: 'enquiries@emuski.com'
    }
  },
  
  manufacturingServices: {
    title: 'OEM Manufacturing Services - CNC Machining, Injection Molding | EMUSKI Bangalore',
    description: 'Comprehensive OEM manufacturing services including CNC machining, injection molding, sheet metal fabrication, and rapid prototyping. ISO certified manufacturing solutions in Bangalore for automotive, aerospace, and medical device industries.',
    keywords: [
      'OEM manufacturing services',
      'CNC machining Bangalore',
      'injection molding services',
      'sheet metal fabrication',
      'rapid prototyping Bangalore',
      'precision manufacturing India',
      'automotive manufacturing services',
      'aerospace manufacturing'
    ],
    canonical: 'https://www.emuski.com/manufacturing-services',
    openGraph: {
      title: 'OEM Manufacturing Services - CNC Machining, Injection Molding | EMUSKI',
      description: 'Comprehensive OEM manufacturing services in Bangalore. ISO certified CNC machining, injection molding, and rapid prototyping for global industries.',
      type: 'website'
    }
  },

  costEngineering: {
    title: 'Cost Engineering & VAVE Services - Manufacturing Cost Optimization | EMUSKI',
    description: 'Expert cost engineering and VAVE (Value Analysis Value Engineering) services to optimize manufacturing costs, improve design efficiency, and reduce production expenses while maintaining quality standards.',
    keywords: [
      'cost engineering services',
      'VAVE methodology',
      'manufacturing cost optimization',
      'value engineering',
      'design cost reduction',
      'production cost analysis',
      'cost optimization Bangalore',
      'manufacturing consulting'
    ],
    canonical: 'https://www.emuski.com/cost-engineering',
    openGraph: {
      title: 'Cost Engineering & VAVE Services - Manufacturing Cost Optimization',
      description: 'Expert VAVE and cost engineering services to optimize manufacturing costs and improve design efficiency.',
      type: 'website'
    }
  },

  aiSolutions: {
    title: 'AI-Powered Manufacturing Solutions - Smart Production Systems | EMUSKI',
    description: 'Revolutionary AI-powered manufacturing solutions including predictive maintenance, quality control automation, production optimization, and smart factory implementation for Industry 4.0 transformation.',
    keywords: [
      'AI manufacturing solutions',
      'smart manufacturing',
      'Industry 4.0',
      'manufacturing automation',
      'predictive maintenance',
      'AI quality control',
      'smart factory',
      'manufacturing AI Bangalore'
    ],
    canonical: 'https://www.emuski.com/solutions/ai',
    openGraph: {
      title: 'AI-Powered Manufacturing Solutions - Smart Production Systems',
      description: 'Revolutionary AI manufacturing solutions for Industry 4.0 transformation and smart production optimization.',
      type: 'website'
    }
  },

  contact: {
    title: 'Contact EMUSKI - Get Manufacturing Quote | Bangalore, India',
    description: 'Contact EMUSKI for manufacturing quotes and engineering consultations. Located in Electronic City, Bangalore. Call +91-86670-88060 or email enquiries@emuski.com for OEM manufacturing services.',
    keywords: [
      'contact EMUSKI',
      'manufacturing quote',
      'engineering consultation',
      'EMUSKI Bangalore contact',
      'manufacturing services inquiry',
      'precision engineering quote'
    ],
    canonical: 'https://www.emuski.com/contact',
    openGraph: {
      title: 'Contact EMUSKI - Get Manufacturing Quote | Bangalore, India',
      description: 'Get in touch for manufacturing quotes and engineering consultations. Located in Electronic City, Bangalore.',
      type: 'website'
    }
  },

  blog: {
    title: 'Manufacturing Industry Blog - Engineering Insights | EMUSKI',
    description: 'Latest insights on manufacturing technologies, precision engineering, Industry 4.0, cost optimization strategies, and manufacturing best practices from EMUSKI experts.',
    keywords: [
      'manufacturing blog',
      'engineering insights',
      'manufacturing technology',
      'precision engineering blog',
      'Industry 4.0 insights',
      'manufacturing best practices'
    ],
    canonical: 'https://www.emuski.com/blog',
    openGraph: {
      title: 'Manufacturing Industry Blog - Engineering Insights | EMUSKI',
      description: 'Expert insights on manufacturing technologies, precision engineering, and Industry 4.0 from EMUSKI professionals.',
      type: 'website'
    }
  }
}

/**
 * Generate comprehensive metadata for a page
 */
export function generateMetadata(pageKey: keyof typeof PAGE_SEO, customData?: Partial<SEOConfig>): Metadata {
  const config = PAGE_SEO[pageKey]
  const merged = { ...config, ...customData }

  return {
    title: merged.title,
    description: merged.description,
    keywords: merged.keywords,
    openGraph: {
      ...DEFAULT_METADATA.openGraph,
      title: merged.openGraph?.title || merged.title,
      description: merged.openGraph?.description || merged.description,
      url: merged.canonical,
      ...merged.openGraph,
    },
    twitter: {
      ...DEFAULT_METADATA.twitter,
      title: merged.twitter?.title || merged.title,
      description: merged.twitter?.description || merged.description,
      ...merged.twitter,
    },
    robots: merged.robots || DEFAULT_METADATA.robots,
    alternates: {
      canonical: merged.canonical,
    },
    other: {
      'geo.region': 'IN-KA',
      'geo.placename': 'Bangalore, Karnataka, India',
      'geo.position': '12.9716;77.5946',
      'ICBM': '12.9716, 77.5946',
    }
  }
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(type: string, data: Record<string, any>) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  return JSON.stringify(baseData)
}

/**
 * Organization schema for all pages
 */
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  '@id': 'https://www.emuski.com/#organization',
  name: 'EMUSKI Manufacturing Solutions',
  legalName: 'EMUSKI Manufacturing Solutions Private Limited',
  url: 'https://www.emuski.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.emuski.com/og-image.png',
    width: 2000,
    height: 1333
  },
  description: 'Leading OEM manufacturing and precision engineering solutions provider in Bangalore, India. ISO 9001:2015 certified with 15+ years expertise.',
  foundingDate: '2008',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '126, RNS Plaza, Electronic City Phase 2',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    postalCode: '560100',
    addressCountry: 'IN'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-86670-88060',
      contactType: 'Customer Service',
      email: 'enquiries@emuski.com',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'Worldwide'
    }
  ],
  sameAs: [
    'https://www.linkedin.com/company/emuski',
    'https://twitter.com/emuski'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '75',
    bestRating: '5'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Manufacturing Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'OEM Manufacturing',
          description: 'Custom OEM manufacturing solutions for automotive, aerospace, and electronics industries'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Precision Engineering',
          description: 'High-precision CNC machining and engineering services'
        }
      }
    ]
  }
}