import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import {
  Factory,
  Settings,
  Zap,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  Building2,
  Cog,
  Package
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'ISO Certified Manufacturer in Bangalore | Top Manufacturing Companies Karnataka',
  description: 'ISO 9001:2015 certified manufacturers in Bangalore. Leading manufacturing company offering OEM manufacturing, precision engineering, rapid prototyping, and custom manufacturing solutions. 15+ years experience serving automotive, aerospace, electronics. Contact +91-86670-88060',
  keywords: 'manufacturers in bangalore, manufacturing in bangalore, ISO certified manufacturers bangalore, manufacturing companies in bangalore, manufacturers in bangalore list, top manufacturers in bangalore, ISO 9001:2015 certified manufacturing bangalore, OEM manufacturers bangalore, precision engineering manufacturers bangalore, custom manufacturers bangalore, manufacturing industries bangalore, wholesale manufacturers bangalore, top 100 manufacturers in bangalore, manufacturers in bangalore with contact details, best manufacturers in bangalore, manufacturers in electronic city bangalore, manufacturers in bangalore Karnataka',
  openGraph: {
    title: 'ISO 9001:2015 Certified Manufacturers in Bangalore | EMUSKI - Top OEM Manufacturing',
    description: 'EMUSKI - ISO certified manufacturer in Electronic City, Bangalore. Leading manufacturing company specializing in OEM manufacturing, precision engineering, rapid prototyping for automotive, aerospace & electronics. 15+ years experience.',
    type: 'website',
    url: 'https://www.emuski.com/manufacturing-in-bangalore',
  },
  alternates: {
    canonical: 'https://www.emuski.com/manufacturing-in-bangalore'
  },
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Bangalore, Karnataka, India',
    'geo.position': '12.9716;77.5946',
  }
}

const faqData = [
  {
    question: "Which products are manufactured in Bangalore?",
    answer: "Bangalore manufactures a wide range of products including automotive components (engine parts, transmission systems, chassis components), aerospace parts (precision machined components, aircraft fittings), medical devices (surgical instruments, diagnostic equipment), electronics (PCBs, consumer electronics), defense equipment, and space technology components. EMUSKI specializes in precision-engineered OEM manufacturing for these industries with ISO 9001:2015 certification."
  },
  {
    question: "What are the top manufacturers in Bangalore?",
    answer: "Bangalore is home to leading ISO certified manufacturers across various sectors. EMUSKI is a prominent ISO 9001:2015 certified manufacturer specializing in OEM manufacturing, precision engineering, rapid prototyping, and custom manufacturing solutions. We are located in Electronic City Phase 2 with 15+ years of experience serving automotive, aerospace, electronics, and medical device industries. Contact EMUSKI at +91-86670-88060 for reliable manufacturing services."
  },
  {
    question: "Which are the ISO certified manufacturer in Bangalore?",
    answer: "ISO certified manufacturer in Bangalore maintain international quality standards like ISO 9001:2015, ISO 14001, and ISO 45001. EMUSKI is an ISO 9001:2015 certified manufacturer in Electronic City, Bangalore, offering precision engineering, CNC machining, injection molding, and rapid prototyping services. We serve automotive, aerospace, medical devices, and electronics sectors with proven quality management systems and 75+ satisfied global clients."
  },
  {
    question: "What are the top 5 manufacturing companies in Bangalore?",
    answer: "Bangalore hosts many leading manufacturing companies across various sectors. EMUSKI is a prominent ISO certified OEM manufacturing company specializing in precision engineering, rapid prototyping, and custom manufacturing solutions. Other notable sectors include automotive manufacturing, aerospace components, electronics manufacturing, and medical device production. For specific manufacturing needs in Bangalore, contact EMUSKI at +91-86670-88060."
  },
  {
    question: "Which are the MNC companies in Bangalore for manufacturing?",
    answer: "Bangalore hosts numerous multinational manufacturing companies in sectors like automotive (Bosch, Toyota), aerospace (Boeing, Airbus suppliers), electronics (Intel, Texas Instruments), and industrial equipment. EMUSKI serves as an ISO certified OEM manufacturing partner to many MNCs, providing precision engineering, cost optimization through VAVE methodology, and AI-powered manufacturing solutions with global quality standards and certifications."
  },
  {
    question: "Where can I find list of manufacturers in Bangalore with contact details?",
    answer: "To find reliable ISO certified manufacturer in Bangalore, look for manufacturers with proven track records and international certifications. EMUSKI Manufacturing Solutions is an ISO 9001:2015 certified manufacturer located at 126, RNS Plaza, KIADB Industrial Area, Electronic City Phase 2, Bangalore 560100. Contact: +91-86670-88060, Email: enquiries@emuski.com. We offer OEM manufacturing, precision engineering, rapid prototyping, and custom manufacturing services with transparent pricing and quality assurance."
  },
  {
    question: "What manufacturing services are available in Bangalore?",
    answer: "Bangalore manufacturers offer comprehensive services including CNC machining, injection molding, sheet metal fabrication, rapid prototyping, precision engineering, assembly services, quality testing, and design-for-manufacturing (DFM). EMUSKI is an ISO certified manufacturer providing end-to-end OEM manufacturing solutions with expertise in automotive, aerospace, medical devices, and electronics manufacturing, along with AI-powered cost optimization and VAVE methodology."
  },
  {
    question: "Which are the top 100 manufacturers in Bangalore?",
    answer: "Bangalore's top manufacturers span automotive, aerospace, electronics, and engineering sectors. EMUSKI ranks among leading ISO certified manufacturers with 15+ years of experience, ISO 9001:2015 certification, serving 75+ global clients. We specialize in precision engineering, rapid prototyping, custom manufacturing, CNC machining, injection molding, and AI-powered production solutions. Located in Electronic City Phase 2, EMUSKI offers world-class manufacturing services for diverse industries."
  }
]

