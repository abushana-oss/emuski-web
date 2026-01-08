import { Navbar } from "@/components/Navbar"
import { BlogPage } from "@/components/BlogPage"
import { Footer } from "@/components/Footer"
import { Metadata } from 'next'
import { fetchAllBlogs } from '@/lib/api/blogger'

// Enable ISR - Revalidate every 5 minutes for near real-time blog updates
// Combined with webhook endpoint at /api/blogger-webhook for instant updates
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Manufacturing & Precision Engineering Blog | Expert Insights | EMUSKI',
  description: 'Discover expert insights on manufacturing excellence, precision engineering, cost optimization, VAVE methodology, value engineering, and AI-powered solutions. Learn from industry leaders about DFM/DFA, strategic sourcing, rapid prototyping, and intelligent manufacturing.',
  keywords: 'manufacturing blog, precision engineering blog, cost optimization, VAVE methodology, value engineering, rapid prototyping, strategic sourcing, DFM DFA, AI manufacturing, industrial engineering, OEM manufacturing, precision engineering India, manufacturing cost reduction, engineering excellence, cost estimation',
  alternates: {
    canonical: 'https://www.emuski.com/blog',
  },
  openGraph: {
    title: 'Manufacturing & Precision Engineering Blog | Expert Insights',
    description: 'Expert insights on manufacturing excellence, precision engineering, cost optimization, VAVE methodology, value engineering, rapid prototyping, and AI-powered solutions from EMUSKI.',
    type: 'website',
    url: 'https://www.emuski.com/blog',
    siteName: 'EMUSKI Manufacturing Solutions',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manufacturing & Precision Engineering Blog | EMUSKI',
    description: 'Expert insights on manufacturing excellence, precision engineering, and cost optimization.',
  },
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
}

export default async function Blog() {
  // Server-side data fetching with caching - now fetches ALL posts automatically
  const { manufacturing, engineering, all } = await fetchAllBlogs(true)

  // Generate enhanced Blog structured data for 2026 SEO best practices
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://www.emuski.com/blog#blog',
    url: 'https://www.emuski.com/blog',
    name: 'EMUSKI Manufacturing & Engineering Blog',
    description: 'Expert insights on manufacturing excellence, precision engineering, cost optimization, VAVE methodology, rapid prototyping, and AI-powered solutions. Industry-leading content on manufacturing processes and engineering innovations.',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.emuski.com/#organization',
      name: 'EMUSKI Manufacturing Solutions',
      url: 'https://www.emuski.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.emuski.com/logo.jpg',
        width: 600,
        height: 60,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9875206877',
        contactType: 'Customer Service',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    },
    blogPost: all.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      '@id': `https://www.emuski.com/blog/${post.slug}`,
      url: `https://www.emuski.com/blog/${post.slug}`,
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.publishDate,
      dateModified: post.publishDate,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      publisher: {
        '@id': 'https://www.emuski.com/#organization',
      },
    })),
  };

  // Generate Engineering Blog Schema for Precision Engineering section
  const engineeringBlogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://www.emuski.com/blog#engineering-blog',
    url: 'https://www.emuski.com/blog',
    name: 'EMUSKI Precision Engineering Blog',
    description: 'Expert insights on precision engineering, cost optimization, VAVE methodology, value engineering, DFM/DFA, strategic sourcing, and manufacturing excellence from industry-leading engineers.',
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: 'Precision Engineering',
      description: 'Advanced engineering practices for cost optimization, value engineering, and manufacturing efficiency',
    },
    keywords: 'precision engineering, cost optimization, VAVE, value engineering, DFM, DFA, strategic sourcing, manufacturing engineering, cost estimation, engineering excellence',
    publisher: {
      '@id': 'https://www.emuski.com/#organization',
    },
    blogPost: engineering.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      '@id': `https://www.emuski.com/blog/${post.slug}`,
      url: `https://www.emuski.com/blog/${post.slug}`,
      headline: post.title,
      description: post.excerpt,
      image: {
        '@type': 'ImageObject',
        url: post.image,
        width: 1200,
        height: 630,
      },
      datePublished: post.publishDate,
      dateModified: post.publishDate,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: 'Engineering Expert',
      },
      publisher: {
        '@id': 'https://www.emuski.com/#organization',
      },
      articleSection: 'Precision Engineering',
      keywords: post.tags?.join(', '),
    })),
  };

  // Generate CollectionPage structured data for blog listing
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://www.emuski.com/blog#collectionpage',
    url: 'https://www.emuski.com/blog',
    name: 'Manufacturing Blog | Engineering Insights & AI Innovation',
    description: 'Expert insights on manufacturing excellence, Engineering Innovations, and AI-powered solutions',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://www.emuski.com/#website',
      url: 'https://www.emuski.com',
      name: 'EMUSKI Manufacturing Solutions',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.emuski.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://www.emuski.com/blog',
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: all.length,
      itemListElement: all.slice(0, 20).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.emuski.com/blog/${post.slug}`,
        name: post.title,
        item: {
          '@type': 'BlogPosting',
          '@id': `https://www.emuski.com/blog/${post.slug}`,
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.publishDate,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Schema Markup for Blog Listing - 2026 SEO Best Practices */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(engineeringBlogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <Navbar />
      <BlogPage
        manufacturingPosts={manufacturing}
        engineeringPosts={engineering}
      />
      <Footer />
    </div>
  )
}
