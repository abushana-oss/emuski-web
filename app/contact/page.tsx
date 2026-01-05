import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Contact as ContactComponent } from "@/components/Contact"
import { FAQSection } from "@/components/FAQSection"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact EMUSKI | Get In Touch - Manufacturing Solutions',
  description: 'Contact EMUSKI for manufacturing solutions. Speak with our experts about your OEM manufacturing, precision engineering, and AI-powered production needs.',
  alternates: {
    canonical: 'https://www.emuski.com/contact',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Contact EMUSKI - Manufacturing Solutions',
    description: 'Get in touch with EMUSKI for expert manufacturing and engineering solutions.',
    type: 'website',
    url: 'https://www.emuski.com/contact',
    siteName: 'EMUSKI',
  },
}

export default function Contact() {
  return (
    <>
      <Navbar />
      <ContactComponent />
      <FAQSection
        compact={true}
        maxItems={6}
        showCategories={false}
        usePageSpecific={true}
      />
      <Footer />
    </>
  )
}
