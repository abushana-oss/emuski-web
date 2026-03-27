'use client'

import { useState } from 'react'
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

        {/* New Product Development Centre Section */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="npd-centre-heading">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <header className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-xs font-bold text-emuski-teal-darker uppercase tracking-wider" role="doc-subtitle">New Product Development Centre</span>
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
                        className={`relative w-32 h-32 rounded-full overflow-hidden transition-all duration-300 ${selectedSolution === solution.id
                          ? 'ring-4 ring-emuski-teal-darker shadow-2xl scale-105'
                          : 'ring-2 ring-gray-200 group-hover:ring-emuski-teal-darker/50 group-hover:shadow-lg'
                          }`}
                      >
                        <Image
                          src={solution.image}
                          alt={`EMUSKI ${solution.title} - ${solution.subtitle} manufacturing service icon`}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                          loading="lazy"
                          quality={60}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent transition-opacity duration-300 ${selectedSolution === solution.id ? 'opacity-0' : 'opacity-100 group-hover:opacity-50'
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
                        className={`text-sm font-bold transition-colors duration-200 ${selectedSolution === solution.id
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
                className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedSolution !== null ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
                        <Image
                          src={npdSolutions.find(s => s.id === selectedSolution)?.image || ''}
                          alt={`EMUSKI ${npdSolutions.find(s => s.id === selectedSolution)?.title} service icon`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          loading="lazy"
                          quality={60}
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
