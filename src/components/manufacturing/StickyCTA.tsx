'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function StickyCTA() {
  const [pastHero, setPastHero] = useState(false)
  const [inFinalCta, setInFinalCta] = useState(false)

  useEffect(() => {
    const hero = document.getElementById("hero")
    const finalCta = document.getElementById("final-cta")

    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      threshold: 0,
    })
    if (hero) heroObserver.observe(hero)

    const ctaObserver = new IntersectionObserver(([entry]) => setInFinalCta(entry.isIntersecting), {
      threshold: 0.2,
    })
    if (finalCta) ctaObserver.observe(finalCta)

    return () => {
      heroObserver.disconnect()
      ctaObserver.disconnect()
    }
  }, [])

  const visible = pastHero && !inFinalCta

  return (
    // Bottom-left, elevated clear of the site-wide chat widget (bottom-center) and
    // WhatsApp tab (right edge) that are mounted on every page.
    <div
      className={`fixed z-40 bottom-24 left-4 sm:bottom-6 sm:left-6 transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <Link
        href="/contact"
        className="group flex items-center gap-2 sm:gap-2.5 bg-emuski-dark/95 backdrop-blur border border-emuski-teal/30 hover:border-emuski-teal-light text-white pl-4 sm:pl-5 pr-3.5 sm:pr-4 py-3 sm:py-3.5 rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgba(38,193,194,0.25)] transition-all duration-300"
      >
        <span className="h-2 w-2 rounded-full bg-emuski-teal-light animate-pulse flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold whitespace-nowrap">
          <span className="sm:hidden">Start a Project</span>
          <span className="hidden sm:inline">Start a Manufacturing Project</span>
        </span>
        <ArrowRight className="h-4 w-4 text-emuski-teal-light group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
      </Link>
    </div>
  )
}
