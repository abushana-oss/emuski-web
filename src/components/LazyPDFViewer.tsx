'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, ExternalLink } from 'lucide-react'

interface LazyPDFViewerProps {
  src: string
  title: string
  ariaLabel: string
  minHeight?: string
}

export const LazyPDFViewer = ({
  src,
  title,
  ariaLabel,
  minHeight = '500px'
}: LazyPDFViewerProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect mobile device and iOS
    const checkDevice = () => {
      const mobile = window.innerWidth < 768
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
      setIsMobile(mobile)
      setIsIOS(ios)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)

    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [hasIntersected])

  const mobileHeight = isMobile ? '400px' : minHeight

  return (
    <div ref={containerRef} className="relative">
      {!hasIntersected ? (
        // Loading skeleton
        <div
          className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200"
          style={{ minHeight: mobileHeight }}
        >
          <FileText className="w-16 h-16 text-emuski-teal-darker mb-4 animate-pulse" />
          <p className="text-gray-600 font-medium">Loading PDF...</p>
          <p className="text-gray-500 text-sm mt-2">{title}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Mobile/iOS: Show download/open button instead of iframe */}
          {isMobile || isIOS ? (
            <div
              className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-8"
              style={{ minHeight: mobileHeight }}
            >
              <FileText className="w-20 h-20 text-emuski-teal-darker mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
              <p className="text-gray-600 text-center mb-6 max-w-sm">
                View this PDF in your device's native PDF viewer for the best experience
              </p>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white font-semibold py-3 px-6 rounded-lg transition-colors max-w-sm w-full"
              >
                <ExternalLink className="w-5 h-5" />
                Open PDF
              </a>
            </div>
          ) : (
            /* Desktop: Show iframe PDF viewer */
            <div
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
              style={{ height: minHeight }}
            >
              <iframe
                src={`${src}#view=FitH&scrollbar=1&toolbar=1&navpanes=1`}
                className="w-full h-full border-0"
                style={{ minHeight }}
                title={title}
                aria-label={ariaLabel}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                allow="fullscreen"
                sandbox="allow-scripts allow-popups allow-forms"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
