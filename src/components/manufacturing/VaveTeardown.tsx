import Image from "next/image"
import { Wrench, Scale, Crosshair, Lightbulb, CheckCircle2 } from "lucide-react"

const steps = [
  { icon: Wrench, label: "Teardown" },
  { icon: Scale, label: "Benchmark" },
  { icon: Crosshair, label: "Identify Cost Drivers" },
  { icon: Lightbulb, label: "Value Engineering" },
  { icon: CheckCircle2, label: "Implementation" },
]

const annotations = [
  { top: "18%", left: "62%", label: "Component-level cost mapping" },
  { top: "48%", left: "12%", label: "Material substitution candidate" },
  { top: "76%", left: "58%", label: "Fastener consolidation opportunity" },
]

export function VaveTeardown() {
  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="vave-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">VAVE &amp; Teardown</p>
          <h2 id="vave-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Cost comes out of the design, not just the process
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            EMUSKI physically disassembles the part, or the benchmark competitor, and works from what&apos;s
            actually inside it.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Annotated image */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-gray-50">
              <Image
                src="/assets/engineering/product-teardown-analysis.png"
                alt="Product teardown analysis with component-level cost mapping across a full BOM"
                width={940}
                height={788}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="w-full h-auto"
              />
            </div>
            {annotations.map((a) => (
              <div
                key={a.label}
                className="hidden sm:flex absolute items-center gap-2"
                style={{ top: a.top, left: a.left }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-emuski-teal-darker ring-4 ring-emuski-teal/20 flex-shrink-0" />
                <span className="text-[11px] font-semibold bg-white/95 backdrop-blur text-gray-800 px-2.5 py-1 rounded-md shadow-md border border-gray-200 whitespace-nowrap">
                  {a.label}
                </span>
              </div>
            ))}
            <p className="mt-3 text-xs text-gray-500">
              Illustrative callout types from a real teardown analysis, not literal findings from this image.
            </p>
          </div>

          {/* Process + facts */}
          <div className="lg:col-span-5">
            <ol className="relative">
              <span className="absolute left-[18px] top-2 bottom-2 w-px bg-gray-200" aria-hidden="true" />
              {steps.map(({ icon: Icon, label }, i) => (
                <li key={label} className="relative flex items-center gap-4 py-2.5 group">
                  <span className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full bg-white border-2 border-emuski-teal/30 text-emuski-teal-darker font-bold text-sm flex items-center justify-center group-hover:border-emuski-teal-darker group-hover:bg-emuski-teal-darker group-hover:text-white transition-colors duration-300">
                    {i + 1}
                  </span>
                  <Icon className="h-4 w-4 text-emuski-teal-darker flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{label}</span>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid grid-cols-2 gap-5 border-t border-gray-200 pt-8">
              <div>
                <div className="text-2xl font-bold text-emuski-teal-darker">20–30%</div>
                <div className="text-xs text-gray-500 mt-0.5">Avg. cost reduction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emuski-teal-darker">5–10x</div>
                <div className="text-xs text-gray-500 mt-0.5">Typical ROI</div>
              </div>
            </div>

            <p className="mt-8 text-sm text-gray-600 leading-relaxed">
              Every teardown produces a documented BOM with costs, a competitive benchmark, and a prioritized cost
              reduction roadmap, deliverables an engineering or sourcing team can act on directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
