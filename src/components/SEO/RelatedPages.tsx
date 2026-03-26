/**
 * Related Pages Component for improved internal linking and SEO
 * Helps distribute PageRank and improves user navigation
 */

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RelatedPage {
  title: string
  url: string
  description: string
  category?: string
}

interface RelatedPagesProps {
  pages: RelatedPage[]
  title?: string
  className?: string
}

export function RelatedPages({ 
  pages, 
  title = "Related Services & Solutions",
  className = ""
}: RelatedPagesProps) {
  if (!pages || pages.length === 0) return null

  return (
    <section className={`py-8 border-t border-gray-200 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <Link
              key={page.url}
              href={page.url}
              className="group block p-6 bg-white border border-gray-200 rounded-lg hover:border-emuski-teal-dark hover:shadow-md transition-all duration-300"
            >
              {page.category && (
                <span className="inline-block px-2 py-1 text-xs font-medium text-emuski-teal-dark bg-emuski-teal/10 rounded-full mb-3">
                  {page.category}
                </span>
              )}
              
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-emuski-teal-dark transition-colors">
                {page.title}
              </h4>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {page.description}
              </p>
              
              <div className="flex items-center text-emuski-teal-dark text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Pre-configured related pages for different page types
 */
export const RELATED_PAGES_CONFIG = {
  manufacturingServices: [
    {
      title: "Cost Engineering & VAVE",
      url: "/cost-engineering",
      description: "Optimize your manufacturing costs with our value analysis and engineering services.",
      category: "Engineering"
    },
    {
      title: "AI Manufacturing Solutions", 
      url: "/solutions/ai",
      description: "Leverage AI-powered manufacturing optimization and predictive maintenance.",
      category: "Technology"
    },
    {
      title: "Success Stories",
      url: "/blog?category=case-study",
      description: "Explore our manufacturing success stories and client achievements.",
      category: "Resources"
    }
  ],
  
  costEngineering: [
    {
      title: "Manufacturing Services",
      url: "/manufacturing-services", 
      description: "Comprehensive OEM manufacturing services from prototyping to production.",
      category: "Manufacturing"
    },
    {
      title: "3D CAD Analysis Tool",
      url: "/tools/3d-cad-analysis",
      description: "Analyze your CAD models for manufacturability and cost optimization.",
      category: "Tools"
    },
    {
      title: "Engineering Blog",
      url: "/blog?category=engineering",
      description: "Latest insights on engineering innovation and cost optimization strategies.",
      category: "Resources"
    }
  ],
  
  aiSolutions: [
    {
      title: "Manufacturing Services",
      url: "/manufacturing-services",
      description: "See how our AI solutions integrate with manufacturing processes.",
      category: "Manufacturing"
    },
    {
      title: "Cost Engineering",
      url: "/cost-engineering",
      description: "AI-powered cost analysis and optimization services.",
      category: "Engineering"
    },
    {
      title: "Portfolio Gallery",
      url: "/gallery",
      description: "View examples of AI-optimized manufacturing projects.",
      category: "Portfolio"
    }
  ],
  
  blog: [
    {
      title: "Manufacturing Services",
      url: "/manufacturing-services",
      description: "Learn about our comprehensive manufacturing capabilities.",
      category: "Services"
    },
    {
      title: "Engineering Solutions",
      url: "/cost-engineering", 
      description: "Discover our engineering innovation and cost optimization services.",
      category: "Services"
    },
    {
      title: "Contact Us",
      url: "/contact",
      description: "Ready to start your next project? Get in touch with our experts.",
      category: "Connect"
    }
  ]
} as const

export type RelatedPagesType = keyof typeof RELATED_PAGES_CONFIG