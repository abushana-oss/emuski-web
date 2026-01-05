import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precision Engineering Services - Cost Estimation, VAVE Analysis & Strategic Sourcing | EMUSKI',
  description: 'Expert precision engineering services to reduce manufacturing costs by 15-25%. Product cost estimation with ±5% accuracy, VAVE teardown analysis achieving 20-30% savings, strategic sourcing from 500+ verified suppliers, and engineering support. Advanced cost modeling through Cost 360 platform.',
  keywords: [
    'precision engineering services',
    'product cost estimation',
    'VAVE analysis',
    'value engineering',
    'teardown analysis',
    'strategic sourcing',
    'cost reduction',
    'manufacturing cost optimization',
    'should-cost analysis',
    'design benchmarking',
    'cost modeling',
    'engineering support',
    'supplier sourcing',
    'cost 360 platform',
    'manufacturing engineering',
  ].join(', '),
  authors: [{ name: 'EMUSKI Team', url: 'https://www.emuski.com/about' }],
  creator: 'EMUSKI Manufacturing Solutions',
  publisher: 'EMUSKI Manufacturing Solutions',
  category: 'Precision Engineering',

  // Canonical URL for SEO
  alternates: {
    canonical: 'https://www.emuski.com/precision-engineering',
    languages: {
      'en-US': 'https://www.emuski.com/precision-engineering',
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
    url: 'https://www.emuski.com/precision-engineering',
    siteName: 'EMUSKI - Manufacturing Excellence',
    title: 'Precision Engineering - Cost Estimation, VAVE & Strategic Sourcing',
    description: 'Reduce manufacturing costs by 15-25% through expert engineering services. Cost estimation (±5% accuracy), VAVE analysis (20-30% savings), strategic sourcing (500+ suppliers), and engineering support.',
    images: [
      {
        url: 'https://www.emuski.com/precision-engineering-og.jpg',
        secureUrl: 'https://www.emuski.com/precision-engineering-og.jpg',
        width: 1200,
        height: 630,
        alt: 'EMUSKI Precision Engineering Services - Cost Optimization and VAVE',
        type: 'image/jpeg',
      },
    ],
  },

  // Enhanced Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@emuski',
    creator: '@emuski',
    title: 'Precision Engineering - Reduce Manufacturing Costs 15-25%',
    description: 'Expert cost estimation, VAVE analysis, and strategic sourcing services. Advanced engineering solutions for manufacturing cost optimization.',
    images: [
      {
        url: 'https://www.emuski.com/precision-engineering-twitter.jpg',
        alt: 'EMUSKI Engineering Excellence',
        width: 1200,
        height: 630,
      },
    ],
  },

  // Additional metadata for SEO
  other: {
    'og:locale': 'en_US',
    'og:site_name': 'EMUSKI Manufacturing Solutions',
    'service:type': 'Precision Engineering',
    'service:cost_reduction': '15-25% average',
    'service:accuracy': '±5% cost estimation',
    'service:vave_savings': '20-30% cost reduction',
    'service:supplier_network': '500+ verified suppliers',
  },
}

export default function PrecisionEngineeringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
