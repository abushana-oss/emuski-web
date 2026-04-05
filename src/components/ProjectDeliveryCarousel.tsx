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

  // Optimized page generation with performance considerations
  const pages = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        src: `/Project_Delivery_Report/${i + 1}.svg`,
        alt: `Project Delivery Case Study - Page ${i + 1} of 10`,
        // Preload strategy: load first 2 pages immediately, others lazily
        loading: (i < 2 ? 'eager' : 'lazy') as 'eager' | 'lazy',
      })),
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
    <div className={`relative ${className}`}>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        plugins={autoplay ? [autoplayPlugin.current] : []}
        className="w-full"
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

                {/* Side Navigation Controls */}
                {/* Previous Button - Left Side */}
                <button
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white border-2 border-emuski-teal shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-6 h-6 text-emuski-teal" />
                </button>

                {/* Next Button - Right Side */}
                <button
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white border-2 border-emuski-teal shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-6 h-6 text-emuski-teal" />
                </button>

                {/* Page indicator overlay */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {page.id} / 10
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