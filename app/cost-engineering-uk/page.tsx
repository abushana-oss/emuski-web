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
  PoundSterling,
  Building2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cost Engineering Services UK | VAVE Consulting London | British Engineering Consultancy',
  description: 'Leading cost engineering consultancy serving UK companies. UK-based team + India delivery centre. Reduce product costs 25-45% through VAVE, should cost analysis, DFM. ISO certified. Serving London, Manchester, Birmingham. Save 40-60% vs UK consultancy rates. Call +44 (0) [UK Number] or +91-86670-88060',
  keywords: 'cost engineering services UK, cost engineering consultancy London, engineering consulting UK, VAVE consulting UK, value engineering services UK, should cost analysis UK, product cost estimation UK, cost reduction engineering UK, engineering consultancy London, engineering consultancy Manchester, engineering consultancy Birmingham, offshore engineering services UK, cost engineering London, engineering services UK, British engineering consultancy, UK cost consultancy, engineering consulting firms UK, cost optimisation UK, DFM services UK, design for manufacturing UK, procurement engineering UK, supplier cost negotiation UK, engineering outsourcing UK, cost breakdown analysis UK, teardown analysis UK, engineering consulting rates UK, UK engineering services, manufacturing cost reduction UK, automotive cost engineering UK, aerospace engineering UK, medical device cost optimisation UK, electronics cost reduction UK, UK manufacturing consultancy, cost engineer UK, cost engineering jobs UK, engineering consultant UK, UK offshore engineering, nearshore engineering UK',
  openGraph: {
    title: 'Cost Engineering Services UK | VAVE Consulting & Product Cost Optimisation | London',
    description: 'UK-based cost engineering consultancy with India delivery centre. Reduce product costs 25-45%. Save 40-60% vs UK consultancy rates. Serving London, Manchester, Birmingham, and nationwide.',
    type: 'website',
    url: 'https://www.emuski.com/cost-engineering-uk',
    locale: 'en_GB'
  },
  alternates: {
    canonical: 'https://www.emuski.com/cost-engineering-uk'
  }
}

