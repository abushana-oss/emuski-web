import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Gallery as GalleryComponent } from "@/components/Gallery"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EMUSKI Component Gallery - Manufacturing Excellence Showcase',
  description: 'Explore EMUSKI\'s comprehensive gallery of precision manufacturing components, engineering solutions, and production excellence. Showcasing automotive, aerospace, and industrial manufacturing capabilities.',
  alternates: {
    canonical: 'https://www.emuski.com/gallery',
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
    title: 'EMUSKI Component Gallery - Manufacturing Excellence',
    description: 'Explore our precision manufacturing gallery showcasing automotive, aerospace, and industrial components.',
    type: 'website',
    url: 'https://www.emuski.com/gallery',
    siteName: 'EMUSKI',
  },
}

export default function Gallery() {
  return (
    <>
      <Navbar />
      <GalleryComponent />
      <Footer />
    </>
  )
}
