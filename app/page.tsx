import { Metadata } from 'next'
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
import { ManufacturingNPDSection } from "@/components/ManufacturingNPDSection"
import { fetchAllBlogs } from "@/lib/api/blogger"

export const metadata: Metadata = {
  title: 'ISO Certified OEM Manufacturing & Precision Engineering | EMUSKI Bangalore',
  description: 'ISO 9001:2015 certified OEM manufacturing and cost engineering partner in Bangalore. CNC machining, injection molding, rapid prototyping, VAVE analysis.',
  alternates: {
    canonical: 'https://www.emuski.com',
    languages: {
      'en-US': 'https://www.emuski.com',
      'en-GB': 'https://www.emuski.com',
      'en-IN': 'https://www.emuski.com',
      'en': 'https://www.emuski.com',
      'x-default': 'https://www.emuski.com',
    },
  },
  robots: { index: true, follow: true },
}

export default async function Home() {
  const { successStories } = await fetchAllBlogs()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['Organization', 'LocalBusiness'],
          name: 'EMUSKI',
          url: 'https://www.emuski.com',
          logo: 'https://www.emuski.com/logo.webp',
          description: 'ISO 9001:2015 certified OEM precision manufacturing and cost engineering partner in Bangalore, India',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '126, RNS Plaza, Electronic City Phase 2',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
          },
          telephone: '+91-86670-88060',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 12.8456,
            longitude: 77.6603,
          },
          sameAs: [
            'https://www.linkedin.com/company/emuski',
            'https://www.indiamart.com/emuski',
          ],
        }) }}
      />
      <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <h1 className="sr-only">
          EMUSKI – ISO Certified OEM Manufacturing, Precision Engineering & AI Solutions in Bangalore, India | Top Manufacturers Electronic City Karnataka
        </h1>
        <HeroSection />

        <LazyRender minHeight="500px">
          <ServicesShowcase />
        </LazyRender>

        <LazyRender minHeight="300px">
          <NewsCarousel initialPosts={successStories} />
        </LazyRender>

        <LazyRender minHeight="400px">
          <AboutSection />
        </LazyRender>

        <LazyRender minHeight="600px">
          {/* Import and use the redesigned NPD component */}
          <ManufacturingNPDSection />
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
    </>
  )
}
