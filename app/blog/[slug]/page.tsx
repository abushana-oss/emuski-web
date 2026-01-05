import { Navbar } from "@/components/Navbar"
import { BlogPostComponent } from "@/components/BlogPost"
import { Footer } from "@/components/Footer"
import { fetchPostBySlug, fetchAllBlogs, generateBlogStaticParams } from "@/lib/api/blogger"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Enable ISR - Revalidate every hour
export const revalidate = 3600

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
        'en-US': `https://www.emuski.com/blog/${slug}`,
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

  // Fetch all posts for related articles
  const { all: allPosts } = await fetchAllBlogs(50);

  // Check if this is a success story
  const isSuccessStory = post.category === 'Case Study' || post.category === 'Success Story';

  // Generate JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://www.emuski.com/blog/${slug}`,
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
      '@type': isSuccessStory ? 'Organization' : 'Person',
      name: post.author,
      ...(isSuccessStory && {
        url: 'https://www.emuski.com',
      }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'EMUSKI Manufacturing Solutions',
      url: 'https://www.emuski.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.emuski.com/logo.png',
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.emuski.com/blog/${slug}`,
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
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
        name: post.title,
        item: `https://www.emuski.com/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="min-h-screen bg-white">
        <Navbar />
        <BlogPostComponent post={post} allPosts={allPosts} />
        <Footer />
      </div>
    </>
  )
}
