'use client'

import { useState, useEffect, useCallback } from 'react'

// Blog configuration
const BLOG_CONFIG = {
  manufacturing: '3331639473149657933',
  engineering: '3127439607261561130', 
  successStories: '850833685312209325'
} as const

type BlogType = keyof typeof BLOG_CONFIG

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  fullContent: string
  category: string
  tags: string[]
  author: string
  authorImage: string
  publishDate: string
  readTime: string
  image: string
}

interface UseBlogDataOptions {
  maxResults?: number
  label?: string
}

interface UseBlogDataResult {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Unified blog data hook that replaces all duplicate blog fetching hooks
 * Follows DRY principles and industry standards
 */
export const useBlogData = (
  blogType: BlogType,
  options: UseBlogDataOptions = {}
): UseBlogDataResult => {
  const { maxResults = 10, label } = options
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    const blogId = BLOG_CONFIG[blogType]
    
    if (!blogId) {
      setError(`Blog type "${blogType}" is not configured`)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Build API URL with parameters
      const params = new URLSearchParams({
        blogId,
        maxResults: maxResults.toString()
      })
      
      if (label) {
        params.append('label', label)
      }

      const response = await fetch(`/api/blog?${params}`, {
        next: { revalidate: 300 } // Cache for 5 minutes
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${blogType} blog posts`)
      }
      
      const data = await response.json()

      if (data?.items && Array.isArray(data.items)) {
        const convertedPosts = data.items.map((item: any) => 
          convertBloggerPostToLocalFormat(item, getBlogCategoryName(blogType))
        )
        setPosts(convertedPosts)
      } else {
        setPosts([])
      }
    } catch (err: any) {
      // Log error but don't show to user for optional blogs
      console.error(`Error fetching ${blogType} blog posts:`, err)
      setError(null) // Don't break UI for optional blogs
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [blogType, maxResults, label])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return { posts, loading, error, refetch: fetchPosts }
}

/**
 * Get single blog post by ID
 */
export const useBlogPost = (blogType: BlogType, postId: string) => {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    const blogId = BLOG_CONFIG[blogType]
    
    if (!blogId || !postId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${postId}?blogId=${blogId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog post`)
      }
      
      const data = await response.json()
      
      if (data) {
        const convertedPost = convertBloggerPostToLocalFormat(data, getBlogCategoryName(blogType))
        setPost(convertedPost)
      } else {
        setPost(null)
      }
    } catch (err: any) {
      console.error(`Error fetching blog post:`, err)
      setError(err.message)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [blogType, postId])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return { post, loading, error, refetch: fetchPost }
}

/**
 * Convenience hooks for specific blog types
 */
export const useManufacturingPosts = (options?: UseBlogDataOptions) => 
  useBlogData('manufacturing', options)

export const useEngineeringPosts = (options?: UseBlogDataOptions) => 
  useBlogData('engineering', options)

export const useSuccessStoriesPosts = (options?: UseBlogDataOptions) => 
  useBlogData('successStories', options)

/**
 * Centralized blog post conversion logic
 * Replaces multiple duplicate conversion functions
 */
// Memoized conversion cache - clear on new deployments
const conversionCache = new Map<string, BlogPost>()

// Clear cache periodically to ensure fresh images
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (conversionCache.size > 50) {
      conversionCache.clear()
    }
  }, 300000) // Clear every 5 minutes
}

