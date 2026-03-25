/**
 * SEO-optimized Breadcrumb Component with JSON-LD Schema
 * Implements Google's breadcrumb guidelines for enhanced search visibility
 */

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  item: string
  position: number
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: React.ReactNode
}

/**
 * Generate breadcrumb JSON-LD schema
 */
function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: `https://www.emuski.com${item.item}`
    }))
  }
}

export function BreadcrumbSchema({ 
  items, 
  className = '',
  showHome = true,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />
}: BreadcrumbSchemaProps) {
  // Always include home in breadcrumb structure
  const fullItems = showHome 
    ? [{ name: 'Home', item: '/', position: 1 }, ...items.map(item => ({ ...item, position: item.position + 1 }))]
    : items

  const schema = generateBreadcrumbSchema(fullItems)

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Visual Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb navigation" 
        className={`flex items-center space-x-1 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-1" itemScope itemType="https://schema.org/BreadcrumbList">
          {fullItems.map((item, index) => (
            <li 
              key={item.item}
              className="flex items-center"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              {index === fullItems.length - 1 ? (
                // Current page - no link
                <span 
                  className="text-gray-900 font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                // Breadcrumb link
                <Link 
                  href={item.item}
                  className="text-gray-500 hover:text-emuski-teal-darker transition-colors duration-200 flex items-center"
                  itemProp="item"
                >
                  {index === 0 && showHome && (
                    <Home className="w-4 h-4 mr-1" aria-hidden="true" />
                  )}
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              
              <meta itemProp="position" content={item.position.toString()} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

/**
 * Pre-configured breadcrumbs for common page types
 */
export const BREADCRUMB_CONFIGS = {
  manufacturingServices: [
    { name: 'Manufacturing Services', item: '/manufacturing-services', position: 1 }
  ],
  
  costEngineering: [
    { name: 'Cost Engineering', item: '/cost-engineering', position: 1 }
  ],
  
  aiSolutions: [
    { name: 'Solutions', item: '/solutions', position: 1 },
    { name: 'AI Solutions', item: '/solutions/ai', position: 2 }
  ],
  
  blog: [
    { name: 'Blog', item: '/blog', position: 1 }
  ],
  
  blogPost: (slug: string, title: string) => [
    { name: 'Blog', item: '/blog', position: 1 },
    { name: title, item: `/blog/${slug}`, position: 2 }
  ],
  
  contact: [
    { name: 'Contact', item: '/contact', position: 1 }
  ],
  
  gallery: [
    { name: 'Gallery', item: '/gallery', position: 1 }
  ],
  
  tools: (toolName: string, toolSlug: string) => [
    { name: 'Tools', item: '/tools', position: 1 },
    { name: toolName, item: `/tools/${toolSlug}`, position: 2 }
  ],
  
  legal: (pageName: string, pageSlug: string) => [
    { name: pageName, item: `/${pageSlug}`, position: 1 }
  ]
} as const

/**
 * Hook to generate breadcrumbs based on current path
 */
export function useBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  if (pathSegments.length === 0) return []
  
  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Convert slug to readable name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name,
      item: currentPath,
      position: index + 1
    })
  })
  
  return breadcrumbs
}

/**
 * Simple breadcrumb component for pages that don't need complex configuration
 */
export function SimpleBreadcrumb({ pathname, className }: { pathname: string, className?: string }) {
  const breadcrumbs = useBreadcrumbs(pathname)
  
  if (breadcrumbs.length === 0) return null
  
  return <BreadcrumbSchema items={breadcrumbs} className={className} />
}