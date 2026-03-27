import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next-GenAI | EMUSKI',
  description: 'Revolutionary AI-powered intelligence transforming product development, cost engineering, and supply chain optimization in manufacturing.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  alternates: {
    canonical: 'https://www.emuski.com/solutions/ai',
  },
}

export default function AISolutionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
