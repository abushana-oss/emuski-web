import { Navbar } from "@/components/Navbar"
import { BlogPostComponent } from "@/components/BlogPost"
import { Footer } from "@/components/Footer"
import { fetchPostBySlug, fetchAllBlogs, generateBlogStaticParams } from "@/lib/api/blogger"
import { getCSPNonce } from "@/lib/csp-nonce"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Enable ISR - Revalidate every 5 minutes for near real-time updates
// Combined with webhook endpoint at /api/blogger-webhook for instant updates
export const revalidate = 300

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  return generateBlogStaticParams()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Fetch blog post from server (includes success stories from Blogger)
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | EMUSKI',
      description: 'The requested blog post could not be found.',
    };
  }

  // ADVANCED SEO: Optimize meta description for maximum click-through rate
  // Google displays 150-160 chars on desktop, 120 on mobile
  const metaDescription = post.metaDescription && post.metaDescription.length > 160
    ? post.metaDescription.substring(0, 157) + '...'
    : (post.metaDescription || post.excerpt);

  // OG description can be longer (200 chars max for best display)
  const ogDescription = post.metaDescription && post.metaDescription.length > 200
    ? post.metaDescription.substring(0, 197) + '...'
    : (post.metaDescription || post.excerpt);

  // Enhanced title with power words for better CTR
  const isSuccessStory = post.category === 'Case Study' || post.category === 'Success Story';
  const seoTitle = isSuccessStory
    ? `${post.title} | Manufacturing Success Story | EMUSKI`
    : `${post.title} | EMUSKI Blog - Manufacturing Excellence Guide`;

  // Enhanced keywords for success stories
  const keywords = isSuccessStory
    ? [
        'manufacturing success story',
        'case study',
        'precision manufacturing',
        'rapid production',
        'quality manufacturing',
        'OEM manufacturing',
        ...(post.tags || [])
      ]
    : post.tags || [];

  return {
    title: seoTitle,
    description: metaDescription,
    keywords: keywords.join(', '),
    authors: [{ name: post.author, url: 'https://www.emuski.com/about' }],
    creator: post.author,
    publisher: 'EMUSKI Manufacturing Solutions',
    category: post.category,

    // Canonical URL - Critical for SEO
    alternates: {
      canonical: `https://www.emuski.com/blog/${slug}`,
      languages: {
        'x-default': `https://www.emuski.com/blog/${slug}`,
        'en-US': `https://www.emuski.com/blog/${slug}`,
        'en': `https://www.emuski.com/blog/${slug}`,
      },
    },

    // Advanced robots directives for maximum indexing
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
      title: post.title,
      description: ogDescription,
      type: 'article',
      locale: 'en_US',
      url: `https://www.emuski.com/blog/${slug}`,
      siteName: 'EMUSKI - Manufacturing Excellence',
      publishedTime: post.publishDate,
      modifiedTime: post.publishDate,
      expirationTime: undefined, // Article doesn't expire
      section: post.category,
      tags: post.tags,
      authors: [post.author],
      images: [
        {
          url: post.image,
          secureUrl: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg',
        },
      ],
    },

    // Enhanced Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: '@emuski',
      creator: '@emuski',
      title: post.title,
      description: metaDescription,
      images: [
        {
          url: post.image,
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ],
    },

    // Additional metadata for SEO
    other: {
      'article:publisher': 'https://www.emuski.com',
      'article:author': post.author,
      'article:section': post.category,
      'article:tag': post.tags.join(', '),
      'article:published_time': post.publishDate,
      'article:modified_time': post.publishDate,
      'og:locale': 'en_US',
      'og:site_name': 'EMUSKI Manufacturing Solutions',
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch blog post from server (includes success stories)
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch all posts for related articles - now fetches ALL posts automatically
  const { all: allPosts } = await fetchAllBlogs(true);
  
  // Get CSP nonce for inline scripts
  const nonce = await getCSPNonce();

  // Check if this is a success story
  const isSuccessStory = post.category === 'Case Study' || post.category === 'Success Story';

  // Calculate word count for enhanced schema
  const textContent = post.fullContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(/\s+/).length;

  // Generate JSON-LD structured data with enhanced SEO properties
  // Using BlogPosting type (more specific than Article) for better SEO in 2026
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://www.emuski.com/blog/${slug}`,
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: post.image,
      width: 1200,
      height: 630,
      caption: post.title,
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      '@type': isSuccessStory ? 'Organization' : 'Person',
      name: post.author,
      ...(isSuccessStory && {
        url: 'https://www.emuski.com',
      }),
      ...(!isSuccessStory && {
        jobTitle: 'Manufacturing Expert',
      }),
    },
    publisher: {
      '@type': 'Organization',
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
      sameAs: [
        'https://www.linkedin.com/company/emuski',
        'https://twitter.com/emuski',
      ],
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.emuski.com/blog/${slug}`,
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    wordCount: wordCount,
    timeRequired: post.readTime,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.blog-title', '.blog-excerpt', '.blog-content'],
    },
    ...(isSuccessStory && {
      about: {
        '@type': 'Thing',
        name: 'Manufacturing Success Story',
        description: post.excerpt,
      },
    }),
  };

  // Generate BreadcrumbList structured data
  const breadcrumbData = {
    '@context': 'https://schema.org',
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
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category,
        item: `https://www.emuski.com/blog?category=${post.category.toLowerCase().replace(/\s+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `https://www.emuski.com/blog/${slug}`,
      },
    ],
  };

  // Generate Organization structured data for brand recognition
  const organizationData = {
    '@context': 'https://schema.org',
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
    description: 'Leading precision manufacturing and engineering solutions provider specializing in rapid prototyping, VAVE, and AI-powered manufacturing',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9875206877',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [
      'https://www.linkedin.com/company/emuski',
      'https://twitter.com/emuski',
    ],
  };

  // Generate WebPage structured data
  const webPageData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://www.emuski.com/blog/${slug}`,
    url: `https://www.emuski.com/blog/${slug}`,
    name: post.title,
    description: post.excerpt,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://www.emuski.com/#website',
      url: 'https://www.emuski.com',
      name: 'EMUSKI Manufacturing Solutions',
      publisher: {
        '@id': 'https://www.emuski.com/#organization',
      },
    },
    breadcrumb: {
      '@id': `https://www.emuski.com/blog/${slug}#breadcrumb`,
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: [`https://www.emuski.com/blog/${slug}`],
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: post.image,
    },
  };

  return (
    <>
      {/* Enhanced Schema Markup for Maximum SEO Impact */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageData) }}
      />
      <div className="min-h-screen bg-white">
        <Navbar />
        <BlogPostComponent post={post} allPosts={allPosts} />
        <Footer />
      </div>
    </>
  )
}
