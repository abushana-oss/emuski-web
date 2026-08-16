import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read the Terms & Conditions governing the use of EMUSKI platforms, services, and AI solutions.',
  alternates: {
    canonical: 'https://www.emuski.com/terms-and-conditions',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
