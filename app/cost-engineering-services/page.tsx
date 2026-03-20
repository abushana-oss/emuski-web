import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import {
  Calculator,
  TrendingDown,
  FileCheck,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  Globe,
  Award,
  Target,
  Zap,
  DollarSign
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cost Engineering Services | VAVE Consulting & Product Cost Estimation | UK USA Germany India',
  description: 'Top cost engineering consultancy with UK team & India delivery. Expert VAVE methodology, should cost analysis, DFM optimization. Reduce product costs 25-45%. ISO certified. Serving Fortune 500 in UK, USA, Germany. Get cost engineer expertise for automotive, aerospace, medical devices. Contact: +91-86670-88060',
  keywords: 'cost engineering services, cost engineer, costing engineer, VAVE methodology, value analysis value engineering, should cost analysis, product cost estimation, cost breakdown analysis, teardown cost analysis, DFM optimization, design for manufacturing, cost reduction engineering, manufacturing cost optimization, engineering consulting services UK, engineering consultancy London, cost engineering USA, offshore engineering services India, product cost optimization, engineering services Bangalore, cost engineering consultancy, value engineering consulting, should costing services, engineering cost analysis, product development cost reduction, cost modeling services, cost engineering Germany, engineering services for automotive, aerospace cost engineering, medical device cost optimization, electronics cost reduction, bill of material cost analysis, procurement cost engineering, supplier cost negotiation, strategic sourcing engineering, cost estimation consulting, engineering design optimization, lean manufacturing consulting, six sigma cost reduction, cost of goods sold optimization, manufacturing overhead reduction, direct labor cost analysis, material cost optimization, process cost engineering, assembly cost reduction, cost engineer salary India, cost engineer job description, cost engineer course, engineering consulting rates, offshore engineering cost savings, nearshore engineering services, global engineering delivery model, engineering outsourcing services, technical cost analysis, engineering economics consulting',
  openGraph: {
    title: 'Cost Engineering Services | VAVE & Product Cost Optimization Experts | Global Consulting',
    description: 'ISO certified cost engineering consultancy in India with UK team. Reduce product costs by 25-45% through VAVE, should cost analysis, and DFM optimization. Serving UK, USA, Germany, and global clients with proven results.',
    type: 'website',
    url: 'https://www.emuski.com/cost-engineering-services',
  },
  alternates: {
    canonical: 'https://www.emuski.com/cost-engineering-services',
    languages: {
      'x-default': 'https://www.emuski.com/cost-engineering-services',
      'en-GB': 'https://www.emuski.com/cost-engineering-uk',
      'en-US': 'https://www.emuski.com/cost-engineering-usa',
      'de-DE': 'https://www.emuski.com/cost-engineering-germany'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Bangalore, Karnataka, India',
    'geo.position': '12.9716;77.5946',
  }
}

const faqData = [
  {
    question: "What is the salary of cost engineer in India?",
    answer: "Cost engineers in India typically earn between ₹4-12 lakhs per annum, depending on experience and expertise. Entry-level cost engineers (costing engineer roles) start around ₹4-6 lakhs, mid-level professionals earn ₹6-9 lakhs, and senior cost engineering consultants with VAVE expertise can earn ₹10-15 lakhs or more. At EMUSKI, our cost engineering team includes experts with 10+ years of experience delivering cost optimization services to global clients across UK, USA, and Germany. Salary varies based on industry expertise (automotive, aerospace, medical devices) and technical skills (VAVE, should cost analysis, DFM)."
  },
  {
    question: "What is the cost of engineering services in India?",
    answer: "Engineering services in India offer 40-60% cost savings compared to UK, USA, or Germany, while maintaining international quality standards. Typical rates: Product cost estimation (₹50,000-2,00,000 per project), VAVE consulting (₹1,00,000-5,00,000), DFM optimization (₹75,000-3,00,000), and should cost analysis (₹1,00,000-4,00,000). EMUSKI provides ISO 9001:2015 certified cost engineering services with proven 25-45% product cost reduction, offering exceptional value to global clients. Our UK consulting team ensures seamless project management while India delivery center provides technical excellence at competitive rates."
  },
  {
    question: "What is the role of a cost engineer?",
    answer: "A cost engineer (also called costing engineer) analyzes product designs, manufacturing processes, and supply chains to optimize costs without compromising quality. Key responsibilities include: product cost estimation and breakdown analysis, VAVE (Value Analysis/Value Engineering) studies, should cost analysis for supplier negotiations, DFM (Design for Manufacturing) optimization, teardown analysis of competitive products, cost reduction recommendations, supplier sourcing strategies, bill of material (BOM) cost analysis, and manufacturing process cost optimization. EMUSKI's cost engineers combine engineering expertise with financial analysis to deliver measurable cost savings for global manufacturing companies in automotive, aerospace, medical devices, and electronics sectors."
  },
  {
    question: "What is the cost engineer job description and requirements?",
    answer: "Cost engineer job description includes: analyzing product designs for cost optimization opportunities, performing VAVE and should cost analysis, creating detailed cost breakdowns and estimates, conducting teardown studies of competitive products, collaborating with design and procurement teams, negotiating with suppliers using data-driven insights, and developing cost reduction roadmaps. Required skills: engineering degree (mechanical/industrial), 3-5+ years experience, proficiency in CAD, cost modeling tools, strong analytical and communication skills, knowledge of manufacturing processes, and understanding of VAVE methodology. EMUSKI's cost engineering team combines these skills with ISO certified processes to deliver proven results for UK, USA, and German clients."
  },
  {
    question: "Are there cost engineer courses and certifications available?",
    answer: "Yes, several cost engineer courses and certifications enhance expertise: Certified Cost Technician (CCT) and Certified Cost Consultant (CCC) from AACE International, Value Engineering certification from SAVE International, Six Sigma and Lean certifications for cost optimization, CAD/CAM software training, manufacturing process courses, and VAVE methodology training. EMUSKI's cost engineering team holds multiple certifications and provides practical, real-world cost engineering training through hands-on projects. We offer cost engineering consulting services that combine academic knowledge with 15+ years of practical experience serving Fortune 500 companies across automotive, aerospace, and medical device industries."
  },
  {
    question: "Which engineering service is highest value in cost optimization?",
    answer: "VAVE (Value Analysis/Value Engineering) methodology delivers the highest ROI in cost optimization, typically achieving 25-45% cost reductions while maintaining or improving quality. EMUSKI's comprehensive approach combines VAVE with should cost analysis, DFM optimization, and strategic sourcing. Our engineering consulting services help UK, USA, and German companies reduce product development costs, optimize manufacturing expenses, and improve profit margins through data-driven cost engineering strategies. We also provide teardown analysis, cost breakdown studies, and procurement engineering support for complete cost optimization solutions."
  },
  {
    question: "How do offshore engineering services work for UK and USA companies?",
    answer: "Offshore engineering services provide global companies access to skilled cost engineers at competitive rates with seamless collaboration. EMUSKI's proven model: UK-based consulting team for client management and business development, India-based engineering center (Bangalore) for technical execution with ISO 9001:2015 certified processes, real-time collaboration via cloud platforms (MS Teams, Zoom, secure portals), IP protection with comprehensive NDAs and security protocols, and dedicated project managers ensuring communication. We deliver cost engineering, product cost estimation, VAVE studies, and DFM optimization for UK, USA, Germany, and global clients with 98.7% on-time delivery and proven 25-45% cost reductions."
  },
  {
    question: "What is should cost analysis and how does it help?",
    answer: "Should cost analysis is a detailed engineering-based method to determine the realistic cost of a product or component by analyzing materials, processes, labor, and overheads. It helps companies: negotiate better supplier prices with data-driven insights, identify cost reduction opportunities in design and manufacturing, validate supplier quotes and prevent overcharging, benchmark costs against industry standards, make informed sourcing decisions, and set target costs for new products. EMUSKI's cost engineering team performs comprehensive should cost analysis using teardown analysis, process time studies, material cost databases, and manufacturing process modeling for accurate cost estimation and supplier negotiations."
  },
  {
    question: "Why choose India for cost engineering services?",
    answer: "India offers world-class engineering talent at competitive rates with global quality standards. Benefits: 40-60% cost savings vs UK/USA/Germany rates, large pool of qualified cost engineers with international experience and certifications, ISO certified quality management systems (9001:2015), English-speaking professionals for seamless communication, time zone advantages for round-the-clock productivity (UK business hours overlap), proven track record with Fortune 500 companies, and established offshore engineering delivery models. EMUSKI combines India's engineering excellence (Bangalore - India's tech capital) with UK presence, delivering cost optimization services to global clients with 15+ years of proven expertise, 75+ satisfied clients, and measurable cost reduction results."
  },
  {
    question: "What industries benefit from cost engineering services?",
    answer: "Cost engineering delivers value across all manufacturing sectors: Automotive (component cost optimization, VAVE for assemblies, supplier negotiations), Aerospace & Defense (weight reduction, material optimization, should cost analysis), Medical Devices (regulatory-compliant cost reduction, DFM optimization), Electronics & PCB (component sourcing, design cost optimization), Industrial Equipment (manufacturing process optimization, assembly cost reduction), and Consumer Products (cost-competitive design, value engineering). EMUSKI's cost engineering consultancy serves 15+ industries with proven cost reduction strategies, helping UK, USA, and German companies improve margins, competitiveness, and profitability through expert VAVE methodology and should cost analysis."
  },
  {
    question: "How do UK companies benefit from EMUSKI's cost engineering services?",
    answer: "UK companies gain competitive advantages through EMUSKI's unique delivery model: UK-based consulting team for seamless communication and project management, 40-60% cost savings compared to UK engineering consultancy rates, access to specialized cost engineering expertise in VAVE, should cost analysis, and DFM optimization, ISO 9001:2015 certified processes matching UK quality standards, proven 25-45% product cost reduction results, experience with UK automotive, aerospace, and medical device companies, IP protection with UK-compliant NDAs, and support for UK manufacturing and procurement teams. Contact our UK consulting team at +91-86670-88060 or enquiries@emuski.com for cost engineering consultation."
  }
]

const services = [
  {
    icon: Calculator,
    title: "Product Cost Estimation",
    description: "Detailed bottom-up cost estimation using should cost analysis, material databases, and process time studies for accurate product costing"
  },
  {
    icon: TrendingDown,
    title: "VAVE Methodology",
    description: "Value Analysis/Value Engineering to reduce costs by 25-45% while maintaining or improving product quality and performance"
  },
  {
    icon: FileCheck,
    title: "Should Cost Analysis",
    description: "Engineering-based cost modeling for supplier negotiations, sourcing decisions, and cost validation with detailed breakdowns"
  },
  {
    icon: Target,
    title: "DFM Optimization",
    description: "Design for Manufacturing improvements to reduce production costs, improve manufacturability, and optimize supply chain"
  }
]

const globalPresence = [
  {
    region: "United Kingdom",
    description: "UK-based consulting team for client management and business development",
    icon: Globe
  },
  {
    region: "India - Bangalore",
    description: "ISO certified engineering center with 75+ cost engineering specialists",
    icon: MapPin
  },
  {
    region: "Global Delivery",
    description: "Serving clients across USA, Germany, Europe, and worldwide with proven results",
    icon: Globe
  }
]

const benefits = [
  "25-45% Product Cost Reduction Proven",
  "ISO 9001:2015 Certified Quality",
  "15+ Years Cost Engineering Experience",
  "UK Consulting Team + India Delivery",
  "VAVE & Should Cost Expertise",
  "Fortune 500 Client Experience",
  "98.7% On-Time Delivery Rate",
  "40-60% Cost Savings vs UK/USA"
]

const industries = [
  "Automotive Components",
  "Aerospace & Defense",
  "Medical Devices",
  "Electronics & PCB",
  "Industrial Equipment",
  "Consumer Products"
]

export default function CostEngineeringServicesPage() {
  return (
    <>
      {/* FAQ Schema for People Also Ask */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      {/* Professional Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "EMUSKI Cost Engineering Services",
            "description": "Leading cost engineering consultancy providing product cost estimation, VAVE methodology, should cost analysis, and DFM optimization services to global clients",
            "url": "https://www.emuski.com/cost-engineering-services",
            "priceRange": "$$",
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
            "areaServed": [
              {"@type": "Country", "name": "United Kingdom"},
              {"@type": "Country", "name": "United States"},
              {"@type": "Country", "name": "Germany"},
              {"@type": "Country", "name": "India"},
              {"@type": "Place", "name": "Global"}
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Cost Engineering Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Product Cost Estimation",
                    "description": "Should cost analysis and detailed product cost estimation services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "VAVE Consulting",
                    "description": "Value Analysis/Value Engineering for 25-45% cost reduction"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "DFM Optimization",
                    "description": "Design for Manufacturing cost optimization services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Should Cost Analysis",
                    "description": "Engineering-based cost modeling for supplier negotiations"
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "75",
              "bestRating": "5"
            },
            "certification": "ISO 9001:2015, ISO 14001:2015, ISO 45001:2018"
          })
        }}
      />

      {/* Organization Schema with UK Presence */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "EMUSKI Cost Engineering Consultancy",
            "description": "Global cost engineering services provider with UK consulting team and India delivery center",
            "url": "https://www.emuski.com",
            "logo": "https://www.emuski.com/logo.webp",
            "sameAs": [
              "https://www.linkedin.com/company/emuski",
              "https://twitter.com/emuski"
            ],
            "address": [
              {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "streetAddress": "126, RNS Plaza, Electronic City Phase 2"
              },
              {
                "@type": "PostalAddress",
                "addressCountry": "GB",
                "description": "UK Consulting Team"
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
                "name": "Cost Engineering Services",
                "item": "https://www.emuski.com/cost-engineering-services"
              }
            ]
          })
        }}
      />

      {/* HowTo Schema - Cost Engineering Process */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Reduce Product Costs with Cost Engineering",
            "description": "Step-by-step process for product cost optimization using VAVE methodology and should cost analysis",
            "totalTime": "PT4W",
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Product Cost Estimation",
                "text": "Detailed bottom-up cost breakdown analysis of current product design, materials, and manufacturing processes",
                "url": "https://www.emuski.com/cost-engineering-services#cost-estimation"
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "VAVE Analysis",
                "text": "Value Analysis/Value Engineering study to identify cost reduction opportunities without compromising quality",
                "url": "https://www.emuski.com/cost-engineering-services#vave"
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Should Cost Modeling",
                "text": "Engineering-based cost modeling for realistic pricing and supplier negotiations",
                "url": "https://www.emuski.com/cost-engineering-services#should-cost"
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "DFM Optimization",
                "text": "Design for Manufacturing improvements to reduce production costs and improve manufacturability",
                "url": "https://www.emuski.com/cost-engineering-services#dfm"
              },
              {
                "@type": "HowToStep",
                "position": 5,
                "name": "Implementation & Validation",
                "text": "Support in implementing cost reduction recommendations and validating actual savings achieved",
                "url": "https://www.emuski.com/cost-engineering-services#implementation"
              }
            ]
          })
        }}
      />

      {/* Review Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
              "@type": "Service",
              "name": "EMUSKI Cost Engineering Services"
            },
            "author": {
              "@type": "Organization",
              "name": "Fortune 500 Clients"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "4.9",
              "bestRating": "5"
            },
            "reviewBody": "EMUSKI's cost engineering services delivered 35% cost reduction on our automotive component line through expert VAVE methodology and should cost analysis. Their UK team provided excellent project management while the India engineering center executed with precision."
          })
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-emuski-dark to-industrial-dark text-white py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <Globe className="h-5 w-5 text-emuski-teal-light" />
                <span>Serving UK, USA, Germany & Global Clients | UK Consulting Team + India Delivery</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Cost Engineering Services & Product Cost Optimization
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
                ISO Certified Cost Engineering Consultancy | VAVE Methodology | Should Cost Analysis | 25-45% Cost Reduction Proven
              </p>
              <div className="flex flex-wrap gap-4">
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
                  Get Cost Analysis Quote
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="py-12 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">25-45%</div>
                  <div className="text-gray-600">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">75+</div>
                  <div className="text-gray-600">Global Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">ISO</div>
                  <div className="text-gray-600">9001:2015 Certified</div>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Engineering Services */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Comprehensive Cost Engineering Services
              </h2>
              <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                Expert product cost optimization, VAVE consulting, and should cost analysis for global manufacturing companies
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emuski-teal border border-transparent">
                      <div className="bg-emuski-teal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-emuski-teal" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Call to Action - View Services & Contact */}
          <section className="py-12 px-4 bg-gradient-to-r from-emuski-teal to-emuski-teal-light">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
                    Ready to Optimize Your Product Costs?
                  </h3>
                  <p className="text-lg text-gray-800">
                    Discover our complete range of cost engineering services or connect with our experts
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    View All Services
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-emuski-dark hover:bg-industrial-dark text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Mail className="h-5 w-5" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Global Presence */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Global Presence, Local Expertise
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {globalPresence.map((location, index) => {
                  const Icon = location.icon
                  return (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                      <div className="bg-emuski-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-emuski-teal" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{location.region}</h3>
                      <p className="text-gray-600">{location.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Industries Served */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Industries We Serve Globally
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industries.map((industry, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-3 hover:shadow-lg transition-shadow duration-300">
                    <Target className="h-6 w-6 text-emuski-teal flex-shrink-0" />
                    <span className="font-medium">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose EMUSKI */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Global Companies Choose EMUSKI for Cost Engineering
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section - People Also Ask */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions About Cost Engineering Services
              </h2>
              <div className="space-y-6">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-emuski-teal">
                    <h3 className="text-xl font-semibold mb-3 text-emuski-teal">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-emuski-dark to-industrial-dark text-white">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Reduce Your Product Costs by 25-45%
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Get expert cost engineering services from our UK consulting team backed by India's ISO certified engineering center
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-emuski-teal-light" />
                  <div className="text-left">
                    <div className="font-semibold">India Engineering Center</div>
                    <div className="text-gray-300">Electronic City Phase 2, Bangalore 560100</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-emuski-teal-light" />
                  <div className="text-left">
                    <div className="font-semibold">Contact</div>
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
                Request Cost Engineering Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>

          {/* SEO Content Block */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2>Cost Engineering Services for Global Manufacturing Companies</h2>
              <p>
                EMUSKI is a leading cost engineering consultancy providing comprehensive product cost optimization services to global
                manufacturing companies. With a UK-based consulting team and ISO 9001:2015 certified engineering center in Bangalore, India,
                we deliver proven cost reduction results through VAVE methodology, should cost analysis, and DFM optimization.
              </p>

              <h3>What is Cost Engineering?</h3>
              <p>
                Cost engineering combines engineering expertise with financial analysis to optimize product costs throughout the development
                and manufacturing lifecycle. Our cost engineering services include product cost estimation, should cost analysis for supplier
                negotiations, VAVE (Value Analysis/Value Engineering) consulting, teardown analysis, DFM (Design for Manufacturing) optimization,
                and cost breakdown modeling. We help UK, USA, German, and global clients reduce manufacturing costs by 25-45% while maintaining
                or improving quality standards.
              </p>

              <h3>VAVE Methodology & Value Engineering Services</h3>
              <p>
                Value Analysis/Value Engineering (VAVE) is our core competency, delivering systematic cost reduction through design optimization,
                material substitution, process improvement, and supply chain optimization. Our VAVE consulting process includes: functional analysis
                of product requirements, identification of cost reduction opportunities, engineering validation of alternatives, supplier sourcing
                for optimized components, and implementation support with measurable results. EMUSKI's VAVE methodology has delivered 25-45% cost
                reductions for Fortune 500 companies across automotive, aerospace, medical devices, and electronics sectors.
              </p>

              <h3>Should Cost Analysis & Product Cost Estimation</h3>
              <p>
                Should cost analysis is an engineering-based approach to determine the realistic cost of a product by analyzing materials, processes,
                labor, overheads, and profit margins. Our cost engineering team performs detailed should cost analysis using: teardown analysis of
                physical products, process time studies with standard work methods, material cost databases with real-time pricing, manufacturing
                process simulation, and overhead allocation modeling. This data-driven approach helps companies negotiate better supplier prices,
                validate quotes, benchmark costs, and make informed sourcing decisions for cost-competitive products.
              </p>

              <h3>Why Choose India for Cost Engineering Services?</h3>
              <p>
                India offers world-class engineering talent at competitive rates with global quality standards. EMUSKI's offshore engineering model
                combines UK business consulting with India's technical execution, delivering 40-60% cost savings compared to UK, USA, or German
                engineering rates. Our ISO 9001:2015 certified processes ensure consistent quality, while our UK consulting team provides seamless
                client management. With 15+ years of cost engineering experience, 75+ global clients, and proven 25-45% cost reduction results,
                EMUSKI is the trusted partner for product cost optimization and value engineering services.
              </p>

              <h3>Global Cost Engineering Consulting for UK, USA & Germany</h3>
              <p>
                EMUSKI serves manufacturing companies worldwide with specialized expertise in UK, USA, and German markets. Our engineering consulting
                services include: product cost estimation with detailed breakdowns, VAVE methodology for cost reduction, should cost analysis for
                procurement, DFM optimization for manufacturability, supplier sourcing and negotiation support, and cost reduction roadmap development.
                Contact us at +91-86670-88060 or enquiries@emuski.com to discuss your cost engineering requirements and discover how we can help
                reduce your product costs by 25-45% with ISO certified quality and proven results.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
