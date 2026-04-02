'use client'

import { useState, useEffect, useRef } from 'react'

export function PrecisionAnimationSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  // Calculate scroll progress relative to this section
  useEffect(() => {
    if (!sectionRef.current || !isIntersecting) return

    const rect = sectionRef.current.getBoundingClientRect()
    const sectionTop = rect.top + window.scrollY
    const sectionHeight = rect.height
    const viewportHeight = window.innerHeight
    
    const scrollProgress = Math.max(0, Math.min(1, 
      (scrollY - sectionTop + viewportHeight) / (sectionHeight + viewportHeight)
    ))

    // Control video playback based on scroll progress
    const video = videoRef.current
    if (video && video.duration > 0) {
      const newTime = scrollProgress * video.duration
      if (Math.abs(video.currentTime - newTime) > 0.1) {
        video.currentTime = newTime
      }
    }
  }, [scrollY, isIntersecting])

  // Initialize video
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedData = () => {
        video.pause()
        video.currentTime = 0
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.load()
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-muted/30 to-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Precision <span className="text-emuski-teal">Manufacturing</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Experience our state-of-the-art precision manufacturing processes that deliver 
                exceptional quality and accuracy for every component.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-emuski-teal rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Advanced Technology</h3>
                  <p className="text-muted-foreground">
                    Cutting-edge machinery and AI-driven quality control systems ensure 
                    precision down to the micron level.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-emuski-teal rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    Comprehensive testing and validation processes guarantee 
                    99.8% quality rates across all manufacturing operations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-emuski-teal rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Scalable Solutions</h3>
                  <p className="text-muted-foreground">
                    From prototypes to mass production, our processes scale 
                    seamlessly to meet your manufacturing needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-emuski-teal/10 to-transparent p-4">
              <div className="relative rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="auto"
                  style={{
                    minHeight: '400px',
                    maxHeight: '500px'
                  }}
                >
                  <source src="/assets/animation/prcision-animation.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emuski-teal/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emuski-teal/5 rounded-full blur-2xl"></div>
          </div>

        </div>
      </div>
    </section>
  )
}