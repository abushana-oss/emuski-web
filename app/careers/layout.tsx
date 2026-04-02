import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Careers at EMUSKI - Engineering Jobs in Manufacturing & AI',
    template: '%s | EMUSKI Careers'
  },
  description: 'Join EMUSKI\'s global team of engineers and innovators. Open positions in AI, manufacturing, cost engineering, and software development across Bangalore, Hyderabad, and remote locations.',
  metadataBase: new URL('https://careers.emuski.com'),
  alternates: {
    canonical: 'https://careers.emuski.com',
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
  },
}

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Additional SEO meta tags for careers subdomain */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Structured data breadcrumbs */}
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
                "name": "EMUSKI",
                "item": "https://www.emuski.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Careers",
                "item": "https://careers.emuski.com"
              }
            ]
          })
        }}
      />
      
      {children}
    </>
  )
}