const services = [
  {
    icon: Factory,
    title: "OEM Manufacturing",
    description: "Custom OEM manufacturing solutions for automotive, aerospace, and electronics with 15-25% cost optimization"
  },
  {
    icon: Settings,
    title: "Precision Engineering",
    description: "High-precision CNC machining, injection molding, and sheet metal fabrication with micron-level accuracy"
  },
  {
    icon: Zap,
    title: "Rapid Prototyping",
    description: "Fast-turnaround prototyping services for product development and design validation"
  },
  {
    icon: Cog,
    title: "Custom Manufacturing",
    description: "Tailored manufacturing solutions for unique product requirements and specifications"
  }
]

const industries = [
  "Automotive Manufacturing",
  "Aerospace Components",
  "Medical Device Manufacturing",
  "Electronics Manufacturing",
  "Defense & Space Technology",
  "Industrial Equipment"
]

const whyChooseUs = [
  "ISO 9001:2015 Certified Manufacturing",
  "15+ Years Manufacturing Experience",
  "75+ Global Clients Served",
  "Located in Electronic City, Bangalore",
  "AI-Powered Cost Optimization",
  "VAVE Methodology Expertise",
  "Design-for-Manufacturing (DFM)",
  "Quality Assurance & Testing"
]

export default function ManufacturingInBangalorePage() {
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
                "name": "Manufacturing in Bangalore",
                "item": "https://www.emuski.com/manufacturing-in-bangalore"
              }
            ]
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Manufacturing Services",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EMUSKI",
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
              "email": "enquiries@emuski.com"
            },
            "areaServed": {
              "@type": "City",
              "name": "Bangalore"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Manufacturing Services in Bangalore",
              "itemListElement": services.map(service => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.title,
                  "description": service.description
                }
              }))
            }
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
              <MapPin className="h-5 w-5 text-emuski-teal-light" />
              <span>Electronic City Phase 2, Bangalore, Karnataka</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ISO 9001:2015 Certified Manufacturers in Bangalore
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
              Leading ISO Certified Manufacturing Company | OEM Manufacturing, Precision Engineering & Rapid Prototyping Services in Bangalore, Karnataka
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
                Get Quote
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
                <div className="text-3xl font-bold text-emuski-teal mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing Services */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ISO Certified Manufacturers & Manufacturing Services in Bangalore
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              ISO 9001:2015 certified OEM manufacturers providing comprehensive manufacturing solutions for automotive, aerospace, medical devices, and electronics industries
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
                  Ready to Start Your Manufacturing Project?
                </h3>
                <p className="text-lg text-gray-800">
                  Explore our comprehensive services or get in touch with our team today
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

        {/* Industries Served */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Industries We Serve in Bangalore
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-3 hover:shadow-lg transition-shadow duration-300">
                  <Building2 className="h-6 w-6 text-emuski-teal flex-shrink-0" />
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
              Why Choose EMUSKI - ISO Certified Manufacturer in Bangalore?
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

        {/* FAQ Section - People Also Ask */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions About Manufacturers & Manufacturing in Bangalore
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

        {/* Location & Contact */}
        <section className="py-16 px-4 bg-gradient-to-r from-emuski-dark to-industrial-dark text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Visit Our Manufacturing Facility in Bangalore
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-emuski-teal-light" />
                <div className="text-left">
                  <div className="font-semibold">Address</div>
                  <div className="text-gray-300">126, RNS Plaza, KIADB Industrial Area</div>
                  <div className="text-gray-300">Electronic City Phase 2, Bangalore 560100</div>
                </div>
              </div>
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
              Request a Quote
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* SEO Content Block */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>ISO Certified Manufacturer in Bangalore</h2>
            <p>
              Bangalore, also known as Bengaluru, is the manufacturing hub of Karnataka and home to leading ISO certified manufacturers.
              The city hosts numerous top manufacturers and manufacturing companies specializing in automotive, aerospace, electronics, medical devices,
              and precision engineering. With a strong ecosystem of skilled labor, advanced infrastructure, and proximity to major ports,
              Bangalore has emerged as a preferred destination for ISO certified OEM manufacturers and custom manufacturing solutions.
            </p>

            <h3>Top ISO Certified Manufacturer in Bangalore</h3>
            <p>
              EMUSKI stands among the top ISO certified manufacturer in Bangalore, offering comprehensive OEM manufacturing services with
              ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certifications. As a leading manufacturer located in Electronic City Phase 2,
              we specialize in precision engineering, rapid prototyping, CNC machining, injection molding, and sheet metal fabrication.
              Our ISO certified state-of-the-art manufacturing facility serves industries including automotive, aerospace, medical devices,
              electronics, and defense sectors with international quality standards.
            </p>

            <h3>List of Manufacturers in Bangalore - Why Choose ISO Certified</h3>
            <p>
              When searching for manufacturers in Bangalore or a list of manufacturing companies, ISO certification is crucial for quality assurance.
              The manufacturing landscape in Bangalore encompasses diverse sectors. From wholesale manufacturers to specialized precision
              engineering manufacturers, the city offers complete solutions. EMUSKI is an ISO 9001:2015 certified manufacturer providing
              end-to-end services including design-for-manufacturing (DFM), VAVE methodology for cost optimization, strategic sourcing,
              and AI-powered production intelligence. Our ISO certified expertise spans custom manufacturing, rapid prototyping, and volume
              production with consistent quality assurance meeting international standards.
            </p>

            <h3>Contact ISO Certified Manufacturer in Bangalore with Details</h3>
            <p>
              For reliable ISO certified manufacturer in Bangalore with proven track records and contact details, reach EMUSKI at +91-86670-88060 or
              email enquiries@emuski.com. As a leading ISO 9001:2015 certified manufacturer, we offer transparent pricing, quality assurance,
              and comprehensive manufacturing solutions tailored to your specific requirements. Visit our ISO certified manufacturing facility
              at Electronic City Phase 2, Bangalore 560100 to discuss your manufacturing needs and see our certifications.
            </p>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
