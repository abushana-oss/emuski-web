'use client'

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FAQSection } from "@/components/FAQSection"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import Script from "next/script"

import { EngineeringServicesTabs } from "@/components/EngineeringServicesTabs"
import SectorsServedSection from "@/components/SectorsServedSection"
import { EngineeringServicesContent } from "@/components/EngineeringServicesContent"

export default function PrecisionEngineering() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const tabMap: { [key: string]: string } = {
          'cost-estimation': 'cost-estimation',
          'vave': 'vave',
          'sourcing': 'sourcing',
          'expert-support': 'expert-support'
        }

        if (tabMap[hash]) {
          setTimeout(() => {
            let tabButton = document.querySelector(`button[value="${tabMap[hash]}"]`) as HTMLButtonElement

            if (!tabButton) {
              tabButton = document.querySelector(`button[role="tab"][id*="${tabMap[hash]}"]`) as HTMLButtonElement
            }

            if (!tabButton) {
              tabButton = document.querySelector(`[data-state][id*="${tabMap[hash]}"]`) as HTMLButtonElement
            }

            if (tabButton) {
              tabButton.click()

              setTimeout(() => {
                const detailElement = document.querySelector(`#${hash}-details`)
                if (detailElement) {
                  const offset = 80
                  const elementPosition = detailElement.getBoundingClientRect().top
                  const offsetPosition = elementPosition + window.pageYOffset - offset
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
                } else {
                  const element = document.querySelector('#engineering-services')
                  if (element) {
                    const offset = 80
                    const elementPosition = element.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - offset
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
                  }
                }
              }, 100)
            }
          }, 300)
        } else {
          setTimeout(() => {
            const element = document.querySelector(`#${hash}`)
            if (element) {
              const offset = 80
              const elementPosition = element.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.pageYOffset - offset
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
            }
          }, 100)
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const schemaOrgData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://www.emuski.com/precision-engineering#service",
        "name": "Precision Engineering Services - India's Leading Provider",
        "description": "India's premier precision engineering services with 15+ years proven experience. ISO 9001:2015 certified product cost estimation (±5% accuracy), VAVE analysis (20-30% savings), strategic sourcing from 500+ verified global suppliers. Serving 75+ clients across India (Mumbai, Delhi, Pune, Chennai, Hyderabad, Bangalore) and globally (UK, USA, Germany). Reduce manufacturing costs by 15-25%.",
        "slogan": "15+ Years of Precision Engineering Excellence Across India",
        "provider": {
          "@type": "Organization",
          "@id": "https://www.emuski.com/#organization",
          "name": "EMUSKI Manufacturing Solutions",
          "url": "https://www.emuski.com",
          "logo": "https://www.emuski.com/assets/logo.png",
          "foundingDate": "2008",
          "description": "Leading precision engineering and manufacturing company in India with 15+ years experience",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "126, RNS Plaza, KIADB Industrial Area, Electronic City Phase 2",
            "addressLocality": "Bengaluru",
            "addressRegion": "Karnataka",
            "postalCode": "560100",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-86670-88060",
            "contactType": "sales",
            "email": "enquiries@emuski.com",
            "areaServed": ["India", "United Kingdom", "United States", "Germany", "Worldwide"],
            "availableLanguage": ["English", "Hindi"]
          },
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "certification",
            "name": "ISO 9001:2015 Certification"
          }
        },
        "areaServed": [
          {
            "@type": "Country",
            "name": "India"
          },
          {
            "@type": "City",
            "name": "Mumbai",
            "containedIn": {"@type": "Country", "name": "India"}
          },
          {
            "@type": "City",
            "name": "Delhi",
            "containedIn": {"@type": "Country", "name": "India"}
          },
          {
            "@type": "City",
            "name": "Pune",
            "containedIn": {"@type": "Country", "name": "India"}
          },
          {
            "@type": "City",
            "name": "Chennai",
            "containedIn": {"@type": "Country", "name": "India"}
          },
          {
            "@type": "City",
            "name": "Hyderabad",
            "containedIn": {"@type": "Country", "name": "India"}
          },
          {
            "@type": "City",
            "name": "Bangalore",
            "containedIn": {"@type": "Country", "name": "India"}
          },
          {
            "@type": "Country",
            "name": "United Kingdom"
          },
          {
            "@type": "Country",
            "name": "United States"
          },
          {
            "@type": "Country",
            "name": "Germany"
          },
          {
            "@type": "Place",
            "name": "Global"
          }
        ],
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "20.5937",
            "longitude": "78.9629"
          },
          "geoRadius": "2000000",
          "description": "Pan-India service coverage from Bangalore"
        },
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": "https://www.emuski.com/precision-engineering"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "75",
          "bestRating": "5",
          "worstRating": "1"
        },
        "award": [
          "15+ Years Industry Experience",
          "ISO 9001:2015 Certified",
          "75+ Global Clients Served",
          "Leading Precision Engineering Company in India"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Precision Engineering Service Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Product Cost Estimation",
                "description": "Should-cost analysis with ±5% accuracy delivering 15-25% cost savings"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "VAVE Analysis",
                "description": "Value engineering delivering 20-30% cost reduction with 5-10x ROI"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Strategic Sourcing",
                "description": "Global sourcing from 500+ verified suppliers with 15-20% cost savings"
              }
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://www.emuski.com/precision-engineering#services",
        "name": "Engineering Services Offered",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Service",
              "name": "Product Cost Estimation",
              "description": "Comprehensive should-cost analysis with detailed breakdowns of materials, labor, and overhead. Achieve ±5% accuracy level with 15-25% average savings.",
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Service",
              "name": "VAVE - Teardown & Benchmarking",
              "description": "Value Analysis and Value Engineering through systematic product teardowns and competitive benchmarking. Achieve 20-30% cost reduction with 5-10x ROI.",
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Service",
              "name": "Strategic Sourcing",
              "description": "Global supplier network of 500+ verified suppliers with quality assurance, negotiation support, and risk mitigation. Achieve 15-20% cost savings with 95% success rate.",
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Service",
              "name": "Expert Engineer Support",
              "description": "Specialized engineering talent on-demand for cost engineering, value engineering, sourcing, and manufacturing engineering with 98% client satisfaction.",
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock"
              }
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.emuski.com/precision-engineering#breadcrumb",
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
            "name": "Precision Engineering",
            "item": "https://www.emuski.com/precision-engineering"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.emuski.com/precision-engineering#webpage",
        "url": "https://www.emuski.com/precision-engineering",
        "name": "India's Leading Precision Engineering Services | 15+ Years Experience | Cost Estimation, VAVE & Strategic Sourcing",
        "description": "India's premier precision engineering services with 15+ years proven experience serving all of India (Mumbai, Delhi, Pune, Chennai, Hyderabad) and globally. ISO 9001:2015 certified cost estimation, VAVE analysis, strategic sourcing. 75+ satisfied clients across automotive, aerospace, medical devices, electronics. Reduce manufacturing costs by 15-25%.",
        "keywords": "precision engineering india, cost estimation india, VAVE analysis india, strategic sourcing india, manufacturing cost reduction india, precision engineering mumbai, precision engineering delhi, precision engineering pune, 15 years experience",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.emuski.com/#website"
        },
        "breadcrumb": {
          "@id": "https://www.emuski.com/precision-engineering#breadcrumb"
        },
        "inLanguage": "en-US"
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema Markup */}
      <Script
        id="schema-precision-engineering"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
      />

      {/* FAQ Schema for Rich Snippets - 2026 Best Practice */}
      <Script
        id="faq-schema-precision-engineering"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What precision engineering services does EMUSKI provide across India?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EMUSKI is India's leading precision engineering company with 15+ years experience serving clients across Mumbai, Delhi, Pune, Chennai, Hyderabad, Bangalore and all of India, as well as globally. We provide ISO 9001:2015 certified product cost estimation (±5% accuracy), VAVE analysis (20-30% savings), strategic sourcing from 500+ global suppliers, and expert engineering support. Our services reduce manufacturing costs by 15-25% while maintaining quality. From our Bangalore facility, we serve 75+ clients in automotive, aerospace, medical devices, and electronics industries."
                }
              },
              {
                "@type": "Question",
                "name": "What is VAVE analysis and what ROI can I expect?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "VAVE (Value Analysis Value Engineering) is a systematic approach to analyzing products through teardown and competitive benchmarking. Our VAVE methodology delivers 20-30% cost reduction with a proven 5-10x return on investment. We identify cost optimization opportunities while maintaining or improving product performance."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate is your product cost estimation service?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our product cost estimation service achieves ±5% accuracy using comprehensive should-cost analysis methodology. We provide detailed breakdowns of materials, labor, and overhead costs, with average savings of 15-25% through our expert cost engineering approach and Cost 360 platform."
                }
              },
              {
                "@type": "Question",
                "name": "What industries and locations does EMUSKI serve in India and globally?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EMUSKI serves automotive, aerospace, medical devices, electronics, and industrial equipment industries with 15+ years proven experience. We provide pan-India coverage from our ISO 9001:2015 certified Bangalore facility, serving major cities including Mumbai, Delhi NCR, Pune, Chennai, Hyderabad, Kolkata, and all other Indian locations. Internationally, we serve clients in UK, USA, Germany, and other global markets. With 75+ satisfied clients worldwide, we combine Indian cost advantage with international quality standards."
                }
              },
              {
                "@type": "Question",
                "name": "What is the Cost 360 platform?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cost 360 is our advanced cost intelligence platform providing comprehensive cost modeling, BOM analysis, multi-process cost calculation, and real-time cost database integration. It includes an integrated CRM system for project tracking and enables fast, accurate cost estimation with scenario comparison capabilities."
                }
              },
              {
                "@type": "Question",
                "name": "How does your strategic sourcing service work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our strategic sourcing service provides access to a global network of 500+ verified suppliers with quality assurance, negotiation support, and risk mitigation. We achieve 15-20% cost savings with a 95% success rate through supplier development, procurement optimization, and global sourcing expertise."
                }
              },
              {
                "@type": "Question",
                "name": "Why choose EMUSKI for precision engineering in India?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EMUSKI is India's most experienced precision engineering company with 15+ years proven track record. We are ISO 9001:2015 certified with 75+ satisfied clients across India and globally. Our unique advantages include: Cost 360 digital platform, 500+ verified global suppliers, ±5% cost estimation accuracy, 20-30% VAVE savings, pan-India service coverage, international quality standards, and established presence in Bangalore's Electronic City. We combine deep experience, proven methodologies, and cutting-edge technology to deliver consistent 15-25% cost reduction for automotive, aerospace, medical device, and electronics manufacturers."
                }
              }
            ]
          })
        }}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-3">
          <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" itemProp="item" className="text-gray-600 hover:text-emuski-teal-dark transition-colors">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-gray-400">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/precision-engineering" itemProp="item" className="text-gray-900 font-medium">
                <span itemProp="name">Precision Engineering</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>

      <header className="relative py-12 sm:py-14 md:py-16 lg:py-20 border-b border-border/30 overflow-hidden" style={{backgroundColor: 'rgb(18, 26, 33)'}}>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 pt-2 sm:pt-3 md:pt-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Category Badge */}
                <div className="flex justify-center">
                  <span className="text-emuski-teal text-xs sm:text-sm font-semibold tracking-wider uppercase" role="doc-subtitle">
                    India's Leading Precision Engineering • 15+ Years Experience
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-2">
                  Precision Engineering Services Across India & Globally
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  With 15+ years proven experience, we serve clients across India (Mumbai, Delhi, Pune, Chennai, Hyderabad) and globally. ISO 9001:2015 certified cost estimation, VAVE analysis, and strategic sourcing delivering 15-25% cost reduction. 75+ satisfied clients in automotive, aerospace, medical devices, and electronics industries.
                </p>

                {/* CTA Button */}
                <div className="flex justify-center pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-emuski-teal-darker hover:bg-emuski-teal-dark text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav role="navigation" aria-label="Engineering services tabs">
        <EngineeringServicesTabs />
      </nav>

      <main id="main-content">
        <EngineeringServicesContent />

      <section className="py-16 md:py-20 bg-white" aria-labelledby="experience-credentials">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 id="experience-credentials" className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Why Choose EMUSKI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-emuski-teal-dark to-emuski-teal text-white rounded-xl text-center">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-lg font-semibold">Years Experience</div>
                <div className="text-sm mt-2 opacity-90">Established track record in precision engineering</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-emuski-teal-dark to-emuski-teal text-white rounded-xl text-center">
                <div className="text-4xl font-bold mb-2">75+</div>
                <div className="text-lg font-semibold">Global Clients</div>
                <div className="text-sm mt-2 opacity-90">Across India, UK, USA, Germany</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-emuski-teal-dark to-emuski-teal text-white rounded-xl text-center">
                <div className="text-4xl font-bold mb-2">ISO</div>
                <div className="text-lg font-semibold">9001:2015 Certified</div>
                <div className="text-sm mt-2 opacity-90">International quality standards</div>
              </div>
            </div>
            <div className="p-8 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Pan-India & Global Service Coverage</h3>
              <p className="text-gray-700 leading-relaxed text-center mb-4">
                From our ISO certified facility in Bangalore, we serve clients across all major Indian cities including Mumbai, Delhi, Pune, Chennai, Hyderabad, and internationally in UK, USA, and Germany.
              </p>
              <p className="text-gray-700 leading-relaxed text-center">
                We track real manufacturing costs across Western Europe, Eastern Europe, North America, Asia, and India. This helps you see what a part should cost in each region and choose the best place to build it - combining Indian cost advantage with international quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white" aria-labelledby="cost-360-platform">
        <div className="container mx-auto px-4 sm:px-6">
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <header>
                <h2 id="cost-360-platform" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Cost 360
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Advanced cost intelligence platform for accurate product cost estimation and analysis
                </p>
              </header>

              <div className="space-y-6">
                <div className="border-l-4 border-emuski-teal-dark pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Cost Estimation Platform
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive cost modeling and analysis tool for precise product costing, BOM breakdowns, and manufacturing process optimization.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Feature mapping and detailed BOM analysis",
                      "Multi-process cost calculation",
                      "Real-time cost database integration",
                      "Scenario comparison and what-if analysis"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-emuski-teal-dark flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-4 border-emuski-teal pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Integrated CRM System
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Seamless project management and client collaboration tools integrated with cost estimation workflows.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Project tracking and milestone management",
                      "Client portal for real-time updates",
                      "Automated reporting and documentation",
                      "Cross-functional team collaboration"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-emuski-teal-dark flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 p-4">
                <Image
                  src="/assets/engineering/cost360-platform-dashboard.png"
                  alt="Cost 360 Platform Dashboard - Advanced Cost Estimation Tool"
                  width={1056}
                  height={681}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto"
                  quality={90}
                  priority
                />
              </div>
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 p-4">
                <Image
                  src="/assets/engineering/cost360-crm-system.png"
                  alt="Cost 360 CRM System - Client Relationship Management"
                  width={830}
                  height={471}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto"
                  quality={90}
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <SectorsServedSection />

      <section className="py-16 md:py-20 bg-emuski-teal-darker text-white relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h2 id="cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Partner with India's Most Experienced Precision Engineering Team
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              15+ years of proven expertise serving 75+ clients across India and globally. ISO 9001:2015 certified quality, Cost 360 platform, and 500+ verified suppliers ready to optimize your manufacturing costs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
              <div className="text-sm bg-white/10 px-4 py-2 rounded-lg">📍 Serving All of India</div>
              <div className="text-sm bg-white/10 px-4 py-2 rounded-lg">🌍 Global Reach</div>
              <div className="text-sm bg-white/10 px-4 py-2 rounded-lg">✓ ISO 9001:2015</div>
              <div className="text-sm bg-white/10 px-4 py-2 rounded-lg">⭐ 75+ Clients</div>
            </div>
            <div className="pt-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-emuski-teal-darker font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Request a Quote - Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        compact={true}
        maxItems={8}
        showCategories={false}
        usePageSpecific={true}
      />
      </main>

      <Footer />
    </div>
  )
}