const faqData = [
  {
    question: "How much do cost engineering services cost in the UK?",
    answer: "Cost engineering services in the UK typically range from £5,000-£50,000+ depending on project scope. Traditional UK consultancies charge £800-£1,500 per day. EMUSKI offers 40-60% savings through our UK consulting team + India delivery model, with rates starting from £400-£600 per day equivalent for comprehensive cost engineering services. Our typical projects: Product cost estimation (£5,000-£20,000), VAVE consulting (£10,000-£50,000), Should cost analysis (£8,000-£35,000), DFM optimization (£7,000-£30,000). Based in London with nationwide UK coverage including Manchester, Birmingham, Leeds, and Scotland."
  },
  {
    question: "What are the best cost engineering consultancies in the UK?",
    answer: "Leading cost engineering consultancies in the UK include EMUSKI (UK team + India delivery for cost savings), major engineering firms in London, Manchester, and Birmingham, and specialized VAVE consulting firms. EMUSKI stands out with: UK-based project management team, ISO 9001:2015 certified processes, proven 25-45% product cost reduction, 40-60% lower rates than UK-only consultancies, experience with UK automotive (Jaguar Land Rover suppliers), aerospace (BAE Systems suppliers), and medical device companies. Our UK consulting team ensures seamless communication while India engineering centre delivers technical excellence at competitive rates."
  },
  {
    question: "How do offshore engineering services work for UK companies?",
    answer: "Offshore engineering services for UK companies work through a proven delivery model: UK-based consulting team for account management and client meetings, India engineering centre (Bangalore) for technical execution during UK business hours overlap, real-time collaboration via MS Teams, Zoom, and secure portals, ISO 9001:2015 certified quality processes matching UK standards, IP protection with UK-compliant NDAs and GDPR compliance, and dedicated UK project managers. EMUSKI serves UK automotive, aerospace, and medical device companies with 98.7% on-time delivery, 25-45% cost reduction results, and 40-60% savings vs UK consultancy rates. Contact our UK team at +91-86670-88060."
  },
  {
    question: "What is VAVE methodology and how does it reduce costs?",
    answer: "VAVE (Value Analysis/Value Engineering) is a systematic methodology that reduces product costs by 25-45% while maintaining or improving quality and functionality. The process includes: functional analysis of design requirements, identification of cost reduction opportunities through design optimization, material substitution, process improvements, supplier sourcing for optimised components, and implementation support with measurable results. EMUSKI's VAVE consulting services help UK manufacturing companies (automotive, aerospace, medical devices) improve margins and competitiveness. Our UK consulting team manages projects while India engineering centre provides technical expertise at competitive rates."
  },
  {
    question: "Can UK companies outsource cost engineering to India?",
    answer: "Yes, UK companies successfully outsource cost engineering to India for 40-60% cost savings while maintaining quality. EMUSKI's model combines UK consulting team for seamless communication with India delivery centre (Bangalore - India's engineering capital) for technical execution. Benefits for UK companies: significant cost savings vs UK consultancies, ISO 9001:2015 certified processes, English-speaking engineers with UK project experience, time zone overlap for real-time collaboration, IP protection with UK-compliant NDAs and GDPR compliance, proven track record with UK automotive, aerospace, and medical device companies. Services include product cost estimation, VAVE consulting, should cost analysis, and DFM optimization."
  },
  {
    question: "Which UK industries benefit most from cost engineering services?",
    answer: "UK industries benefiting from cost engineering services include: Automotive (cost reduction for Jaguar Land Rover, Aston Martin suppliers, component manufacturers), Aerospace & Defence (BAE Systems, Rolls-Royce suppliers, precision components), Medical Devices (regulatory-compliant cost optimization, Class I/II/III devices), Electronics & IoT (consumer electronics, industrial equipment), Industrial Machinery (manufacturing equipment, automation systems), and Consumer Products (white goods, appliances). EMUSKI serves UK companies across these sectors with proven 25-45% cost reduction through VAVE methodology, should cost analysis, and DFM optimization. Our UK consulting team understands British manufacturing challenges and regulations."
  },
  {
    question: "What is should cost analysis and why is it important for UK procurement?",
    answer: "Should cost analysis is critical for UK procurement teams to negotiate better supplier prices and validate quotes. It's an engineering-based method determining realistic product costs by analyzing materials, processes, labour, and overheads. Benefits for UK companies: negotiate better supplier prices with data-driven insights (typically 15-30% savings), validate supplier quotes and prevent overcharging, benchmark costs against UK and global standards, make informed sourcing decisions (UK vs offshore), and set target costs for new products. EMUSKI's cost engineering team performs comprehensive should cost analysis using teardown analysis, process time studies, and UK/global material cost databases. We help UK procurement teams with supplier negotiations and cost reduction strategies."
  },
  {
    question: "How long does a cost engineering project typically take in the UK?",
    answer: "Cost engineering project timelines for UK companies typically are: Product cost estimation (2-3 weeks), VAVE study (4-8 weeks depending on complexity), Should cost analysis (3-6 weeks), DFM optimization (4-8 weeks), and Comprehensive cost reduction programme (3-6 months). EMUSKI delivers projects on UK timelines with 98.7% on-time delivery rate. Our UK consulting team manages project schedules while India engineering centre provides technical execution, often working during UK business hours for real-time collaboration. We accommodate urgent UK client needs with flexible scheduling and dedicated resources."
  },
  {
    question: "Do you have references from UK companies?",
    answer: "Yes, EMUSKI serves UK companies across automotive, aerospace, and medical device sectors with proven results. While client confidentiality prevents naming specific companies, we have delivered: 35% cost reduction for UK automotive component manufacturer, 28% savings for aerospace precision parts supplier serving UK defence, 42% cost optimization for medical device company with MHRA compliance, and 31% reduction for industrial equipment manufacturer in Midlands. Our UK consulting team provides references upon request during initial consultations. We understand UK manufacturing regulations, quality standards (BS EN ISO), and work with UK supply chains. Contact +91-86670-88060 for UK client case studies and references."
  },
  {
    question: "What is the ROI of cost engineering services for UK manufacturers?",
    answer: "ROI for UK manufacturers using cost engineering services typically ranges from 300-800% within 6-12 months. Example: £20,000 VAVE investment delivers £150,000-£200,000 annual savings (750-1000% ROI). EMUSKI's proven results for UK clients: average 32% product cost reduction, £180,000 average annual savings per project, 6-8 month payback period, ongoing savings year-over-year, and improved margins and competitiveness. Additional benefits: reduced supplier costs (15-30%), improved manufacturability, faster time-to-market, and better procurement negotiations. Our UK consulting team provides detailed ROI analysis before project start, with transparent pricing and measurable deliverables. UK companies save 40-60% on consulting fees vs traditional UK consultancies."
  }
]

