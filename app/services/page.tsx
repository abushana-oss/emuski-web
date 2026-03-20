import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import {
  Factory,
  Settings,
  Zap,
  Calculator,
  TrendingDown,
  FileCheck,
  Target,
  Cog,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe,
  Phone,
  Mail
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Manufacturing & Engineering Services | ISO 9001:2015 Certified OEM Solutions | EMUSKI Bangalore',
  description: 'ISO 9001:2015 certified manufacturing and cost engineering services in Bangalore, India. OEM manufacturing with 25-45% cost reduction, precision engineering (CNC machining, injection molding, sheet metal), rapid prototyping, VAVE consulting, AI-powered production intelligence. Serving automotive, aerospace, medical devices, electronics industries globally. 15+ years experience, 75+ clients. Contact: +91-86670-88060',
  keywords: [
    // Primary Services - 2026 Focus
    'manufacturing services bangalore',
    'engineering services india',
    'OEM manufacturing bangalore 2026',
    'precision engineering services bangalore',
    'cost engineering services india',

    // Manufacturing Services
    'CNC machining services bangalore',
    'injection molding services india',
    'sheet metal fabrication bangalore',
    'rapid prototyping services',
    'custom manufacturing services',
    'volume production manufacturing',

    // Engineering Services
    'VAVE consulting services',
    'value engineering consulting',
    'product cost estimation services',
    'should cost analysis',
    'DFM optimization services',
    'design for manufacturing',

    // AI & Technology
    'AI manufacturing solutions',
    'AI-powered production',
    'AI cost estimation',
    'manufacturing intelligence',
    'digital manufacturing',

    // Quality & Certifications
    'ISO 9001:2015 certified manufacturing',
    'quality assurance services',
    'ISO certified manufacturing bangalore',

    // Industry Specific
    'automotive manufacturing services',
    'aerospace engineering services',
    'medical device manufacturing',
    'electronics manufacturing services',
    'industrial equipment manufacturing',

    // Location Based
    'manufacturing electronic city bangalore',
    'engineering services electronic city',
    'bangalore manufacturing facility',

    // Service Types
    'manufacturing consulting',
    'engineering consulting',
    'product development services',
    'cost optimization services',
    'supplier sourcing services',

    // Global Services
    'manufacturing services uk',
    'manufacturing services usa',
    'manufacturing services germany',
    'global manufacturing solutions'
  ].join(', '),
  authors: [{ name: 'EMUSKI Manufacturing & Engineering Team', url: 'https://www.emuski.com/services' }],
  creator: 'EMUSKI Manufacturing Solutions',
  publisher: 'EMUSKI Manufacturing Solutions',
  category: 'Manufacturing & Engineering Services',
  openGraph: {
    title: 'Manufacturing & Engineering Services - ISO Certified OEM Manufacturing | EMUSKI Bangalore',
    description: 'ISO 9001:2015 certified OEM manufacturing, precision engineering, cost optimization (25-45% reduction), VAVE consulting, AI-powered solutions. 15+ years experience serving automotive, aerospace, medical devices, electronics industries worldwide.',
    type: 'website',
    url: 'https://www.emuski.com/services',
    siteName: 'EMUSKI - Manufacturing & Engineering Excellence',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.emuski.com/assets/manufacturing/facility-overview.png',
        secureUrl: 'https://www.emuski.com/assets/manufacturing/facility-overview.png',
        width: 1200,
        height: 630,
        alt: 'EMUSKI ISO 9001:2015 Certified Manufacturing Facility - OEM Manufacturing Services',
        type: 'image/png',
      },
    ],
    countryName: 'India',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@emuski',
    creator: '@emuski',
    title: 'Manufacturing & Engineering Services - 25-45% Cost Reduction | EMUSKI',
    description: 'ISO certified OEM manufacturing, precision engineering, VAVE consulting, AI-powered production. 15+ years, 75+ global clients.',
    images: [
      {
        url: 'https://www.emuski.com/assets/manufacturing/facility-overview.png',
        alt: 'EMUSKI Manufacturing Services',
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: 'https://www.emuski.com/services',
    languages: {
      'en-US': 'https://www.emuski.com/services',
      'en-GB': 'https://www.emuski.com/services',
    },
  },
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
  // 2026 SEO Enhancement
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
  },
  other: {
    // AI Search Engine Optimization (2026 Standard)
    'ai:service_overview': 'Complete manufacturing and engineering services including OEM manufacturing, precision engineering, cost optimization, and AI-powered production',
    'ai:core_capabilities': 'CNC machining, injection molding, sheet metal fabrication, rapid prototyping, VAVE consulting, cost engineering, DFM optimization',
    'ai:primary_benefit': '25-45% cost reduction with ISO 9001:2015 certified quality',
    'ai:facility_location': 'Electronic City Phase 2, Bangalore, Karnataka, India - ISO certified manufacturing facility',
    'ai:global_reach': 'Serving 75+ clients across India, UK, USA, Germany and worldwide',
    'ai:experience': '15+ years manufacturing and engineering expertise',

    // E-E-A-T Signals (2026 Critical)
    'expertise': 'ISO 9001:2015 certified manufacturing with specialized teams in OEM production, precision engineering, and cost optimization',
    'experience': '15+ years serving 75+ global clients across automotive, aerospace, medical devices, electronics industries',
    'authoritativeness': 'Industry-leading Cost 360 platform, proven VAVE methodologies, AI-powered production intelligence',
    'trustworthiness': 'ISO 9001:2015 certified quality management, transparent processes, 95%+ client satisfaction',

    // Geographic Signals
    'geo.region': 'IN-KA',
    'geo.placename': 'Electronic City, Bangalore, Karnataka, India',
    'geo.position': '12.9716;77.5946',

    // Service Performance Metrics
    'service:cost_reduction': '25-45% average cost reduction through VAVE and optimization',
    'service:quality': 'ISO 9001:2015 certified quality assurance',
    'service:clients': '75+ global clients served',
    'service:experience': '15+ years manufacturing and engineering expertise',
    'service:success_rate': '95%+ project success rate',
  }
}

