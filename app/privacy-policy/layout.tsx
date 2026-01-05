import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy – How EMUSKI Protects Your Data',
  description: 'Learn how EMUSKI collects, uses, and protects your personal and business information. Your privacy and security are our top priority.',
  alternates: {
    canonical: 'https://www.emuski.com/privacy-policy',
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

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
