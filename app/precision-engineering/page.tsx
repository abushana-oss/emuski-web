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
        "name": "Precision Engineering Services",
        "description": "Expert precision engineering services including product cost estimation, VAVE analysis, strategic sourcing, and engineering support to reduce manufacturing costs.",
        "provider": {
          "@type": "Organization",
          "@id": "https://www.emuski.com/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": "https://www.emuski.com/precision-engineering"
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
        "name": "Precision Engineering Services | Cost Estimation, VAVE & Strategic Sourcing",
        "description": "Expert precision engineering services to reduce manufacturing costs by 15-25%. Product cost estimation, VAVE analysis, strategic sourcing, and engineering support.",
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
                    Engineering Innovation
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-2">
                  Engineering That Makes Products Cost Less
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  We break down your products, compare them with competitors, and build clear cost models. This helps you remove waste, simplify designs, and keep performance high while lowering cost.
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

      <section className="py-16 md:py-20 bg-white" aria-labelledby="global-cost-intelligence">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
            <h2 id="global-cost-intelligence" className="text-2xl font-bold text-gray-900 mb-4">Global Cost Intelligence</h2>
            <p className="text-gray-700 leading-relaxed">
              We track real manufacturing costs across Western Europe, Eastern Europe, North America, Asia, and India. This helps you see what a part should cost in each region and choose the best place to build it.
            </p>
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
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 id="cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Optimize Your Manufacturing Costs
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Let our engineering team analyze your project and identify cost optimization opportunities.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-emuski-teal-darker font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Request a Quote
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
