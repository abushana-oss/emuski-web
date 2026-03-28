'use client'

import Image from 'next/image'
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { Footer } from "@/components/Footer"
import { LazyRender } from "@/components/LazyRender"
import { ServicesShowcase } from "@/components/ServicesShowcase"
import { NewsCarousel } from "@/components/NewsCarousel"
import { AboutSection } from "@/components/AboutSection"
import { TechnicalSpecsSection } from "@/components/TechnicalSpecsSection"
import { ContactSection } from "@/components/ContactSection"
import { FAQSection } from "@/components/FAQSection"
import { TestimonialsSection } from "@/components/TestimonialsSection"
import { ManufacturingNPDSection } from "@/components/ManufacturingNPDSection"

// Client component - revalidate not applicable

export default function Home() {

  // JSON-LD structured data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.emuski.com/#organization',
    name: 'EMUSKI Manufacturing Solutions',
    url: 'https://www.emuski.com',
    logo: 'https://www.emuski.com/og-image.png',
    description: 'ISO 9001:2015 certified OEM manufacturing and precision engineering company with 15+ years of excellence in Bangalore, India',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '126, RNS Plaza, Electronic City Phase 2',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560100',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-86670-88060',
      email: 'enquiries@emuski.com',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.linkedin.com/company/emuski',
      'https://twitter.com/emuski',
    ],
    foundingDate: '2008',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '50-100',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Global',
    },
  };

  // JSON-LD structured data for LocalBusiness
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.emuski.com/#localbusiness',
    name: 'EMUSKI Manufacturing Solutions',
    image: 'https://www.emuski.com/og-image.png',
    telephone: '+91-86670-88060',
    email: 'enquiries@emuski.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '126, RNS Plaza, Electronic City Phase 2',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560100',
      addressCountry: 'IN',
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '75',
    },
  };

  // JSON-LD structured data for WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.emuski.com/#website',
    url: 'https://www.emuski.com',
    name: 'EMUSKI Manufacturing Solutions',
    description: 'Premier OEM manufacturing and precision engineering solutions',
    publisher: {
      '@id': 'https://www.emuski.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.emuski.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <h1 className="sr-only">
          EMUSKI – ISO Certified OEM Manufacturing, Precision Engineering & AI Solutions in Bangalore, India | Top Manufacturers Electronic City Karnataka
        </h1>
        <HeroSection />

        <LazyRender minHeight="500px">
          <ServicesShowcase />
        </LazyRender>

        <LazyRender minHeight="300px">
          <NewsCarousel />
        </LazyRender>

        <LazyRender minHeight="400px">
          <AboutSection />
        </LazyRender>

        <LazyRender minHeight="600px">
          {/* Import and use the redesigned NPD component */}
          <ManufacturingNPDSection />
        </LazyRender>

        <LazyRender minHeight="100vh">
          <TestimonialsSection />
        </LazyRender>

        <LazyRender minHeight="300px">
          <TechnicalSpecsSection focus="metrics" compact={true} />
        </LazyRender>

        <LazyRender minHeight="400px">
          <ContactSection />
        </LazyRender>

        <LazyRender minHeight="300px">
          <FAQSection compact={true} maxItems={6} usePageSpecific={true} />
        </LazyRender>
      </main>
      <Footer />
    </div>
  )
}