const manufacturingServices = [
  {
    icon: Factory,
    title: "OEM Manufacturing",
    description: "Custom OEM manufacturing solutions for automotive, aerospace, and electronics with 15-25% cost optimization",
    link: "/manufacturing-services",
    features: ["Custom Manufacturing", "Volume Production", "Quality Assurance", "On-time Delivery"]
  },
  {
    icon: Settings,
    title: "Precision Engineering",
    description: "High-precision CNC machining, injection molding, and sheet metal fabrication with micron-level accuracy",
    link: "/precision-engineering",
    features: ["CNC Machining", "Injection Molding", "Sheet Metal Fabrication", "Quality Control"]
  },
  {
    icon: Zap,
    title: "Rapid Prototyping",
    description: "Fast-turnaround prototyping services for product development and design validation",
    link: "/manufacturing-services#prototyping",
    features: ["3D Printing", "Quick Turnaround", "Design Validation", "Iterative Development"]
  },
  {
    icon: Cog,
    title: "AI Manufacturing Solutions",
    description: "AI-powered production intelligence for cost estimation, quality prediction, and process optimization",
    link: "/solutions/ai",
    features: ["AI Cost Estimation", "Quality Prediction", "Process Optimization", "Data Analytics"]
  }
]

const costEngineeringServices = [
  {
    icon: Calculator,
    title: "Product Cost Estimation",
    description: "Detailed bottom-up cost analysis using should cost methodology for accurate product costing",
    link: "/cost-engineering-services#cost-estimation",
    features: ["Should Cost Analysis", "Material Cost Analysis", "Process Time Studies", "Cost Breakdown"]
  },
  {
    icon: TrendingDown,
    title: "VAVE Methodology",
    description: "Value Analysis/Value Engineering delivering 25-45% cost reduction while maintaining quality",
    link: "/cost-engineering-services#vave",
    features: ["Design Optimization", "Material Substitution", "Process Improvement", "Supplier Sourcing"]
  },
  {
    icon: FileCheck,
    title: "Should Cost Analysis",
    description: "Engineering-based cost modeling for procurement teams and supplier negotiations",
    link: "/cost-engineering-services#should-cost",
    features: ["Teardown Analysis", "Benchmarking", "Supplier Negotiation", "Cost Validation"]
  },
  {
    icon: Target,
    title: "DFM Optimization",
    description: "Design for Manufacturing improvements to reduce production costs and improve manufacturability",
    link: "/cost-engineering-services#dfm",
    features: ["Design Review", "Manufacturability Analysis", "Cost Reduction", "Process Optimization"]
  }
]

