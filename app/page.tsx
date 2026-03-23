'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { Footer } from "@/components/Footer"
import { LazyRender } from "@/components/LazyRender"

// Lazy load below-the-fold components - use LazyRender for deferred client-side rendering
const ServicesShowcase = dynamic(() => import("@/components/ServicesShowcase").then(mod => ({ default: mod.ServicesShowcase })))
const NewsCarousel = dynamic(() => import("@/components/NewsCarousel").then(mod => ({ default: mod.NewsCarousel })))
const AboutSection = dynamic(() => import("@/components/AboutSection").then(mod => ({ default: mod.AboutSection })))
const TechnicalSpecsSection = dynamic(() => import("@/components/TechnicalSpecsSection").then(mod => ({ default: mod.TechnicalSpecsSection })))
const FeaturedTabs = dynamic(() => import("@/components/FeaturedTabs").then(mod => ({ default: mod.FeaturedTabs })))
const FAQSection = dynamic(() => import("@/components/FAQSection").then(mod => ({ default: mod.FAQSection })))

// Client component - revalidate not applicable

export default function Home() {
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

  const npdSolutions = [
    {
      id: 1,
      title: "3D Printing",
      subtitle: "SLA, SLS, FDM, MIF - metal",
      description: "EMUSKI's advanced additive manufacturing capabilities include SLA for high-detail prototypes, SLS for functional parts, FDM for concept models, and MIF for metal components. Perfect for rapid prototyping and low-volume production with exceptional precision.",
      image: "/assets/engineeringservices/solution-we-offers/3d-printing-sla-sls-prototypes.svg",
      capabilities: ["High-resolution SLA printing", "Functional SLS parts", "Metal injection molding", "Multi-material capabilities", "24-48 hour turnaround"]
    },
    {
      id: 2,
      title: "VMC",
      subtitle: "VMC Machining",
      description: "EMUSKI's Vertical Machining Centers deliver high-precision components with complex geometries. Our 5-axis VMC capabilities handle aerospace, automotive, and medical applications with tolerances down to ±0.005mm.",
      image: "/assets/engineeringservices/solution-we-offers/cnc-vmc-5-axis-precision-machining-prototypes.svg",
      capabilities: ["5-axis VMC machining", "±0.005mm precision", "Complex geometries", "Multiple materials", "Aerospace certified"]
    },
    {
      id: 3,
      title: "Turning Centre",
      subtitle: "Machining",
      description: "EMUSKI's advanced turning centers provide precision machining for cylindrical components. Specialized in creating high-strength, lightweight parts for demanding applications across industries.",
      image: "/assets/engineeringservices/solution-we-offers/cnc-vmc-aluminum-machining-prototypes.svg",
      capabilities: ["Precision turning", "Multi-axis capabilities", "High-strength materials", "Quality certification", "Rapid production"]
    },
    {
      id: 4,
      title: "Fixture & Tooling",
      subtitle: "Manufacturing",
      description: "EMUSKI designs and manufactures custom fixtures, tooling, and jigs to optimize production processes. Our solutions ensure consistency, reduce setup time, and improve overall manufacturing efficiency.",
      image: "/assets/engineeringservices/solution-we-offers/fixture-tooling-jig-manufacturing.svg",
      capabilities: ["Custom fixture design", "Production optimization", "Quality consistency", "Reduced setup time", "Cost efficiency"]
    },
    {
      id: 5,
      title: "Injection Molding",
      subtitle: "Low-Volume",
      description: "EMUSKI's injection molding services support both prototyping and low-volume production. Advanced molding techniques with various thermoplastics and engineering grades for superior quality components.",
      image: "/assets/engineeringservices/solution-we-offers/injection-molding-low-volume-prototypes.svg",
      capabilities: ["Low to high volume", "Multiple plastic grades", "Mold design", "Quality control", "Cost optimization"]
    },
    {
      id: 6,
      title: "Sheet Metal",
      subtitle: "Prototyping",
      description: "EMUSKI's precision sheet metal fabrication creates custom enclosures, brackets, and components. Combining cutting, forming, and finishing for both functional prototypes and production parts.",
      image: "/assets/engineeringservices/solution-we-offers/sheet-metal-prototypes.svg",
      capabilities: ["Precision cutting", "Custom forming", "Surface finishing", "Assembly services", "Quick turnaround"]
    },
    {
      id: 7,
      title: "Vacuum Casting",
      subtitle: "Plastic Parts",
      description: "EMUSKI's vacuum casting delivers high-quality plastic prototypes with excellent surface finish and detail reproduction. Perfect for design validation and low-volume production runs.",
      image: "/assets/engineeringservices/solution-we-offers/vacuum-casting-plastic-prototypes.svg",
      capabilities: ["High-quality finish", "Design validation", "Low-volume production", "Material flexibility", "Fast turnaround"]
    }
  ];

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
    <>
      <Head>
        <title>EMUSKI | ISO Certified OEM Precision & Cost Engineering Partner</title>
        <meta name="description" content="ISO 9001:2015 certified manufacturers in Bangalore, Karnataka. EMUSKI - Leading manufacturing company delivering world-class OEM manufacturing, precision engineering, CNC machining, injection molding in Electronic City. 15+ years of excellence serving 75+ global clients. Top ISO certified manufacturer in Bangalore for automotive, aerospace, and medical device industries. Contact: +91-86670-88060" />
        <meta name="keywords" content="manufacturers in bangalore, manufacturing in bangalore, ISO certified manufacturers bangalore, manufacturing companies in bangalore, top manufacturers in bangalore, OEM manufacturers Bangalore, precision engineering manufacturers Bangalore, CNC machining manufacturers Bangalore, injection molding manufacturers Bangalore, automotive manufacturers Bangalore, aerospace manufacturers Bangalore, medical device manufacturers Bangalore, Electronic City manufacturers, rapid prototyping manufacturers Bangalore, custom manufacturers Bangalore, AI-powered manufacturing Bangalore, smart manufacturing Bangalore, Industry 4.0 manufacturers Bangalore" />
        
        {/* Enhanced meta tags for home page SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        <meta name="author" content="EMUSKI Manufacturing Solutions" />
        <meta name="publisher" content="EMUSKI Manufacturing Solutions" />
        <meta name="copyright" content="© 2024 EMUSKI Manufacturing Solutions. All rights reserved." />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Bangalore, Karnataka, India" />
        <meta name="geo.position" content="12.9716;77.5946" />
        <meta name="ICBM" content="12.9716, 77.5946" />
        
        {/* Business and contact information */}
        <meta name="contact" content="enquiries@emuski.com" />
        <meta name="phone" content="+91-86670-88060" />
        <meta name="address" content="126, RNS Plaza, Electronic City Phase 2, Bangalore, Karnataka 560100, India" />
        <meta name="company" content="EMUSKI Manufacturing Solutions" />
        <meta name="classification" content="Manufacturing, Engineering Solutions, OEM Manufacturing, Precision Engineering" />
        <meta name="coverage" content="Worldwide" />
        
        {/* Enhanced OpenGraph meta tags */}
        <meta property="og:title" content="EMUSKI | ISO Certified OEM Precision & Cost Engineering Partner" />
        <meta property="og:description" content="ISO 9001:2015 certified manufacturers in Bangalore, Electronic City. Leading manufacturing company with 15+ years excellence. Serving 75+ global clients across automotive, aerospace, and medical device industries with precision engineering and AI-powered production in Bangalore, Karnataka. Top ISO certified manufacturers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.emuski.com/" />
        <meta property="og:site_name" content="EMUSKI" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://www.emuski.com/og-image.png" />
        <meta property="og:image:secure_url" content="https://www.emuski.com/og-image.png" />
        <meta property="og:image:width" content="2000" />
        <meta property="og:image:height" content="1333" />
        <meta property="og:image:alt" content="EMUSKI Manufacturing Solutions - Precision Engineering Excellence" />
        <meta property="og:updated_time" content="2024-03-23T00:00:00+00:00" />
        
        {/* Enhanced Twitter meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@emuski" />
        <meta name="twitter:creator" content="@emuski" />
        <meta name="twitter:title" content="EMUSKI - ISO Certified Manufacturer in Bangalore" />
        <meta name="twitter:description" content="ISO 9001:2015 certified manufacturers in Bangalore, Electronic City, Karnataka. Leading manufacturing company with 15+ years excellence. Precision engineering, CNC machining, AI-powered production. Top manufacturers in Bangalore. Contact: +91-86670-88060" />
        <meta name="twitter:image" content="https://www.emuski.com/og-image.png" />
        <meta name="twitter:image:alt" content="EMUSKI Manufacturing Excellence" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.emuski.com/" />
        
        {/* Alternate language versions */}
        <link rel="alternate" hrefLang="en" href="https://www.emuski.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.emuski.com/" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/assets/hero-background.jpg" as="image" type="image/jpeg" />
        <link rel="prefetch" href="/manufacturing-services" />
        <link rel="prefetch" href="/cost-engineering" />
        <link rel="prefetch" href="/contact" />
      </Head>
      
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
      
      {/* NPD Centre Services Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "EMUSKI NPD Centre Manufacturing Services",
            "description": "Comprehensive New Product Development services including 3D Printing, VMC Machining, Turning Centre, and advanced manufacturing solutions",
            "itemListElement": npdSolutions.map((solution, index) => ({
              "@type": "Service",
              "position": index + 1,
              "name": `EMUSKI ${solution.title}`,
              "description": solution.description,
              "provider": {
                "@type": "Organization",
                "name": "EMUSKI Manufacturing Solutions",
                "url": "https://www.emuski.com"
              },
              "serviceType": solution.subtitle,
              "areaServed": {
                "@type": "Place",
                "name": "Worldwide"
              },
              "availableChannel": {
                "@type": "ServiceChannel",
                "serviceUrl": "https://www.emuski.com/manufacturing-services",
                "servicePhone": "+91-86670-88060"
              }
            }))
          })
        }}
      />
      
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

          {/* NPD Centre Section */}
          <section className="py-12 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="npd-centre-heading">
            <div className="container mx-auto px-4 sm:px-6">
              {/* Section Header */}
              <header className="max-w-3xl mx-auto text-center mb-10">
                <span className="text-xs font-bold text-emuski-teal-darker uppercase tracking-wider" role="doc-subtitle">NPD Centre</span>
                <h2 id="npd-centre-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">EMUSKI NPD Centre - New Product Development Solutions</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We support OEMs in <span className="font-semibold text-gray-900">Medical Devices, Defence, Space Tech, Aerospace, and EV & Automotive</span> through our NPD Center, equipped with in-house <span className="font-semibold text-emuski-teal-darker">VMCs, Turning Centers, Wire EDM, and Centerless Grinders</span>. We also offer <span className="font-semibold text-emuski-teal-darker">3D Printing, Injection Molding, Vacuum Casting, Gravity Die Casting, and Forging</span> — enabling <span className="font-bold text-emuski-teal-darker">complete product development under one roof.</span>
                </p>
              </header>

              {/* Solutions Title */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-8">Manufacturing Solutions We Offer</h3>

              {/* Horizontal Scroll Container */}
              <div className="relative max-w-6xl mx-auto" role="region" aria-label="Manufacturing Solutions">
                <nav className="flex gap-6 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory" role="tablist" aria-label="Manufacturing solutions navigation">
                  {npdSolutions.map((solution) => (
                    <button
                      key={solution.id}
                      onClick={() => setSelectedSolution(selectedSolution === solution.id ? null : solution.id)}
                      className="flex-shrink-0 w-32 snap-center cursor-pointer group bg-transparent border-none"
                      role="tab"
                      aria-selected={selectedSolution === solution.id}
                      aria-controls={`solution-${solution.id}-panel`}
                      id={`solution-${solution.id}-tab`}
                      aria-label={`View details about ${solution.title} - ${solution.subtitle}`}
                    >
                      {/* Circular Image Container */}
                      <div className="relative mb-3">
                        <div
                          className={`relative w-32 h-32 rounded-full overflow-hidden transition-all duration-300 ${
                            selectedSolution === solution.id
                              ? 'ring-4 ring-emuski-teal-darker shadow-2xl scale-105'
                              : 'ring-2 ring-gray-200 group-hover:ring-emuski-teal-darker/50 group-hover:shadow-lg'
                          }`}
                        >
                          <img
                            src={solution.image}
                            alt={`EMUSKI ${solution.title} - ${solution.subtitle} manufacturing service icon`}
                            width="128"
                            height="128"
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent transition-opacity duration-300 ${
                              selectedSolution === solution.id ? 'opacity-0' : 'opacity-100 group-hover:opacity-50'
                            }`}
                          />
                        </div>

                        {/* Selection Indicator */}
                        {selectedSolution === solution.id && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emuski-teal-darker rounded-full animate-pulse" />
                        )}
                      </div>

                      {/* Title */}
                      <div className="text-center">
                        <h4
                          className={`text-sm font-bold transition-colors duration-200 ${
                            selectedSolution === solution.id
                              ? 'text-emuski-teal-darker'
                              : 'text-gray-900 group-hover:text-emuski-teal-darker'
                          }`}
                        >
                          {solution.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{solution.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Description Panel */}
              <div className="max-w-4xl mx-auto mt-8">
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    selectedSolution !== null ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  role="tabpanel"
                  id={selectedSolution ? `solution-${selectedSolution}-panel` : undefined}
                  aria-labelledby={selectedSolution ? `solution-${selectedSolution}-tab` : undefined}
                >
                  {selectedSolution !== null && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                      <div className="flex items-start gap-4">
                        {/* Mini Icon */}
                        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-emuski-teal-darker/20 flex-shrink-0">
                          <img
                            src={npdSolutions.find(s => s.id === selectedSolution)?.image}
                            alt={`EMUSKI ${npdSolutions.find(s => s.id === selectedSolution)?.title} service icon`}
                            width="64"
                            height="64"
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            EMUSKI {npdSolutions.find(s => s.id === selectedSolution)?.title}
                          </h4>
                          <p className="text-xs text-emuski-teal-darker font-semibold mb-2 uppercase tracking-wide">
                            {npdSolutions.find(s => s.id === selectedSolution)?.subtitle}
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {npdSolutions.find(s => s.id === selectedSolution)?.description}
                          </p>
                          
                          {/* Capabilities */}
                          <div>
                            <h5 className="text-xs font-semibold text-gray-800 mb-2">Key Capabilities:</h5>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              {npdSolutions.find(s => s.id === selectedSolution)?.capabilities.map((capability, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-emuski-teal-darker rounded-full mr-2 flex-shrink-0"></div>
                                  {capability}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hint Text */}
                {selectedSolution === null && (
                  <p className="text-center text-xs text-gray-400 mt-4 animate-pulse">
                    Click on any solution to learn more
                  </p>
                )}
              </div>
            </div>

            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </section>

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
