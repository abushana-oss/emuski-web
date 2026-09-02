import Image from "next/image"
import { FileText, Search, Calculator, Cog, Factory, ShieldCheck, Truck, Target } from "lucide-react"

const flow = [
  { icon: FileText, label: "Drawing" },
  { icon: Search, label: "DFM" },
  { icon: Calculator, label: "Cost" },
  { icon: Cog, label: "Process" },
  { icon: Factory, label: "Manufacturing" },
  { icon: ShieldCheck, label: "Quality" },
  { icon: Truck, label: "Delivery" },
]

export function Engineering() {
  return (
    <section
      id="engineering"
      className="py-16 md:py-24 relative overflow-hidden border-y border-white/5"
      style={{ backgroundColor: "rgb(18, 26, 33)" }}
      aria-labelledby="engineering-heading"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-emuski-teal-light uppercase tracking-wide">Engineering Before Manufacturing</p>
          <h2 id="engineering-heading" className="mt-2 text-3xl md:text-4xl font-bold text-white">
            Manufacturing Consulting &amp; Process Engineering
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            The part is engineered before it&apos;s built, not after it fails. Design-for-manufacturing and cost
            modeling happen before the process is locked, not as a review after tooling is already cut.
          </p>
        </div>

        {/* Flow chain */}
        <div className="max-w-6xl mx-auto">
          <ol className="relative flex flex-col md:flex-row md:items-start gap-6 md:gap-0">
            <span
              className="hidden md:block absolute top-7 left-[5%] right-[5%] h-px bg-gradient-to-r from-emuski-teal/60 via-emuski-teal/30 to-emuski-teal/60"
              aria-hidden="true"
            />
            {flow.map(({ icon: Icon, label }) => (
              <li key={label} className="relative flex md:flex-col flex-1 items-center gap-4 md:gap-3">
                <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-xl bg-[rgb(18,26,33)] border border-white/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-emuski-teal-light" />
                </div>
                <span className="text-sm font-semibold text-white md:text-center">{label}</span>
              </li>
            ))}
          </ol>

          <div className="flex justify-center my-8" aria-hidden="true">
            <div className="w-px h-10 bg-gradient-to-b from-emuski-teal/40 to-emuski-teal-light" />
          </div>

          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center gap-3 bg-emuski-teal-darker border border-emuski-teal/40 rounded-xl px-8 py-4 shadow-xl">
              <Target className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-lg tracking-wide">SHOULD COST</span>
            </div>
          </div>
        </div>

        {/* Evidence + comparison */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">From an actual EMUSKI project intake</p>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl rotate-[-1deg] hover:rotate-0 transition-transform duration-300 bg-white">
              <Image
                src="/docs/cost-breakdown-analysis-report/cost-breakdown-analysis-page-03.png"
                alt="Real EMUSKI cost breakdown report page showing part information and runner volume estimation"
                width={1545}
                height={1999}
                sizes="(max-width: 1024px) 100vw, 32vw"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-xs font-semibold text-emuski-teal-light uppercase tracking-wide mb-6">Illustrative example, not a client result</p>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Supplier Quote</span>
                </div>
                <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gray-500" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>EMUSKI Should-Cost</span>
                </div>
                <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emuski-teal-light" style={{ width: "78%" }} />
                </div>
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-6">
              The gap between the two bars is what a should-cost model exists to find, before the decision to
              manufacture is locked in, not after.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