const industries = [
  "Automotive Components",
  "Aerospace & Defense",
  "Medical Devices",
  "Electronics & PCB",
  "Industrial Equipment",
  "Consumer Products"
]

const whyChooseUs = [
  "ISO 9001:2015 Certified Quality",
  "15+ Years Industry Experience",
  "75+ Global Clients Served",
  "Located in Electronic City, Bangalore",
  "AI-Powered Manufacturing Intelligence",
  "VAVE & Cost Engineering Expertise",
  "Design-for-Manufacturing (DFM)",
  "Quality Assurance & Testing"
]

const regionalServices = [
  {
    region: "Bangalore, India",
    icon: Factory,
    description: "ISO certified manufacturing facility with full-service capabilities",
    link: "/manufacturing-in-bangalore"
  },
  {
    region: "UK Services",
    icon: Globe,
    description: "Cost engineering services for UK manufacturers with 40-60% savings",
    link: "/cost-engineering-uk"
  },
  {
    region: "Germany Services",
    icon: Globe,
    description: "VAVE consulting and cost optimization for German manufacturers",
    link: "/cost-engineering-germany"
  },
  {
    region: "USA Services",
    icon: Globe,
    description: "Engineering consulting and manufacturing solutions for US companies",
    link: "/cost-engineering-usa"
  }
]

