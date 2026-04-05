'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectDeliveryCarouselProps {
  className?: string
  showDownload?: boolean
  autoplay?: boolean
  height?: string
}

export function ProjectDeliveryCarousel({ 
  className = '',
  showDownload = true,
  autoplay = true,
  height = 'h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]'
}: ProjectDeliveryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(10).fill(false))

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 6000, // Slower for reading case study content
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  )

  // SEO-optimized page generation with descriptive content
  const pages = useMemo(
    () => [
      {
        id: 1,
        src: `/Project_Delivery_Report/1.svg`,
        alt: `EMUSKI Manufacturing Project Delivery Report Cover - Comprehensive case study of precision manufacturing process and quality assurance documentation`,
        loading: 'eager' as const,
        title: 'Project Overview',
        description: 'Manufacturing project delivery case study overview'
      },
      {
        id: 2,
        src: `/Project_Delivery_Report/2.svg`,
        alt: `Manufacturing Project Details and Specifications - Technical drawings, material specifications, and engineering requirements for precision parts`,
        loading: 'eager' as const,
        title: 'Project Details',
        description: 'Detailed project specifications and technical requirements'
      },
      {
        id: 3,
        src: `/Project_Delivery_Report/3.svg`,
        alt: `Part Details and Technical Specifications - Dimensional drawings, tolerances, and material properties for manufactured components`,
        loading: 'lazy' as const,
        title: 'Part Details',
        description: 'Component specifications and dimensional requirements'
      },
      {
        id: 4,
        src: `/Project_Delivery_Report/4.svg`,
        alt: `Manufacturing Process Plan - Step-by-step production workflow, machining operations, and quality control checkpoints`,
        loading: 'lazy' as const,
        title: 'Manufacturing Process',
        description: 'Detailed manufacturing workflow and process planning'
      },
      {
        id: 5,
        src: `/Project_Delivery_Report/5.svg`,
        alt: `Mill Test Certificate - Material certification, chemical composition, and mechanical properties verification documentation`,
        loading: 'lazy' as const,
        title: 'Mill Test Certificate',
        description: 'Material certification and quality verification'
      },
      {
        id: 6,
        src: `/Project_Delivery_Report/6.svg`,
        alt: `Balloon Drawing with Inspection Points - Technical drawing with numbered inspection dimensions and quality control reference points`,
        loading: 'lazy' as const,
        title: 'Balloon Drawing',
        description: 'Inspection points and quality control references'
      },
      {
        id: 7,
        src: `/Project_Delivery_Report/7.svg`,
        alt: `Final Inspection Report - Comprehensive quality assurance documentation with measurement results and compliance verification`,
        loading: 'lazy' as const,
        title: 'Final Inspection',
        description: 'Quality assurance and compliance verification results'
      },
      {
        id: 8,
        src: `/Project_Delivery_Report/8.svg`,
        alt: `Dock Audit Checklist - Final quality control checklist, packaging verification, and shipping preparation documentation`,
        loading: 'lazy' as const,
        title: 'Dock Audit Checklist',
        description: 'Final quality control and shipping preparation'
      },
      {
        id: 9,
        src: `/Project_Delivery_Report/9.svg`,
        alt: `Product Images - High-resolution photographs of finished manufactured parts showing quality, precision, and surface finish`,
        loading: 'lazy' as const,
        title: 'Product Images',
        description: 'Finished product photography and quality showcase'
      },
      {
        id: 10,
        src: `/Project_Delivery_Report/10.svg`,
        alt: `Key Learnings and Process Improvements - Project insights, lessons learned, and recommendations for future manufacturing optimization`,
        loading: 'lazy' as const,
        title: 'Key Learnings',
        description: 'Project insights and process improvement recommendations'
      }
    ],
    []
  )

  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())

    setCurrent(api.selectedScrollSnap())
    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  const handleImageLoad = useCallback((index: number) => {
    setImageLoaded(prev => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }, [])



  return (
    <div className={`relative ${className}`} role="region" aria-label="EMUSKI Manufacturing Case Study Gallery" itemScope itemType="https://schema.org/ImageGallery">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "EMUSKI Manufacturing Project Delivery Case Study",
            "description": "Comprehensive manufacturing case study showcasing precision machining, quality assurance, and project delivery documentation",
            "url": `${typeof window !== 'undefined' ? window.location.href : ''}/manufacturing-services`,
            "creator": {
              "@type": "Organization",
              "name": "EMUSKI Manufacturing Solutions",
              "url": "https://www.emuski.com"
            },
            "image": pages.map(page => ({
              "@type": "ImageObject",
              "name": page.title,
              "description": page.description,
              "contentUrl": `${typeof window !== 'undefined' ? window.location.origin : ''}${page.src}`,
              "thumbnailUrl": `${typeof window !== 'undefined' ? window.location.origin : ''}${page.src}`,
              "caption": page.alt
            }))
          })
        }}
      />

      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        plugins={autoplay ? [autoplayPlugin.current] : []}
        className="w-full"
        role="img"
        aria-label="Interactive case study carousel showing manufacturing project delivery process"
      >
        <CarouselContent className="-ml-0">
          {pages.map((page, index) => (
            <CarouselItem key={page.id} className="pl-0">
              <div className={`relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-xl w-full ${height} group`}>
                {/* Loading skeleton */}
                {!imageLoaded[index] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500 text-sm">Loading page {page.id}...</div>
                    </div>
                  </div>
                )}

                {/* SVG Image */}
                <img
                  src={page.src}
                  alt={page.alt}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoaded[index] ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={page.loading}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => console.warn(`Failed to load page ${page.id}`)}
                />

                {/* Side Navigation Controls - Always Visible with Dark Teal Effect */}
                {/* Previous Button - Left Side */}
                <button
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-emuski-teal-darker/90 hover:bg-emuski-teal-darker border-2 border-emuski-teal-darker shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white hover:text-white transition-colors" />
                </button>

                {/* Next Button - Right Side */}
                <button
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-emuski-teal-darker/90 hover:bg-emuski-teal-darker border-2 border-emuski-teal-darker shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
                  aria-label="Next page"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white hover:text-white transition-colors" />
                </button>

                {/* Page indicator overlay with SEO context */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium" role="status" aria-live="polite">
                  <span className="sr-only">Viewing page {page.id} of 10: {page.title}</span>
                  {page.id} / 10
                </div>

                {/* Hidden content for SEO */}
                <div className="sr-only">
                  <h3>{page.title}</h3>
                  <p>{page.description}</p>
                  <span>EMUSKI Manufacturing Case Study - Page {page.id}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>


    </div>
  )
}

export type { ProjectDeliveryCarouselProps }