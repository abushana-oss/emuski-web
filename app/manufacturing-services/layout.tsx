import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OEM Manufacturing Services - CNC Machining, Injection Molding & Rapid Prototyping | EMUSKI',
  description: 'Complete OEM manufacturing services including CNC machining, injection molding, sheet metal fabrication, and rapid prototyping. ISO 9001:2015 certified with 98.7% on-time delivery. From design to delivery, we build what you design with precision and quality.',
  keywords: [
    'OEM manufacturing services',
    'CNC machining Bangalore',
    'injection molding services',
    'rapid prototyping India',
    'sheet metal fabrication',
    'custom manufacturing',
    'contract manufacturing',
    'NPD center',
    'precision manufacturing',
    '3D printing services',
    'assembly services',
    'manufacturing partner',
    'prototype to production',
    'ISO 9001:2015 certified',
    'quality manufacturing',
  ].join(', '),
  authors: [{ name: 'EMUSKI Team', url: 'https://www.emuski.com/about' }],
  creator: 'EMUSKI Manufacturing Solutions',
  publisher: 'EMUSKI Manufacturing Solutions',
  category: 'Manufacturing Services',

  // Canonical URL for SEO
  alternates: {
    canonical: 'https://www.emuski.com/manufacturing-services',
    languages: {
      'en-US': 'https://www.emuski.com/manufacturing-services',
    },
  },

  // Advanced robots directives
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

  // Enhanced OpenGraph for social media
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.emuski.com/manufacturing-services',
    siteName: 'EMUSKI - Manufacturing Excellence',
    title: 'OEM Manufacturing Services - Complete Solutions from Design to Delivery',
    description: 'ISO 9001:2015 certified OEM manufacturing with CNC machining, injection molding, rapid prototyping. 98.7% on-time delivery, 99.5% quality acceptance. Your design, our manufacturing excellence.',
    images: [
      {
        url: 'https://www.emuski.com/manufacturing-services-og.jpg',
        secureUrl: 'https://www.emuski.com/manufacturing-services-og.jpg',
        width: 1200,
        height: 630,
        alt: 'EMUSKI Manufacturing Services - CNC Machining and OEM Solutions',
        type: 'image/jpeg',
      },
    ],
  },

  // Enhanced Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@emuski',
    creator: '@emuski',
    title: 'OEM Manufacturing Services - CNC, Injection Molding & More',
    description: 'Complete OEM manufacturing from design to delivery. CNC machining, injection molding, rapid prototyping. ISO certified with 98.7% on-time delivery.',
    images: [
      {
        url: 'https://www.emuski.com/manufacturing-services-twitter.jpg',
        alt: 'EMUSKI Manufacturing Excellence',
        width: 1200,
        height: 630,
      },
    ],
  },

  // Additional metadata for SEO
  other: {
    'og:locale': 'en_US',
    'og:site_name': 'EMUSKI Manufacturing Solutions',
    'service:type': 'OEM Manufacturing',
    'service:delivery': '98.7% on-time',
    'service:quality': '99.5% acceptance rate',
    'service:certification': 'ISO 9001:2015',
  },
}

export default function ManufacturingServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
