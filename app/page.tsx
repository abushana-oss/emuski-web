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
import { TestimonialsSection } from "@/components/TestimonialsSection"
import { ManufacturingNPDSection } from "@/components/ManufacturingNPDSection"

export const metadata: Metadata = {
  title: 'ISO Certified OEM Manufacturing & Precision Engineering | EMUSKI Bangalore',
  description: 'ISO 9001:2015 certified OEM manufacturing and cost engineering partner in Bangalore. CNC machining, injection molding, rapid prototyping, VAVE analysis. Serving automotive, aerospace, medical devices globally.',
  alternates: {
    canonical: 'https://www.emuski.com',
  },
  robots: { index: true, follow: true },
}

export default function Home() {
  return (
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
          <NewsCarousel />
        </LazyRender>

        <LazyRender minHeight="400px">
          <AboutSection />
        </LazyRender>

        <LazyRender minHeight="600px">
          {/* Import and use the redesigned NPD component */}
          <ManufacturingNPDSection />
        </LazyRender>

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
