import { FileUp, Search, Calculator, Layers, Factory, Truck } from "lucide-react"

const steps = [
  { icon: FileUp, title: "Share drawing, CAD, or BOM", body: "A full data package isn't required to start a review." },
  { icon: Search, title: "Engineering + DFM review", body: "We check the part for manufacturability before process is locked." },
  { icon: Calculator, title: "Should-cost + process selection", body: "An independent cost model, then the right process and supplier for the part." },
  { icon: Layers, title: "Prototype or sample", body: "In-house tooling and NPD capability keep sample turnaround short." },
  { icon: Factory, title: "Production + quality", body: "Manufactured against the same spec, with process control through completion." },
  { icon: Truck, title: "Delivery", body: "Domestic or international, on the schedule the project needs." },
]

export function Engagement() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white" aria-labelledby="engagement-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">How It Works</p>
          <h2 id="engagement-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            From drawing to delivery
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-6 left-[6%] right-[6%] h-px bg-gray-200" aria-hidden="true" />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-4">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative">
                <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-emuski-teal flex items-center justify-center lg:mb-5">
                    <Icon className="h-5 w-5 text-emuski-teal-darker" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emuski-teal-darker">Step {i + 1}</span>
                    <h3 className="font-semibold text-gray-900 mt-0.5">{title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mt-3 lg:pl-0 pl-16">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
