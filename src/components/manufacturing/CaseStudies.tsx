'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const stages = [
  {
    n: "01",
    tag: "Aerospace · USA",
    headline: "75 units delivered in 3 days",
    body: "Vendors across Europe and the US missed a 3-day deadline the client had already booked flights against. EMUSKI designed new tooling and completed full production in time.",
    image: "/blog/images/75-units-to-the-usa-in-just-3-days.jpg",
    imageAlt: "EMUSKI team after delivering 75 aerospace units to the USA within 3 days",
    href: "/blog/75-units-to-the-usa-in-just-3-days-delivering-against-the-clock",
    result: "3 days",
  },
  {
    n: "02",
    tag: "Automotive · India facelift",
    headline: "70 cost-reduction ideas in 3 days",
    body: "A German automotive manufacturer needed fast, practical cost ideas for their India facelift model. A 3-day workshop sprint, discovery, ideation, feasibility, produced 70 actionable POCs.",
    image: "/blog/images/german-automotive-manufacturer-70-poc-ideas.jpg",
    imageAlt: "EMUSKI and client team after a cost-optimization workshop sprint",
    href: "/blog/german-automotive-manufacturer-optimize-costs-for-india-facelift-model-70-poc-ideas-in-3-days",
    result: "70 POCs",
  },
  {
    n: "03",
    tag: "Space & Satellite",
    headline: "1mm-wall satellite barrel, prototyped in 3 days",
    body: "A satellite components company couldn't find a supplier capable of a thin-wall barrel with complex grooves. EMUSKI's NPD center delivered a working prototype in three days, then took on the client's full component range.",
    image: "/assets/industry-components/space-satellite-manufacturing/space-satellite-component-2.jpeg",
    imageAlt: "Precision-machined satellite component manufactured by EMUSKI",
    href: "/blog/satellite-broadcast-sensor-components",
    result: "1mm wall",
  },
  {
    n: "04",
    tag: "Advanced Materials",
    headline: "Sourced a material no one in India would supply",
    body: "A client needed proprietary Tokai Carbon graphite with no local supplier. EMUSKI sourced it, ran all 9 required mechanical tests, and manufactured the final components.",
    image: "/blog/images/advanced-graphite-machining.jpg",
    imageAlt: "Machined graphite test specimens from EMUSKI's material qualification project",
    href: "/blog/advanced-graphite-machining",
    result: "9 tests",
  },
  {
    n: "05",
    tag: "Defense",
    headline: "Zero-zero tolerance where other suppliers failed",
    body: "Previous suppliers couldn't hold tolerance before and after anodization, halting final assembly. EMUSKI's NPD center ran anodization R&D to freeze the right values and eliminated the failure.",
    image: "/assets/industry-components/defense-technology-manufacturing/defense-component-4.jpeg",
    imageAlt: "Precision-machined defense component manufactured by EMUSKI",
    href: "/blog/defense-sector",
    result: "Zero-zero",
  },
]

export function CaseStudies() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.current.findIndex((el) => el === entry.target)
            if (index !== -1) setActive(index)
          }
        })
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    )

    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const stage = stages[active]

  return (
    <section id="case-studies" className="py-16 md:py-24 bg-gray-50" aria-labelledby="case-studies-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Delivered, Not Promised</p>
          <h2 id="case-studies-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Five projects, five different problems
          </h2>
          <p className="mt-4 text-lg text-gray-600">Real clients, real components, real outcomes.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Sticky visual */}
          <div className="lg:basis-5/12 lg:shrink-0 order-1">
            <div className="lg:sticky lg:top-28">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl aspect-[4/3]">
                <Image
                  key={stage.image}
                  src={stage.image}
                  alt={stage.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emuski-dark/90 via-emuski-dark/10 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-white/95 backdrop-blur text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-md shadow-lg">
                    Case {stage.n} / 05
                  </span>
                  <span className="bg-emuski-teal-darker/95 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-lg">
                    {stage.tag}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-3xl md:text-4xl font-bold text-white transition-all duration-500">
                    {stage.result}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling stages */}
          <div className="lg:basis-7/12 lg:min-w-0 order-2">
            {stages.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  refs.current[i] = el
                }}
                className={`flex flex-col justify-center min-h-[38vh] lg:min-h-[50vh] border-l-2 pl-8 transition-colors duration-300 ${
                  active === i ? "border-emuski-teal-darker" : "border-gray-200"
                }`}
              >
                <span
                  className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                    active === i ? "text-emuski-teal-darker" : "text-gray-400"
                  }`}
                >
                  {s.n} — {s.tag}
                </span>
                <h3
                  className={`mt-3 text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                    active === i ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.headline}
                </h3>
                <p
                  className={`mt-3 max-w-lg leading-relaxed transition-colors duration-300 ${
                    active === i ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {s.body}
                </p>
                <Link
                  href={s.href}
                  className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${
                    active === i ? "text-emuski-teal-darker hover:underline" : "text-gray-300 pointer-events-none"
                  }`}
                >
                  Read the case study
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