function convertBloggerPostToLocalFormat(post: any, defaultCategory: string = 'Blog'): BlogPost {
  // Check cache first
  const cacheKey = `${post.id}-${post.updated}`
  if (conversionCache.has(cacheKey)) {
    return conversionCache.get(cacheKey)!
  }

  // Generate slug first since it's used in multiple places
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Use snippet if available (faster than parsing content)
  let excerpt = ''
  if (post.snippet) {
    excerpt = decodeHtmlEntities(post.snippet.trim())
    if (excerpt.length > 160) {
      const lastSpace = excerpt.substring(0, 157).lastIndexOf(' ')
      excerpt = excerpt.substring(0, lastSpace > 100 ? lastSpace : 157) + '...'
    }
  } else {
    // Simplified excerpt extraction
    const cleanText = (post.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    excerpt = cleanText.length > 160 ? cleanText.substring(0, 157) + '...' : cleanText
  }

  // Simplified read time calculation
  const wordCount = (post.content || '').split(/\s+/).length
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`

  // Enhanced image extraction to get the best image
  let image = ''
  const imgMatches = post.content?.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi) || []
  
  // Debug logging for production image issues
  if (process.env.NODE_ENV === 'development') {
    console.log(`Processing post: ${post.title}`)
    console.log(`Found ${imgMatches.length} images`)
    imgMatches.forEach((match, i) => console.log(`Image ${i}:`, match))
  }
  
  // Find the best image URL - prefer larger, content images
  for (const imgTag of imgMatches) {
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/)
    if (srcMatch && srcMatch[1]) {
      const imgUrl = srcMatch[1]
      // Skip small icons, logos, and default images
      if (!imgUrl.includes('/s45/') && 
          !imgUrl.includes('/s72/') && 
          !imgUrl.includes('icon') && 
          !imgUrl.includes('logo') && 
          !imgUrl.includes('favicon') &&
          !imgUrl.includes('default') &&
          !imgUrl.includes('avatar')) {
        
        // Prefer blogger images over others
        if (imgUrl.includes('blogger.googleusercontent.com')) {
          image = imgUrl
          break
        } else if (!image) {
          image = imgUrl
        }
      }
    }
  }

  // Fallback to diverse category-specific images to avoid same image everywhere
  if (!image || image.includes('Opto Imaging Png')) {
    // Generate a hash from post ID to get consistent but different images
    const postHash = post.id ? parseInt(post.id.slice(-2), 36) % 3 : 0
    
    const fallbackSets = {
      'Success Story': [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80'
      ],
      'Manufacturing': [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
        'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&q=80',
        'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1200&q=80'
      ],
      'Engineering': [
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&q=80'
      ]
    }
    
    const categoryFallbacks = fallbackSets[defaultCategory] || fallbackSets['Manufacturing']
    image = categoryFallbacks[postHash]
  }

  // Enhanced image processing
  if (image.startsWith('//')) image = 'https:' + image
  
  // Fix Blogger image sizes for better quality
  if (image.includes('blogger.googleusercontent.com') || image.includes('blogspot.com')) {
    image = image.replace(/\/s\d+(-c)?\//, '/s1600/')
    image = image.replace(/=s\d+$/i, '=s1600')
    image = `/api/image-proxy?url=${encodeURIComponent(image)}`
  } else if (image.includes('unsplash.com')) {
    image = `/api/image-proxy?url=${encodeURIComponent(image)}`
  }

  const result = {
    id: post.id,
    title: post.title,
    slug,
    excerpt,
    fullContent: post.content || '',
    category: post.labels?.[0] || defaultCategory,
    tags: post.labels || [],
    author: post.author?.displayName || 'EMUSKI',
    authorImage: post.author?.image?.url || '/assets/authors/default.jpg',
    publishDate: new Date(post.published).toISOString(),
    readTime,
    image,
  }

  // Cache the result
  conversionCache.set(cacheKey, result)
  
  // Limit cache size
  if (conversionCache.size > 100) {
    const firstKey = conversionCache.keys().next().value
    conversionCache.delete(firstKey)
  }

  return result
}

/**
 * Get category name for blog type
 */
function getBlogCategoryName(blogType: BlogType): string {
  const categoryMap = {
    manufacturing: 'Manufacturing',
    engineering: 'Engineering', 
    successStories: 'Success Story'
  }
  return categoryMap[blogType]
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  return text
    // Fix double-encoded entities first
    .replace(/&amp;amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
}

/**
 * Extract SEO-optimized description
 */
function extractSEODescription(content: string): string {
  let cleaned = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')

  const paragraphMatches = cleaned.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || []
  let description = ''

  for (const para of paragraphMatches) {
    const text = para.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const decoded = decodeHtmlEntities(text)

    if (decoded.length < 20) continue
    if (/^(title|subtitle|heading|who the client|what the challenge):/i.test(decoded)) continue

    description = decoded
    break
  }

  if (!description) {
    const textContent = cleaned.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    description = decodeHtmlEntities(textContent)
  }

  if (description.length > 160) {
    const sentences = description.match(/[^.!?]+[.!?]+/g) || []
    let optimized = ''

    for (const sentence of sentences) {
      if ((optimized + sentence).length <= 160) {
        optimized += sentence
      } else {
        break
      }
    }

    if (optimized.length >= 100) {
      description = optimized.trim()
    } else {
      const lastSpace = description.substring(0, 157).lastIndexOf(' ')
      description = description.substring(0, lastSpace > 100 ? lastSpace : 157) + '...'
    }
  }

  return description
}