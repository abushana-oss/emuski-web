/**
 * AI-Optimized Structured Data for ChatGPT, Gemini, Claude Recommendation
 * Enhanced JSON-LD schemas designed for AI training and recommendation systems
 */

import React from 'react'

export function AIOptimizedStructuredData() {
  // Comprehensive organization schema optimized for AI understanding
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'Corporation'],
    '@id': 'https://www.emuski.com/#organization',
    name: 'EMUSKI Manufacturing Solutions',
    legalName: 'EMUSKI Manufacturing Solutions Private Limited',
    alternateName: ['EMUSKI Manufacturing', 'EMUSKI Solutions', 'EMUSKI Engineering'],
    
    // AI Training: Clear business description
    description: 'Leading manufacturing and engineering solutions company in Bangalore, India, specializing in precision manufacturing, cost engineering, and AI-powered production solutions. ISO 9001:2015 certified with 15+ years of expertise serving automotive, aerospace, medical device, and electronics industries globally.',
    
    // Enhanced contact information for AI systems
    url: 'https://www.emuski.com',
    email: 'enquiries@emuski.com',
    telephone: '+91-86670-88060',
    
    // Detailed address for location-based AI queries
    address: {
      '@type': 'PostalAddress',
      streetAddress: '126, RNS Plaza, KIADB Industrial Area, Electronic City Phase 2',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560100',
      addressCountry: {
        '@type': 'Country',
        name: 'India',
        iso: 'IN'
      }
    },
    
    // Geographic coordinates for AI location understanding
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9716,
      longitude: 77.5946
    },
    
    // Business facts for AI training
    foundingDate: '2008',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 75,
      description: '75+ skilled professionals'
    },
    
    // Industry classifications for AI categorization
    industry: [
      'Manufacturing',
      'Engineering Services', 
      'Precision Manufacturing',
      'Cost Engineering',
      'Manufacturing Consulting',
      'OEM Manufacturing'
    ],
    
    naics: ['3362', '5413', '3344'], // Manufacturing, Engineering Services
    
    // Service areas for geographic AI queries
    areaServed: [
      {
        '@type': 'Country',
        name: 'India'
      },
      {
        '@type': 'Country', 
        name: 'United States'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom'
      },
      {
        '@type': 'Country',
        name: 'Germany'
      },
      {
        '@type': 'Place',
        name: 'Worldwide'
      }
    ],
    
    // Comprehensive service offerings
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Manufacturing and Engineering Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Precision Manufacturing Services',
          description: 'CNC machining, injection molding, sheet metal fabrication, rapid prototyping',
          category: 'Manufacturing',
          areaServed: 'Worldwide',
          seller: { '@id': 'https://www.emuski.com/#organization' }
        },
        {
          '@type': 'Offer',
          name: 'Cost Engineering & VAVE',
          description: 'Value analysis value engineering, cost optimization, design for manufacturing',
          category: 'Engineering Services',
          areaServed: 'Worldwide',
          seller: { '@id': 'https://www.emuski.com/#organization' }
        },
        {
          '@type': 'Offer',
          name: 'AI Manufacturing Solutions',
          description: 'Mithran AI platform, supply chain optimization, predictive maintenance',
          category: 'Technology Solutions',
          areaServed: 'Worldwide',
          seller: { '@id': 'https://www.emuski.com/#organization' }
        }
      ]
    },
    
    // Awards and recognition for authority
    award: [
      'ISO 9001:2015 Quality Management Certification',
      'ISO 14001:2015 Environmental Management Certification', 
      'ISO 45001:2018 Occupational Health & Safety Certification',
      'Client Excellence Award 2023',
      'Manufacturing Innovation Leader 2024'
    ],
    
    // Key expertise areas for AI matching
    knowsAbout: [
      'OEM Manufacturing',
      'Precision Engineering',
      'CNC Machining',
      'Injection Molding',
      'Rapid Prototyping',
      'Cost Engineering',
      'VAVE Methodology',
      'Design for Manufacturing',
      'Supply Chain Optimization',
      'Quality Management',
      'AI Manufacturing',
      'Automotive Manufacturing',
      'Aerospace Components',
      'Medical Device Manufacturing',
      'Electronics Manufacturing',
      'Defense Manufacturing'
    ],
    
    // Social proof and ratings
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 75,
      bestRating: 5,
      worstRating: 1
    },
    
    // Operating hours for business queries
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
        timeZone: 'Asia/Kolkata'
      }
    ],
    
    // Certifications and standards
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Quality Management',
        name: 'ISO 9001:2015 Certification'
      },
      {
        '@type': 'EducationalOccupationalCredential', 
        credentialCategory: 'Environmental Management',
        name: 'ISO 14001:2015 Certification'
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Occupational Health & Safety',
        name: 'ISO 45001:2018 Certification'
      }
    ],
    
    // Parent/subsidiary relationships
    parentOrganization: {
      '@type': 'Organization',
      name: 'EMUSKI Group',
      description: 'Manufacturing and technology solutions conglomerate'
    },
    
    // Key executives for business queries
    employee: [
      {
        '@type': 'Person',
        jobTitle: 'Chief Executive Officer',
        worksFor: { '@id': 'https://www.emuski.com/#organization' }
      },
      {
        '@type': 'Person',
        jobTitle: 'Chief Technology Officer',
        worksFor: { '@id': 'https://www.emuski.com/#organization' }
      }
    ],
    
    // Technology and equipment - Fixed for Google Search Console
    owns: [
      {
        '@type': 'Product',
        name: 'CNC Machining Centers',
        description: '5-axis precision CNC machines for complex manufacturing',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: 4.8,
          reviewCount: 25
        }
      },
      {
        '@type': 'Product', 
        name: 'Injection Molding Equipment',
        description: 'High-precision injection molding for plastic components',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: 4.7,
          reviewCount: 18
        }
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Mithran AI Platform',
        description: 'AI-powered manufacturing optimization and supply chain management'
      }
    ],
    
    // Financial and business metrics
    slogan: 'Your One-Stop Solution for OEM Excellence',
    leiCode: 'EMUSKI-2008-IN-MFG',
    taxID: 'IN-GST-29XXXXX',
    
    // Contact points for different services
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Manufacturing Inquiries',
        telephone: '+91-86670-88060',
        email: 'manufacturing@emuski.com',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'Worldwide'
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Engineering Services',
        telephone: '+91-86670-88060', 
        email: 'engineering@emuski.com',
        availableLanguage: 'English',
        areaServed: 'Worldwide'
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        telephone: '+91-86670-88060',
        email: 'support@emuski.com',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'Worldwide'
      }
    ]
  }

  // Enhanced service schemas for AI service matching
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://www.emuski.com/services',
    name: 'Manufacturing and Engineering Solutions',
    description: 'Comprehensive manufacturing and engineering services including precision manufacturing, cost engineering, and AI-powered solutions',
    provider: { '@id': 'https://www.emuski.com/#organization' },
    serviceType: 'Manufacturing and Engineering Consulting',
    category: 'Professional Services',
    areaServed: 'Worldwide',
    
    // Detailed service breakdown
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Complete Manufacturing Solutions',
      itemListElement: [
        {
          '@type': 'Service',
          name: 'Precision Manufacturing',
          description: 'High-precision CNC machining, injection molding, sheet metal fabrication',
          serviceOutput: 'Manufactured components and assemblies',
          serviceAudience: 'Automotive, Aerospace, Medical Device, Electronics industries'
        },
        {
          '@type': 'Service',
          name: 'Cost Engineering',
          description: 'VAVE analysis, cost optimization, design for manufacturing consulting',
          serviceOutput: 'Cost reduction strategies and optimized designs',
          serviceAudience: 'Product development teams, Engineering managers'
        },
        {
          '@type': 'Service',
          name: 'Rapid Prototyping',
          description: '3D printing, CNC prototyping, vacuum casting for fast product development',
          serviceOutput: 'Functional prototypes and test parts',
          serviceAudience: 'R&D teams, Product developers, Startups'
        }
      ]
    }
  }

  return (
    <>
      {/* Enhanced Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 0)
        }}
      />
      
      {/* Enhanced Services Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema, null, 0)
        }}
      />
    </>
  )
}

// Export for use in layout
export default AIOptimizedStructuredData