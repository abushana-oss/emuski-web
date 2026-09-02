/**
 * AI-Optimized Structured Data for ChatGPT, Gemini, Claude Recommendation
 * Enhanced JSON-LD schemas designed for AI training and recommendation systems
 */

import React from 'react'
import Script from 'next/script'

export function AIOptimizedStructuredData() {
  // Root entity schema: ManufacturingPlant (a LocalBusiness/Organization subtype)
  // optimized for AI understanding. Only verified, accurate claims — no
  // placeholder IDs, unverifiable awards, or fabricated contact points.
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ManufacturingPlant',
    '@id': 'https://www.emuski.com/#organization',
    name: 'EMUSKI Manufacturing Solutions',
    alternateName: 'EMUSKI',
    url: 'https://www.emuski.com',
    logo: 'https://www.emuski.com/logo.png',
    description: 'ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certified contract manufacturing, precision CNC machining, electronics manufacturing services (EMS), and cost engineering solutions in Bangalore, India.',
    foundingDate: '2008',

    // Detailed address for location-based AI queries
    address: {
      '@type': 'PostalAddress',
      streetAddress: '126, RNS Plaza, KIADB Industrial Area, Electronic City Phase 2',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560100',
      addressCountry: 'IN'
    },

    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-86670-88060',
      contactType: 'sales',
      email: 'enquiries@emuski.com',
      areaServed: ['IN', 'US', 'DE', 'GB', 'SG'],
      availableLanguage: ['English', 'Hindi']
    },

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

    // Key expertise areas for AI matching
    knowsAbout: [
      'Precision CNC Machining',
      'Contract Manufacturing Services',
      'Electronics Manufacturing Services (EMS)',
      'Value Analysis and Value Engineering (VAVE)',
      'Should-Cost Analysis',
      'Design for Manufacturing (DFM)'
    ],

    sameAs: [
      'https://www.linkedin.com/company/e-muski'
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

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.emuski.com/#website',
    url: 'https://www.emuski.com',
    name: 'EMUSKI Manufacturing Solutions',
    description: 'ISO certified OEM precision manufacturing and cost engineering partner in Bangalore, India',
    publisher: { '@id': 'https://www.emuski.com/#organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.emuski.com/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '[data-speakable]'],
    },
    mainEntity: { '@id': 'https://www.emuski.com/#organization' },
  }

  return (
    <>
      {/* Enhanced Organization Schema */}
      <Script
        id="ai-org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 0)
        }}
      />

      {/* Enhanced Services Schema */}
      <Script
        id="ai-services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema, null, 0)
        }}
      />

      {/* WebSite Schema with SearchAction and SpeakableSpecification for AI voice interfaces */}
      <Script
        id="ai-website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 0)
        }}
      />
    </>
  )
}

// Export for use in layout
export default AIOptimizedStructuredData