import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import {
  Hero,
  Bluf,
  Capabilities,
  CapabilitiesTable,
  ElectronicsManufacturing,
  Products,
  CaseStudies,
  Engineering,
  VaveTeardown,
  Industries,
  Quality,
  SourcingComparison,
  GlobalSourcing,
  Engagement,
  FAQ,
  faqData,
  FinalCTA,
  StickyCTA,
} from "@/components/manufacturing"

export const metadata: Metadata = {
  title: 'Precision Manufacturing Services & Contract Engineering | EMUSKI',
  description: 'ISO 9001:2015 certified contract manufacturing services in Bangalore. Precision CNC machining (±0.005mm), sheet metal, EMS, and AI cost optimization for OEMs.',
  keywords: 'global manufacturing, manufacturing services, precision manufacturing, OEM manufacturing, manufacturing in India, contract manufacturing, product engineering, DFM, cost engineering, VAVE, strategic sourcing, CNC machining, injection molding, sheet metal fabrication',
  openGraph: {
    title: 'Global Manufacturing & Engineering Partner | EMUSKI',
    description: 'Precision manufacturing from India, engineered and costed before it\'s built. CNC machining, injection molding, sheet metal, and assemblies. ISO 9001:2015 certified.',
    type: 'website',
    url: 'https://www.emuski.com/manufacturing-services',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://www.emuski.com/manufacturing-services',
  },
  robots: { index: true, follow: true },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Precision Contract Manufacturing Services",
  "description": "ISO 9001:2015 certified contract manufacturing: multi-axis CNC machining and turning (tolerances to ±0.005mm), sheet metal fabrication, injection molding, and electronics manufacturing services (EMS), with DFM, should-cost analysis, and VAVE engineering built into every project.",
  "provider": { "@id": "https://www.emuski.com/#organization" },
  "areaServed": [
    { "@type": "Country", "name": "India" },
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "Germany" },
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Contract Manufacturing Capabilities",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Precision CNC Machining & Turning",
          "description": "Multi-axis VMC milling and CNC turning with live tooling, tolerances to ±0.005mm, in aluminum, steel, titanium, and exotic alloys.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Sheet Metal Fabrication",
          "description": "Laser cutting, waterjet cutting, precision bending, punching, and certified welding.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Injection Molding",
          "description": "Mold design, material selection, and tooling engineered against a should-cost model, low to high volume.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Electronics Manufacturing Services (EMS)",
          "description": "SMT and PTH PCB assembly (PCBA), box-build and electro-mechanical assembly, cable harnessing, precision housings, heat sinks, EMI shielding components, connector assemblies, and enclosures for electronics OEMs, with ESD-safe manufacturing.",
        },
      },
    ],
  },
  "url": "https://www.emuski.com/manufacturing-services",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
  })),
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.emuski.com/" },
    { "@type": "ListItem", "position": 2, "name": "Manufacturing", "item": "https://www.emuski.com/manufacturing-services" },
  ],
}

export default function ManufacturingServicesPage() {
  return (
    <>
      <Script
        id="schema-service-manufacturing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="schema-faq-manufacturing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="schema-breadcrumb-manufacturing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200 pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" itemProp="item" className="text-gray-600 hover:text-emuski-teal-dark transition-colors">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li className="text-gray-400">/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-gray-900 font-medium">Manufacturing</span>
                <meta itemProp="item" content="https://www.emuski.com/manufacturing-services" />
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </div>
        </nav>

        <main id="main-content">
          <Hero />
          <Bluf />
          <Capabilities />
          <CapabilitiesTable />
          <ElectronicsManufacturing />
          <Products />
          <CaseStudies />
          <Engineering />
          <VaveTeardown />
          <Industries />
          <Quality />
          <SourcingComparison />
          <GlobalSourcing />
          <Engagement />
          <FAQ />
          <FinalCTA />
        </main>

        <Footer />
        <StickyCTA />
      </div>
    </>
  )
}
