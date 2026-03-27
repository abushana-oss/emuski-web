'use client'

import { useEffect, useState, useRef, ReactNode, Suspense } from 'react'

// Custom intersection observer hook
const useInView = (options: IntersectionObserverInit) => {
  const [inView, setInView] = useState(false)
  const [ref, setRef] = useState<Element | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, options)

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, options])

  return { ref: setRef, inView }
}

interface OptimizedLazyRenderProps {
  children: ReactNode
  fallback?: ReactNode
  minHeight?: string
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const OptimizedLazyRender = ({
  children,
  fallback,
  minHeight = '200px',
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}: OptimizedLazyRenderProps) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce
  })

  useEffect(() => {
    if (inView && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  }, [inView, hasBeenVisible])

  const shouldRender = triggerOnce ? hasBeenVisible : inView

  return (
    <div 
      ref={ref}
      style={{ minHeight: shouldRender ? 'auto' : minHeight }}
      className="w-full"
    >
      {shouldRender ? (
        <Suspense fallback={
          fallback || (
            <div className="flex items-center justify-center" style={{ minHeight }}>
              <div className="animate-pulse bg-gray-200 rounded-lg w-full h-32" />
            </div>
          )
        }>
          {children}
        </Suspense>
      ) : (
        fallback || (
          <div className="flex items-center justify-center" style={{ minHeight }}>
            <div className="animate-pulse bg-gray-100 rounded-lg w-full h-32" />
          </div>
        )
      )}
    </div>
  )
}