export default function ServicesPage() {
  return (
    <>
      {/* Enhanced Service Schema - 2026 Best Practice */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Manufacturing and Engineering Services",
            "name": "ISO 9001:2015 Certified Manufacturing & Engineering Services",
            "description": "Comprehensive OEM manufacturing, precision engineering, cost optimization, and AI-powered production services delivering 25-45% cost reduction",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EMUSKI Manufacturing Solutions",
              "url": "https://www.emuski.com",
              "logo": "https://www.emuski.com/assets/logo.png",
              "image": "https://www.emuski.com/assets/manufacturing/facility-overview.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "126, RNS Plaza, KIADB Industrial Area, Electronic City Phase 2",
                "addressLocality": "Bengaluru",
                "addressRegion": "Karnataka",
                "postalCode": "560100",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "12.9716",
                "longitude": "77.5946"
              },
              "telephone": "+91-86670-88060",
              "email": "enquiries@emuski.com",
              "priceRange": "$$",
              "openingHours": "Mo-Sa 09:00-18:00",
              "hasCredential": {
                "@type": "EducationalOccupationalCredential",
                "credentialCategory": "certification",
                "name": "ISO 9001:2015 Certification"
              }
            },
            "areaServed": [
              {"@type": "Country", "name": "India"},
              {"@type": "Country", "name": "United Kingdom"},
              {"@type": "Country", "name": "United States"},
              {"@type": "Country", "name": "Germany"},
              {"@type": "Place", "name": "Global"}
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Manufacturing & Engineering Services Catalog",
              "itemListElement": [
                ...manufacturingServices.map(service => ({
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": service.title,
                    "description": service.description
                  }
                })),
                ...costEngineeringServices.map(service => ({
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": service.title,
                    "description": service.description
                  }
                }))
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "75",
              "bestRating": "5",
              "worstRating": "1"
            },
            "slogan": "Engineering Excellence, Manufacturing Innovation"
          })
        }}
      />

      {/* FAQ Schema for Rich Snippets - 2026 Best Practice */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What manufacturing and engineering services does EMUSKI provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EMUSKI provides comprehensive ISO 9001:2015 certified manufacturing and engineering services including: OEM manufacturing, precision engineering (CNC machining, injection molding, sheet metal fabrication), rapid prototyping, cost engineering (product cost estimation, VAVE analysis, should cost analysis), strategic sourcing, and AI-powered production intelligence. We serve automotive, aerospace, medical devices, electronics, and industrial equipment industries globally."
                }
              },
              {
                "@type": "Question",
                "name": "How much cost reduction can I achieve with EMUSKI services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EMUSKI's services deliver 25-45% average cost reduction through our VAVE methodology and cost optimization approaches. Our precision engineering services achieve 15-25% savings, while comprehensive VAVE consulting can deliver 20-30% cost reduction with 5-10x ROI. We combine expert engineering, strategic sourcing from 500+ suppliers, and AI-powered intelligence for maximum cost optimization."
                }
              },
              {
                "@type": "Question",
                "name": "Is EMUSKI ISO certified and what quality standards do you follow?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, EMUSKI is ISO 9001:2015 certified with comprehensive quality management systems. Our Electronic City, Bangalore facility maintains strict quality assurance processes across all manufacturing and engineering services. We have 15+ years of experience serving 75+ global clients with 95%+ success rate and client satisfaction."
                }
              },
              {
                "@type": "Question",
                "name": "What industries does EMUSKI serve?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EMUSKI serves a diverse range of industries including Automotive Components, Aerospace & Defense, Medical Devices, Electronics & PCB, Industrial Equipment, and Consumer Products. Our ISO certified facility and expert teams provide specialized solutions tailored to each industry's specific requirements and quality standards."
                }
              },
              {
                "@type": "Question",
                "name": "Does EMUSKI provide services internationally?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, EMUSKI provides global manufacturing and engineering services from our Bangalore facility. We serve clients in India, United Kingdom, United States, Germany, and worldwide. Our international service offerings include cost engineering consulting, VAVE analysis, strategic sourcing, and complete OEM manufacturing solutions with competitive pricing and quality."
                }
              },
              {
                "@type": "Question",
                "name": "What is EMUSKI's experience and client base?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EMUSKI has 15+ years of manufacturing and engineering expertise, serving 75+ global clients across multiple industries. Our facility is located in Electronic City Phase 2, Bangalore - a premier industrial zone. We maintain a 95%+ project success rate with high client satisfaction through our ISO certified processes, expert teams, and innovative solutions including our proprietary Cost 360 platform."
                }
              }
            ]
          })
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.emuski.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://www.emuski.com/services"
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-emuski-dark to-industrial-dark text-white py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Manufacturing & Engineering Services
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  ISO 9001:2015 Certified | OEM Manufacturing | Precision Engineering | Cost Optimization | AI-Powered Solutions
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="tel:+918667088060"
                    className="inline-flex items-center gap-2 bg-emuski-teal hover:bg-emuski-teal-light text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <Phone className="h-5 w-5" />
                    +91-86670-88060
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-emuski-teal px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Get Quote
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="py-12 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">75+</div>
                  <div className="text-gray-600">Global Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">ISO</div>
                  <div className="text-gray-600">9001:2015 Certified</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">25-45%</div>
                  <div className="text-gray-600">Cost Reduction</div>
                </div>
              </div>
            </div>
          </section>

          {/* Manufacturing Services */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Manufacturing Services
              </h2>
              <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                Comprehensive OEM manufacturing and precision engineering solutions
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {manufacturingServices.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <Link key={index} href={service.link}>
                      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emuski-teal border border-transparent h-full">
                        <div className="bg-emuski-teal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-emuski-teal" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex items-center text-emuski-teal font-semibold">
                          Learn More <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Cost Engineering Services */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Cost Engineering Services
              </h2>
              <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                Value engineering and cost optimization expertise for global manufacturers
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {costEngineeringServices.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <Link key={index} href={service.link}>
                      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emuski-teal border border-transparent h-full">
                        <div className="bg-emuski-teal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-emuski-teal" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex items-center text-emuski-teal font-semibold">
                          Learn More <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Regional Services */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Global Service Coverage
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {regionalServices.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <Link key={index} href={service.link}>
                      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center h-full">
                        <div className="bg-emuski-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-emuski-teal" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{service.region}</h3>
                        <p className="text-gray-600 mb-3">{service.description}</p>
                        <div className="flex items-center justify-center text-emuski-teal font-semibold">
                          Explore <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Industries Served */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Industries We Serve
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industries.map((industry, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-3">
                    <Award className="h-6 w-6 text-emuski-teal flex-shrink-0" />
                    <span className="font-medium">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Choose EMUSKI?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-emuski-dark to-industrial-dark text-white">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Manufacturing?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Get in touch with our experts to discuss your manufacturing and engineering needs
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-emuski-teal-light" />
                  <div className="text-left">
                    <div className="font-semibold">Phone</div>
                    <div className="text-gray-300">+91-86670-88060</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-emuski-teal-light" />
                  <div className="text-left">
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-300">enquiries@emuski.com</div>
                  </div>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-emuski-teal hover:bg-emuski-teal-light text-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Request a Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
