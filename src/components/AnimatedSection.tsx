'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animationType?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp' | 'rotateIn'
  delay?: number
  duration?: number
  threshold?: number
}

export function AnimatedSection({ 
  children, 
  className = '', 
  animationType = 'fadeInUp',
  delay = 0,
  duration = 800,
  threshold = 0.1
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, delay)
        }
      },
      { 
        threshold,
        rootMargin: '50px'
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay, threshold, hasAnimated])

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all ease-out'
    const durationClass = `duration-[${duration}ms]`
    
    if (!isVisible) {
      switch (animationType) {
        case 'fadeInUp':
          return `${baseClasses} ${durationClass} opacity-0 translate-y-12 scale-95`
        case 'fadeInLeft':
          return `${baseClasses} ${durationClass} opacity-0 -translate-x-12 scale-95`
        case 'fadeInRight':
          return `${baseClasses} ${durationClass} opacity-0 translate-x-12 scale-95`
        case 'scaleIn':
          return `${baseClasses} ${durationClass} opacity-0 scale-75`
        case 'slideInUp':
          return `${baseClasses} ${durationClass} opacity-0 translate-y-16`
        case 'rotateIn':
          return `${baseClasses} ${durationClass} opacity-0 rotate-12 scale-90`
        default:
          return `${baseClasses} ${durationClass} opacity-0 translate-y-8`
      }
    }
    
    return `${baseClasses} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0`
  }

  return (
    <div 
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transform: isVisible 
          ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)' 
          : 'perspective(1000px) rotateX(5deg) rotateY(2deg) translateZ(-20px)',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  )
}

// Enhanced 3D Card component
interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
}

export function AnimatedCard({ children, className = '', hoverEffect = true }: AnimatedCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !hoverEffect) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <div 
      ref={cardRef}
      className={`transform-gpu transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: hoverEffect 
          ? `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg) translateZ(${Math.abs(mousePosition.x + mousePosition.y) * 20}px)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)',
        transformStyle: 'preserve-3d',
        boxShadow: hoverEffect && (mousePosition.x !== 0 || mousePosition.y !== 0)
          ? `${mousePosition.x * 20}px ${mousePosition.y * 20}px 40px rgba(23, 184, 186, 0.2)`
          : '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div 
        className="relative"
        style={{
          transform: 'translateZ(20px)',
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
    </div>
  )
}