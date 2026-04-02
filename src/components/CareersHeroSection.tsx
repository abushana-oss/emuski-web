'use client'

import { useState, useEffect, useRef } from 'react'

export function CareersHeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [sectionHeight, setSectionHeight] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Handle scroll animations with scroll prevention during animation
  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isMobileDevice = window.innerWidth < 768
      const maxAnimationScroll = isMobileDevice ? window.innerHeight * 0.8 : window.innerHeight * 1.0
      
      if (currentScrollY >= maxAnimationScroll * 0.9 && !animationComplete) {
        setAnimationComplete(true)
        // Immediate transition to next section
        setTimeout(() => {
          window.scrollTo({
            top: maxAnimationScroll + 10,
            behavior: 'smooth'
          })
        }, 50)
      }
      
      // Prevent scrolling past hero section until animation completes
      if (!animationComplete && currentScrollY > maxAnimationScroll) {
        window.scrollTo(0, maxAnimationScroll)
        return
      }
      
      setScrollY(currentScrollY)
    }
    
    const handleResize = () => {
      setSectionHeight(window.innerHeight)
    }

    window.addEventListener('scroll', handleScroll, { passive: false })
    window.addEventListener('resize', handleResize, { passive: true })
    handleResize() // Set initial height

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [animationComplete])

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  // Calculate transform values based on scroll - with fixed scroll behavior
  const heroHeight = isMounted ? window.innerHeight : 800
  const isMobile = isMounted ? window.innerWidth < 768 : false
  const maxScroll = isMobile ? heroHeight * 0.8 : heroHeight * 1.0
  
  // Calculate scroll progress for animation
  const scrollProgress = Math.min(scrollY / maxScroll, 1)

  // Control video playback based on scroll
  useEffect(() => {
    const video = videoRef.current
    if (video && video.duration > 0) {
      // Set video time based on scroll progress
      const newTime = Math.min(scrollProgress * video.duration, video.duration - 0.1)
      
      // Only update if the time difference is significant to avoid jitter
      if (Math.abs(video.currentTime - newTime) > 0.1) {
        video.currentTime = newTime
      }
    }
  }, [scrollProgress])

  // Initialize video
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedData = () => {
        video.pause() // Ensure video is paused
        video.currentTime = 0 // Start at beginning
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.load()
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [])
  
  // Enhanced 3D transforms during animation - reduced for better UX
  const videoScale = 1 + (scrollProgress * 0.12)
  const videoRotateX = scrollProgress * 2
  const videoRotateY = Math.sin(scrollProgress * Math.PI * 2) * 1.5
  const videoTranslateZ = scrollProgress * 25
  
  const textTransform = scrollY * 0.1
  const textScale = Math.max(0.9, 1 - (scrollProgress * 0.2))
  const textRotateX = scrollProgress * 5
  const textOpacity = Math.max(0.6, 1 - (scrollProgress * 0.5))
  
  // Dynamic overlay that changes with scroll
  const overlayOpacity = scrollProgress * 0.5

  return (
    <>
      {/* Spacer div to maintain layout when hero is fixed */}
      {!animationComplete && (
        <div style={{ height: `${(isMobile ? heroHeight * 0.8 : heroHeight * 1.0)}px` }} />
      )}
      
      <section 
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ 
          height: '100vh',
          minHeight: '600px',
          position: animationComplete ? 'relative' : 'fixed',
          top: animationComplete ? 'auto' : '0',
          left: animationComplete ? 'auto' : '0',
          zIndex: animationComplete ? 'auto' : '40',
          width: '100%',
          paddingTop: isMobile ? '80px' : '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
      {/* 3D Video Background with Extended Scroll Effects */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          style={{
            filter: `
              brightness(${0.7 + scrollProgress * 0.2}) 
              contrast(${1 + scrollProgress * 0.3}) 
              saturate(${0.9 + scrollProgress * 0.3})
            `,
            transform: `
              scale(${videoScale}) 
              rotateX(${isMobile ? videoRotateX * 0.5 : videoRotateX}deg) 
              rotateY(${isMobile ? videoRotateY * 0.5 : videoRotateY}deg) 
              translateZ(${isMobile ? videoTranslateZ * 0.5 : videoTranslateZ}px)
            `,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <source src="/assets/animation/carrer-home.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Enhanced Gradient Overlay with Dynamic Effects */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(0, 0, 0, ${0.4 + scrollProgress * 0.2}) 0%,
                rgba(23, 184, 186, ${0.1 + scrollProgress * 0.1}) 30%,
                rgba(42, 205, 207, ${0.05 + scrollProgress * 0.1}) 50%,
                rgba(23, 184, 186, ${0.1 + scrollProgress * 0.1}) 70%,
                rgba(0, 0, 0, ${0.5 + scrollProgress * 0.15}) 100%
              )
            `,
            backdropFilter: `blur(${scrollProgress * 2}px)`,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>

      {/* 3D Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {[
          { left: 10, top: 20, delay: 0 },
          { left: 30, top: 60, delay: 1 },
          { left: 50, top: 30, delay: 2 },
          { left: 70, top: 80, delay: 0.5 },
          { left: 90, top: 40, delay: 1.5 },
          { left: 20, top: 70, delay: 2.5 },
          { left: 80, top: 15, delay: 1.2 },
          { left: 40, top: 85, delay: 0.8 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emuski-teal/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              transform: `
                translate3d(
                  ${Math.sin(scrollY * 0.005 + i) * 30}px, 
                  ${Math.cos(scrollY * 0.008 + i) * 40 + scrollProgress * -50}px, 
                  ${scrollProgress * 50}px
                )
                scale(${1 + scrollProgress * 0.5})
              `,
              opacity: Math.max(0.3, 1 - scrollProgress * 0.7),
              boxShadow: `0 0 ${10 + scrollProgress * 20}px rgba(23, 184, 186, ${0.6 + scrollProgress * 0.4})`,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ))}
      </div>

      {/* Main Content with 3D Transforms */}
      <div 
        className="relative z-30 w-full flex items-center justify-center"
        style={{
          height: '100vh'
        }}
      >
        <div 
          className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center transition-all duration-1000 ${
            isIntersecting ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{
            transform: `translate3d(0, ${textTransform}px, 0) scale(${textScale})`,
            transformStyle: 'preserve-3d',
            opacity: textOpacity,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >

        {/* 3D Typography */}
        <div className="space-y-6 sm:space-y-8">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight leading-tight text-white mb-4 sm:mb-6"
            style={{
              fontFamily: '"GT Canon VF Variable L Black", sans-serif',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              lineHeight: '1.1'
            }}
          >
            Shape the Future of{' '}
            <span 
              className="text-emuski-teal font-black"
              style={{
                color: '#2ACDCF'
              }}
            >
              Manufacturing
            </span>
          </h1>

          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-5xl mx-auto leading-relaxed font-medium px-4 sm:px-0"
            style={{
              fontFamily: '"FK Grotesk Neue Regular", sans-serif',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              color: '#ffffff',
              lineHeight: '1.5'
            }}
          >
            Join EMUSKI's mission to revolutionize precision manufacturing and cost engineering through{' '}
            <span 
              className="font-bold text-emuski-teal"
              style={{
                color: '#2ACDCF'
              }}
            >
              innovation
            </span>, {' '}
            <span 
              className="font-bold text-emuski-teal"
              style={{
                color: '#2ACDCF'
              }}
            >
              AI
            </span>, and {' '}
            <span 
              className="font-bold text-emuski-teal"
              style={{
                color: '#2ACDCF'
              }}
            >
              engineering excellence
            </span>.
          </p>
        </div>


        </div>
      </div>

    </section>
    </>
  )
}