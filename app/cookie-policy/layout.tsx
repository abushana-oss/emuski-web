import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | EMUSKI',
  description: 'Learn how EMUSKI uses cookies and similar technologies to enhance user experience, analyze traffic, and personalize services.',
  alternates: {
    canonical: 'https://www.emuski.com/cookie-policy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
