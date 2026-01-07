import dynamic from 'next/dynamic'
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { Footer } from "@/components/Footer"
import { LazyRender } from "@/components/LazyRender"
import { Metadata } from 'next'

// Lazy load below-the-fold components - use LazyRender for deferred client-side rendering
const ServicesShowcase = dynamic(() => import("@/components/ServicesShowcase").then(mod => ({ default: mod.ServicesShowcase })))
const NewsCarousel = dynamic(() => import("@/components/NewsCarousel").then(mod => ({ default: mod.NewsCarousel })))
const AboutSection = dynamic(() => import("@/components/AboutSection").then(mod => ({ default: mod.AboutSection })))
const TechnicalSpecsSection = dynamic(() => import("@/components/TechnicalSpecsSection").then(mod => ({ default: mod.TechnicalSpecsSection })))
const FeaturedTabs = dynamic(() => import("@/components/FeaturedTabs").then(mod => ({ default: mod.FeaturedTabs })))
const FAQSection = dynamic(() => import("@/components/FAQSection").then(mod => ({ default: mod.FAQSection })))

// Enable ISR - Revalidate every hour instead of force-dynamic
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'EMUSKI - ISO Certified Manufacturer in Bangalore | One-Stop Solution for OEM',
  description: 'ISO 9001:2015 certified manufacturers in Bangalore, Karnataka. EMUSKI - Leading manufacturing company delivering world-class OEM manufacturing, precision engineering, CNC machining, injection molding in Electronic City. 15+ years of excellence serving 75+ global clients. Top ISO certified manufacturers in Bangalore for automotive, aerospace, and medical device industries. Contact: +91-86670-88060',
  keywords: [
    'manufacturers in bangalore',
    'manufacturing in bangalore',
    'ISO certified manufacturers bangalore',
    'manufacturing companies in bangalore',
    'top manufacturers in bangalore',
    'top manufacturing companies in bangalore',
    'manufacturers in bangalore list',
    'ISO 9001:2015 certified manufacturers bangalore',
    'OEM manufacturers Bangalore',
    'precision engineering manufacturers Bangalore',
    'manufacturing industries bangalore',
    'CNC machining manufacturers Bangalore',
    'injection molding manufacturers Bangalore',
    'manufacturing solutions Bangalore Karnataka',
    'automotive manufacturers Bangalore',
    'aerospace manufacturers Bangalore',
    'medical device manufacturers Bangalore',
    'Electronic City manufacturers',
    'rapid prototyping manufacturers Bangalore',
    'custom manufacturers Bangalore',
    'wholesale manufacturers bangalore',
    'top 100 manufacturers in bangalore',
    'manufacturers in bangalore with contact details',
    'best manufacturers in bangalore',
    'Industry 4.0 manufacturers Bangalore',
    'smart manufacturing Bangalore',
    'AI-powered manufacturing Bangalore',
  ].join(', '),
  authors: [{ name: 'EMUSKI Team', url: 'https://www.emuski.com/about' }],
  creator: 'EMUSKI Manufacturing Solutions',
  publisher: 'EMUSKI Manufacturing Solutions',

  // Canonical URL for SEO
  alternates: {
    canonical: 'https://www.emuski.com/',
    languages: {
      'en-US': 'https://www.emuski.com/',
    },
  },

  // Advanced robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },

  // Enhanced OpenGraph for social media
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.emuski.com/',
    siteName: 'EMUSKI - ISO Certified Manufacturers in Bangalore',
    title: 'EMUSKI - ISO Certified Manufacturer in Bangalore | One-Stop Solution for OEM',
    description: 'ISO 9001:2015 certified manufacturers in Bangalore, Electronic City. Leading manufacturing company with 15+ years excellence. Serving 75+ global clients across automotive, aerospace, and medical device industries with precision engineering and AI-powered production in Bangalore, Karnataka. Top ISO certified manufacturers.',
    images: [
      {
        url: 'https://www.emuski.com/logo.jpg',
        secureUrl: 'https://www.emuski.com/logo.jpg',
        width: 3375,
        height: 3375,
        alt: 'EMUSKI Manufacturing Solutions - Precision Engineering Excellence',
        type: 'image/jpeg',
      },
    ],
  },

  // Enhanced Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@emuski',
    creator: '@emuski',
    title: 'EMUSKI - ISO Certified Manufacturers in Bangalore',
    description: 'ISO 9001:2015 certified manufacturers in Bangalore, Electronic City, Karnataka. Leading manufacturing company with 15+ years excellence. Precision engineering, CNC machining, AI-powered production. Top manufacturers in Bangalore. Contact: +91-86670-88060',
    images: [
      {
        url: 'https://www.emuski.com/logo.jpg',
        alt: 'EMUSKI Manufacturing Excellence',
        width: 3375,
        height: 3375,
      },
    ],
  },

  // Additional metadata for SEO
  other: {
    'og:locale': 'en_US',
    'og:site_name': 'EMUSKI Manufacturing Solutions',
    'business:contact_data:street_address': '126, RNS Plaza, Electronic City Phase 2',
    'business:contact_data:locality': 'Bangalore',
    'business:contact_data:region': 'Karnataka',
    'business:contact_data:postal_code': '560100',
    'business:contact_data:country_name': 'India',
    'business:contact_data:phone_number': '+91-86670-88060',
    'business:contact_data:email': 'enquiries@emuski.com',
  },
}

export default function Home() {
  // JSON-LD structured data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.emuski.com/#organization',
    name: 'EMUSKI Manufacturing Solutions',
    url: 'https://www.emuski.com',
    logo: 'https://www.emuski.com/logo.jpg',
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
    image: 'https://www.emuski.com/logo.jpg',
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <h1 className="sr-only">
            EMUSKI – OEM Manufacturing, Precision Engineering & AI Solutions in Bangalore, India
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

        <LazyRender minHeight="300px">
          <TechnicalSpecsSection focus="metrics" compact={true} />
        </LazyRender>

        <LazyRender minHeight="400px">
          <FeaturedTabs />
        </LazyRender>

        <LazyRender minHeight="300px">
          <FAQSection compact={true} maxItems={6} usePageSpecific={true} />
        </LazyRender>
      </main>
      <Footer />
    </div>
    </>
  )
}
