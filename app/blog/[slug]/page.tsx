import { Navbar } from "@/components/Navbar"
import { BlogPostComponent } from "@/components/BlogPost"
import { Footer } from "@/components/Footer"
import { SuccessStoryDetail } from "@/components/SuccessStoryDetail"
import { getSuccessStoryBySlug, getRelatedSuccessStories } from "@/data/successStories"
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

  // Check if it's a success story
  const successStory = getSuccessStoryBySlug(slug);

  if (successStory) {
    return {
      title: `${successStory.title} | Case Study | EMUSKI`,
      description: successStory.excerpt,
      alternates: {
        canonical: `https://www.emuski.com/blog/${slug}`,
      },
      openGraph: {
        title: successStory.title,
        description: successStory.excerpt,
        type: 'article',
        url: `https://www.emuski.com/blog/${slug}`,
        images: [
          {
            url: successStory.heroImage,
            width: 1200,
            height: 630,
            alt: successStory.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: successStory.title,
        description: successStory.excerpt,
        images: [successStory.heroImage],
      },
    };
  }

  // For regular blog posts, fetch from server
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
  const seoTitle = `${post.title} | EMUSKI Blog - Manufacturing Excellence Guide`;

  return {
    title: seoTitle,
    description: metaDescription,
    keywords: post.tags.join(', '),
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

  // Check if it's a success story
  const successStory = getSuccessStoryBySlug(slug);

  if (successStory) {
    const relatedStories = getRelatedSuccessStories(successStory.id, successStory.relatedStories);
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <SuccessStoryDetail story={successStory} relatedStories={relatedStories} />
        <Footer />
      </div>
    );
  }

  // Fetch blog post from server
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch all posts for related articles
  const { all: allPosts } = await fetchAllBlogs(50);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BlogPostComponent post={post} allPosts={allPosts} />
      <Footer />
    </div>
  )
}