const services = [
  {
    icon: Calculator,
    title: "Product Cost Estimation",
    description: "Detailed UK cost breakdown analysis with British standards compliance and global supply chain insights"
  },
  {
    icon: TrendingDown,
    title: "VAVE Consulting",
    description: "Value engineering methodology delivering 25-45% cost reduction for UK manufacturing companies"
  },
  {
    icon: FileCheck,
    title: "Should Cost Analysis",
    description: "Engineering-based cost modelling for UK procurement teams and supplier negotiations"
  },
  {
    icon: Target,
    title: "DFM Optimisation",
    description: "Design for manufacturing improvements aligned with UK production capabilities and regulations"
  }
]

const ukLocations = [
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Glasgow",
  "Edinburgh",
  "Bristol",
  "Liverpool"
]

const ukIndustries = [
  "Automotive (JLR, Aston Martin Suppliers)",
  "Aerospace & Defence (BAE Systems, Rolls-Royce)",
  "Medical Devices (MHRA Compliant)",
  "Electronics & IoT",
  "Industrial Machinery",
  "Consumer Products"
]

const benefits = [
  "UK-Based Consulting Team",
  "40-60% Savings vs UK Consultancies",
  "25-45% Product Cost Reduction",
  "ISO 9001:2015 Certified",
  "UK Business Hours Support",
  "GDPR Compliant Operations",
  "British Engineering Standards",
  "98.7% On-Time Delivery"
]

