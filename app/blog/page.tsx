import { Navbar } from "@/components/Navbar"
import { BlogPage } from "@/components/BlogPage"
import { Footer } from "@/components/Footer"
import { Metadata } from 'next'
import { fetchAllBlogs } from '@/lib/api/blogger'

// Enable ISR - Revalidate every hour instead of force-dynamic
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Manufacturing Blog | Engineering Insights & AI Innovation | EMUSKI',
  description: 'Discover expert insights on manufacturing excellence, Engineering Innovations, and AI-powered solutions. Learn from industry leaders about cost optimization, VAVE, rapid prototyping, and intelligent manufacturing.',
  keywords: 'manufacturing blog, engineering precision, cost optimization, VAVE methodology, rapid prototyping, strategic sourcing, AI manufacturing, industrial engineering, OEM manufacturing, precision engineering India, manufacturing cost reduction',
  alternates: {
    canonical: 'https://www.emuski.com/blog',
  },
  openGraph: {
    title: 'Manufacturing Blog | Engineering Insights & AI Innovation',
    description: 'Expert insights on manufacturing excellence, cost optimization, VAVE, rapid prototyping, and AI-powered solutions from EMUSKI.',
    type: 'website',
    url: 'https://www.emuski.com/blog',
    siteName: 'EMUSKI',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manufacturing Blog | EMUSKI',
    description: 'Expert insights on manufacturing excellence and AI innovation.',
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
}

export default async function Blog() {
  // Server-side data fetching with caching
  const { manufacturing, engineering } = await fetchAllBlogs(50)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogPage
        manufacturingPosts={manufacturing}
        engineeringPosts={engineering}
      />
      <Footer />
    </div>
  )
}
