'use client'

import { useEffect, useState } from "react"
import Image from "next/image"

type Slide = {
  src: string
  alt: string
  width: number
  height: number
  tag: string
}

const SLIDES: Slide[] = [
  {
    src: "/assets/industry-components/automotive-component-manufacturing/automotive-component-3.jpg",
    alt: "5-axis machined multi-cavity tooling component manufactured by EMUSKI",
    width: 2939,
    height: 1803,
    tag: "Precision Machined Component",
  },
  {
    src: "/assets/npdcentre/vmc-5-axis.png",
    alt: "5-axis VMC machining center running production at EMUSKI's Bangalore engineering center",
    width: 890,
    height: 630,
    tag: "In Production, Bangalore",
  },
  {
    src: "/assets/engineering/product-teardown-analysis.png",
    alt: "Full-vehicle teardown with component-level cost mapping",
    width: 940,
    height: 788,
    tag: "VAVE Teardown",
  },
  {
    src: "/docs/cost-breakdown-analysis-report/cost-breakdown-analysis-page-04.png",
    alt: "Real EMUSKI cost breakdown report page",
    width: 1545,
    height: 1999,
    tag: "Real Should-Cost Report",
  },
]

const INTERVAL_MS = 5000

export function HeroVisual() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] sm:aspect-[16/11] bg-black/20">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover transition-transform duration-[5000ms] ease-out"
              style={{ transform: i === active ? "scale(1.04)" : "scale(1)" }}
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />
      </div>

      {/* Floating annotation: constant reference point */}
      <div className="hidden sm:flex absolute top-4 left-4 items-center gap-2 bg-white/95 backdrop-blur rounded-lg shadow-xl px-4 py-2.5 border border-gray-200">
        <span className="h-2 w-2 rounded-full bg-gray-400" />
        <span className="text-xs font-semibold text-gray-500 tracking-wide">EMUSKI, Bangalore</span>
      </div>

      {/* Floating annotation: changes with the active slide */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 bg-emuski-dark/95 backdrop-blur rounded-lg shadow-xl px-4 py-2.5 border border-emuski-teal/30 min-w-[11rem] justify-end">
          <span className="h-2 w-2 rounded-full bg-emuski-teal-light animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-white tracking-wide text-right">{SLIDES[active].tag}</span>
        </div>
      </div>

      {/* Progress rail */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-emuski-teal-light" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