export default function CostEngineeringUKPage() {
  return (
    <>
      {/* FAQ Schema */}
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

      {/* LocalBusiness Schema for UK */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "EMUSKI Cost Engineering Services UK",
            "description": "Leading cost engineering consultancy serving UK companies with VAVE, should cost analysis, and DFM optimization",
            "url": "https://www.emuski.com/cost-engineering-uk",
            "priceRange": "££",
            "areaServed": [
              {"@type": "Country", "name": "United Kingdom"},
              {"@type": "City", "name": "London"},
              {"@type": "City", "name": "Manchester"},
              {"@type": "City", "name": "Birmingham"},
              {"@type": "City", "name": "Leeds"},
              {"@type": "City", "name": "Glasgow"},
              {"@type": "City", "name": "Edinburgh"}
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Cost Engineering Services for UK",
              "itemListElement": services.map(service => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.title,
                  "description": service.description
                }
              }))
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "45",
              "bestRating": "5"
            },
            "makesOffer": {
              "@type": "Offer",
              "priceCurrency": "GBP",
              "price": "5000-50000",
              "description": "Cost engineering services for UK manufacturers"
            }
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
                "name": "Cost Engineering UK",
                "item": "https://www.emuski.com/cost-engineering-uk"
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-emuski-dark to-industrial-dark text-white py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <MapPin className="h-5 w-5 text-emuski-teal-light" />
                <span>Serving UK Companies Nationwide | London, Manchester, Birmingham & Scotland</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Cost Engineering Services UK | VAVE Consulting London
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
                UK-Based Consulting Team + India Delivery Centre | Save 40-60% vs UK Consultancies | Reduce Product Costs 25-45% | ISO Certified
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+918667088060"
                  className="inline-flex items-center gap-2 bg-emuski-teal hover:bg-emuski-teal-light text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Phone className="h-5 w-5" />
                  +91-86670-88060 (UK Team)
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-emuski-teal px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Request UK Consultation
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
                  <div className="text-3xl font-bold text-emuski-teal mb-2">40-60%</div>
                  <div className="text-gray-600">Savings vs UK Rates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">25-45%</div>
                  <div className="text-gray-600">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">45+</div>
                  <div className="text-gray-600">UK Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emuski-teal mb-2">98.7%</div>
                  <div className="text-gray-600">On-Time Delivery</div>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Cost Engineering Services for UK Manufacturers
              </h2>
              <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                British engineering standards compliance with global cost optimization expertise
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

          {/* UK Coverage */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Nationwide UK Coverage
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {ukLocations.map((location, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                    <MapPin className="h-6 w-6 text-emuski-teal mx-auto mb-2" />
                    <span className="font-medium">{location}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* UK Industries */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                UK Industries We Serve
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ukIndustries.map((industry, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-3 hover:shadow-lg transition-shadow duration-300">
                    <Building2 className="h-6 w-6 text-emuski-teal flex-shrink-0" />
                    <span className="font-medium">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose EMUSKI for UK */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why UK Companies Choose EMUSKI
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

          {/* FAQ Section */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions - UK Cost Engineering Services
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
                Save 40-60% on Cost Engineering Services
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                UK consulting team + India engineering excellence = Unbeatable value for British manufacturers
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-emuski-teal-light" />
                  <div className="text-left">
                    <div className="font-semibold">UK Team Contact</div>
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
                Request UK Cost Engineering Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>

          {/* SEO Content */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2>Cost Engineering Services for UK Manufacturing Companies</h2>
              <p>
                EMUSKI is a leading cost engineering consultancy serving UK manufacturing companies across London, Manchester, Birmingham,
                and nationwide. Our unique delivery model combines a UK-based consulting team for seamless communication with an
                ISO 9001:2015 certified engineering centre in Bangalore, India, delivering 40-60% cost savings compared to traditional
                UK consultancies while maintaining British engineering standards and quality.
              </p>

              <h3>Why UK Companies Choose EMUSKI for Cost Engineering</h3>
              <p>
                British manufacturing companies face increasing pressure to reduce costs while maintaining quality and compliance with
                UK regulations. EMUSKI's cost engineering services deliver proven 25-45% product cost reduction through VAVE (Value
                Analysis/Value Engineering) methodology, should cost analysis, and DFM (Design for Manufacturing) optimization. Our
                UK consulting team understands British manufacturing challenges, automotive supply chains (Jaguar Land Rover, Aston Martin),
                aerospace requirements (BAE Systems, Rolls-Royce), and medical device regulations (MHRA compliance).
              </p>

              <h3>VAVE Consulting for UK Manufacturers</h3>
              <p>
                Value engineering and VAVE methodology are critical for UK manufacturers competing in global markets. EMUSKI's VAVE
                consulting services help British companies optimize product designs, reduce material costs, improve manufacturability,
                and maintain quality standards. We work with UK automotive component manufacturers, aerospace precision parts suppliers,
                medical device companies, electronics manufacturers, and industrial equipment producers. Our VAVE studies deliver detailed
                cost breakdown analysis, design optimization recommendations, supplier sourcing strategies, and implementation support
                with measurable ROI typically ranging from 300-800% within 6-12 months.
              </p>

              <h3>Should Cost Analysis for UK Procurement Teams</h3>
              <p>
                UK procurement professionals use should cost analysis to negotiate better supplier prices and validate quotes. EMUSKI's
                engineering-based cost modelling provides detailed breakdowns of materials, processes, labour, and overheads, helping
                UK companies achieve 15-30% supplier cost savings. Our should cost analysis includes teardown studies, process time
                analysis using UK and global manufacturing standards, material cost databases with British and international pricing,
                and comprehensive cost models for supplier negotiations. We support UK procurement teams across automotive, aerospace,
                medical devices, and electronics sectors with data-driven insights for informed sourcing decisions.
              </p>

              <h3>UK-India Delivery Model: Best of Both Worlds</h3>
              <p>
                EMUSKI's unique UK-India delivery model provides British companies with local account management and global engineering
                excellence. Our UK consulting team manages projects, ensures British standards compliance, and provides face-to-face
                meetings in London, Manchester, Birmingham, or client sites. Our ISO 9001:2015 certified engineering centre in Bangalore
                delivers technical execution with experienced cost engineers, VAVE specialists, and DFM experts working during UK business
                hours for real-time collaboration. This model delivers 40-60% cost savings vs UK-only consultancies while maintaining
                quality, IP protection (UK-compliant NDAs, GDPR compliance), and 98.7% on-time delivery rate.
              </p>

              <h3>Contact EMUSKI's UK Cost Engineering Team</h3>
              <p>
                For cost engineering services in London, Manchester, Birmingham, or anywhere in the UK, contact EMUSKI's UK consulting
                team at +91-86670-88060 or enquiries@emuski.com. We provide free initial consultations for UK manufacturing companies,
                detailed ROI analysis, competitive pricing with transparent deliverables, and references from UK automotive, aerospace,
                and medical device clients. Discover how our UK-based team and India engineering excellence can help your British
                manufacturing company reduce costs by 25-45% while maintaining quality and compliance with UK standards.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
