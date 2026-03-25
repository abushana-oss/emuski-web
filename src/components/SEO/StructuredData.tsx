/**
 * Comprehensive Structured Data Component
 * Implements all major Schema.org types for manufacturing industry SEO
 */

import React from 'react'

interface StructuredDataProps {
  data: Record<string, any>
  type?: 'Organization' | 'LocalBusiness' | 'Product' | 'Service' | 'Article' | 'WebSite' | 'BreadcrumbList'
}

export function StructuredData({ data, type }: StructuredDataProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type || data['@type'] || 'Thing',
    ...data
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  )
}

// Pre-configured schemas for common use cases
export const STRUCTURED_DATA_TEMPLATES = {
  // Main organization schema
  organization: {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': 'https://www.emuski.com/#organization',
    name: 'EMUSKI Manufacturing Solutions',
    legalName: 'EMUSKI Manufacturing Solutions Private Limited',
    alternateName: 'EMUSKI Manufacturing',
    url: 'https://www.emuski.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.emuski.com/og-image.png',
      width: 2000,
      height: 1333,
      caption: 'EMUSKI Manufacturing Solutions Logo'
    },
    image: 'https://www.emuski.com/og-image.png',
    description: 'Leading OEM manufacturing and precision engineering solutions provider in Bangalore, India. ISO 9001:2015 certified with 15+ years expertise serving automotive, aerospace, medical device, and electronics industries globally.',
    foundingDate: '2008',
    slogan: 'Your One-Stop Solution for OEM Excellence',
    priceRange: '$$',\n    telephone: '+91-86670-88060',\n    email: 'enquiries@emuski.com',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-86670-88060',
        contactType: 'Customer Service',
        email: 'enquiries@emuski.com',
        availableLanguage: ['English', 'Hindi'],
        areaServed: ['IN', 'Global'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        }
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91-86670-88060',
        contactType: 'Sales',
        email: 'enquiries@emuski.com',
        availableLanguage: 'English',
        areaServed: 'Worldwide'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '126, RNS Plaza, KIADB Industrial Area, Electronic City Phase 2',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560100',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '12.9716',
      longitude: '77.5946'
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'India'
      },
      {
        '@type': 'Place',
        name: 'Global'
      }
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '12.9716',
        longitude: '77.5946'
      },
      geoRadius: '50000'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Manufacturing Services Catalog',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.emuski.com/manufacturing-services#oem-manufacturing',
            name: 'OEM Manufacturing',
            description: 'Custom OEM manufacturing solutions for automotive, aerospace, medical devices, and electronics industries',
            category: 'Manufacturing Services',
            provider: {
              '@id': 'https://www.emuski.com/#organization'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.emuski.com/manufacturing-services#precision-engineering',
            name: 'Precision Engineering',
            description: 'High-precision CNC machining, turning, and engineering services with tight tolerances',
            category: 'Engineering Services',
            provider: {
              '@id': 'https://www.emuski.com/#organization'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.emuski.com/manufacturing-services#rapid-prototyping',
            name: 'Rapid Prototyping',
            description: 'Fast prototyping services including 3D printing, CNC machining, and vacuum casting',
            category: 'Prototyping Services',
            provider: {
              '@id': 'https://www.emuski.com/#organization'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.emuski.com/cost-engineering#vave-services',
            name: 'Cost Engineering & VAVE',
            description: 'Value Analysis Value Engineering for cost optimization and design improvement',
            category: 'Engineering Consulting',
            provider: {
              '@id': 'https://www.emuski.com/#organization'
            }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.emuski.com/solutions/ai#ai-manufacturing',
            name: 'AI Manufacturing Solutions',
            description: 'AI-powered manufacturing optimization, predictive maintenance, and quality control',
            category: 'Technology Solutions',
            provider: {
              '@id': 'https://www.emuski.com/#organization'
            }
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '75',
      bestRating: '5',
      worstRating: '1'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00'
      }
    ],
    knowsAbout: [
      'OEM Manufacturing',
      'Precision Engineering',
      'CNC Machining',
      'Rapid Prototyping',
      'Injection Molding',
      'Sheet Metal Fabrication',
      'Cost Engineering',
      'VAVE Methodology',
      'Quality Assurance',
      'Supply Chain Management',
      'AI Manufacturing',
      'Design for Manufacturing',
      'Automotive Manufacturing',
      'Aerospace Manufacturing',
      'Medical Device Manufacturing',
      'Electronics Manufacturing'
    ],
    sameAs: [
      'https://www.linkedin.com/company/emuski',
      'https://twitter.com/emuski'
    ],
    memberOf: [
      {
        '@type': 'Organization',
        name: 'ISO 9001:2015 Certified',
        description: 'Quality Management System Certification'
      },
      {
        '@type': 'Organization',
        name: 'ISO 14001:2015 Certified',
        description: 'Environmental Management System Certification'
      },
      {
        '@type': 'Organization',
        name: 'ISO 45001:2018 Certified',
        description: 'Occupational Health & Safety Management System Certification'
      }
    ]
  },

  // Website schema
  website: {
    '@type': 'WebSite',
    '@id': 'https://www.emuski.com/#website',
    url: 'https://www.emuski.com',
    name: 'EMUSKI Manufacturing Solutions',
    description: 'Leading OEM manufacturing and precision engineering solutions provider',
    publisher: {
      '@id': 'https://www.emuski.com/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.emuski.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@id': 'https://www.emuski.com/#organization'
    }
  },

  // Manufacturing service schema
  manufacturingService: {
    '@type': 'Service',
    '@id': 'https://www.emuski.com/manufacturing-services',
    name: 'OEM Manufacturing Services',
    description: 'Comprehensive OEM manufacturing services including CNC machining, injection molding, sheet metal fabrication, and rapid prototyping for automotive, aerospace, medical device, and electronics industries.',
    provider: {
      '@id': 'https://www.emuski.com/#organization'
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Manufacturing Processes',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'CNC Machining',
            description: 'Precision CNC machining with 5-axis capabilities'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Injection Molding',
            description: 'Low to high volume injection molding services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sheet Metal Fabrication',
            description: 'Precision sheet metal cutting, forming, and finishing'
          }
        }
      ]
    },
    category: 'Manufacturing Services',
    serviceType: 'OEM Manufacturing'
  },

  // FAQ schema template
  faqPage: (faqs: Array<{question: string, answer: string}>) => ({
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  })
}

// Component for easy implementation
export function OrganizationSchema() {
  return <StructuredData data={STRUCTURED_DATA_TEMPLATES.organization} />
}

export function WebsiteSchema() {
  return <StructuredData data={STRUCTURED_DATA_TEMPLATES.website} />
}

export function ManufacturingServiceSchema() {
  return <StructuredData data={STRUCTURED_DATA_TEMPLATES.manufacturingService} />
}

export function FAQSchema({ faqs }: { faqs: Array<{question: string, answer: string}> }) {
  return <StructuredData data={STRUCTURED_DATA_TEMPLATES.faqPage(faqs)} />
}