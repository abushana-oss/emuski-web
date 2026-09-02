import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { HeroVisual } from "./HeroVisual"

export function Hero() {
  return (
    <header id="hero" className="relative overflow-hidden border-b border-white/5" style={{ backgroundColor: "rgb(18, 26, 33)" }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_20%,#000_60%,transparent_100%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 md:pt-20 md:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 text-emuski-teal-light text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emuski-teal-light" />
              Manufacturing &amp; Engineering, from India
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.3rem] font-bold text-white leading-[1.1] tracking-tight">
              You have a part to make.
              <span className="block text-emuski-teal-light">We engineer it before we build it.</span>
            </h1>

            <p className="mt-5 text-xl sm:text-2xl text-gray-200 font-medium">
              DFM, should-cost analysis, and VAVE, built into every project, not sold as an add-on.
            </p>

            <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
              Send EMUSKI a drawing, CAD file, or BOM. We review it for manufacturability, model what it should
              cost, machine or mold it, control quality through inspection and documentation, and deliver, one
              partner from engineering through production.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-emuski-teal hover:bg-emuski-teal-light text-black px-7 py-3.5 rounded-lg font-semibold transition-colors"
              >
                Start a Manufacturing Project
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white px-7 py-3.5 rounded-lg font-semibold transition-colors"
              >
                Explore Capabilities
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-white/10 pt-6">
              <div>
                <dt className="sr-only">Years of experience</dt>
                <dd className="text-2xl font-bold text-white">15+</dd>
                <dd className="text-xs text-gray-400 mt-0.5">Years experience</dd>
              </div>
              <div>
                <dt className="sr-only">Certification</dt>
                <dd className="text-2xl font-bold text-white">ISO</dd>
                <dd className="text-xs text-gray-400 mt-0.5">9001:2015 certified</dd>
              </div>
              <div>
                <dt className="sr-only">Global clients</dt>
                <dd className="text-2xl font-bold text-white">75+</dd>
                <dd className="text-xs text-gray-400 mt-0.5">Global clients</dd>
              </div>
            </dl>
          </div>

          {/* Visual composition */}
          <div className="lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </div>
    </header>
  )
}
