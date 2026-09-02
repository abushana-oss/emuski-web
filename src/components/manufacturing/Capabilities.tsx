import Image from "next/image"

const capabilities = [
  {
    n: "01",
    title: "Precision CNC Machining & Turning Services",
    body: "5-axis VMC milling and CNC turning with live tooling and C-axis capability, for complex geometries, tight tolerances, and multiple materials, aluminum, steel, titanium, and exotic alloys, with full quality traceability.",
    stats: [
      { value: "±0.005mm", label: "Tightest tolerance" },
      { value: "5-axis", label: "VMC machining" },
      { value: "Live tooling", label: "CNC turning" },
    ],
    image: "/assets/industry-components/automotive-component-manufacturing/automotive-component-3.jpg",
    imageAlt: "5-axis machined multi-cavity tooling component manufactured by EMUSKI",
    fit: "cover" as const,
  },
  {
    n: "02",
    title: "Sheet Metal & Fabrication",
    body: "Laser cutting, waterjet cutting, precision bending, punching, and certified welding, for structural and aesthetic sheet-metal parts and assemblies.",
    stats: [
      { value: "Laser +", label: "Waterjet cutting" },
      { value: "Certified", label: "Welding" },
      { value: "Full", label: "Assembly" },
    ],
    image: "/assets/industry-components/automotive-component-manufacturing/automotive-component-1.jpeg",
    imageAlt: "Laser-cut sheet-metal blanks manufactured by EMUSKI",
    fit: "cover" as const,
  },
  {
    n: "03",
    title: "Injection Molding",
    body: "Mold design, material selection, and tooling, engineered against a should-cost model before the mold is cut, not priced after. Low to high volume, multiple thermoplastic grades.",
    stats: [
      { value: "Engineered", label: "Before tooling" },
      { value: "Low–high", label: "Volume production" },
    ],
    image: "/docs/cost-breakdown-analysis-report/cost-breakdown-analysis-page-05.png",
    imageAlt: "Real EMUSKI cost breakdown report page for an injection-molded part, showing material and manufacturing data",
    fit: "contain" as const,
  },
  {
    n: "04",
    title: "Tooling & Prototyping",
    body: "In-house wire EDM and tool-room capability supports fast mold and fixture turnaround, so a prototype doesn't wait on an external tool shop's queue.",
    stats: [
      { value: "In-house", label: "Wire EDM" },
      { value: "3–5 days", label: "Typical turnaround" },
    ],
    image: "/assets/npdcentre/wireedm.png",
    imageAlt: "Wire EDM machine at EMUSKI's Bangalore engineering center",
    fit: "cover" as const,
  },
]

export function Capabilities() {
  return (
    <section id="capabilities" className="py-16 md:py-24 bg-white" aria-labelledby="capabilities-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 md:mb-20">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">How We Manufacture</p>
          <p id="capabilities-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Manufacturing processes, engineered before they're quoted
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Every process below runs through the same should-cost and DFM discipline before a part goes into
            production.
          </p>
        </div>

        <div className="space-y-20 md:space-y-28">
          {capabilities.map((cap, i) => {
            const reversed = i % 2 === 1
            return (
              <article
                key={cap.n}
                className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center border-t border-gray-200 pt-14 first:border-t-0 first:pt-0"
              >
                <div className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
                  <span
                    className="block text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-100 leading-none select-none"
                    aria-hidden="true"
                  >
                    {cap.n}
                  </span>
                  <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">{cap.title}</h2>
                  <p className="mt-4 text-gray-600 leading-relaxed max-w-xl">{cap.body}</p>

                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                    {cap.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="sr-only">{s.label}</dt>
                        <dd className="text-2xl font-bold text-emuski-teal-darker">{s.value}</dd>
                        <dd className="text-xs text-gray-500 mt-0.5">{s.label}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white p-3 group hover:shadow-xl transition-shadow duration-300">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-white">
                      <Image
                        src={cap.image}
                        alt={cap.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 35vw"
                        className={`${cap.fit === "cover" ? "object-cover" : "object-contain"} group-hover:scale-[1.02] transition-transform duration-500`}
                      />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
          Also available: die casting, investment casting, forging, stamping, and metal injection molding for
          high-volume production runs.
        </p>
      </div>
    </section>
  )
}
