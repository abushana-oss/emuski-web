const rows = [
  {
    attribute: "Engineering Support (DFM & VAVE)",
    emuski: "Built into every project before tooling is cut",
    buildToPrint: "Quoted to spec as drawn, rarely challenged",
    overseas: "Limited; DFM feedback usually absent or after the fact",
  },
  {
    attribute: "Tolerances",
    emuski: "Down to ±5µm (±0.005mm)",
    buildToPrint: "Standard shop tolerances, verified per drawing",
    overseas: "Varies by vendor; verification harder to audit remotely",
  },
  {
    attribute: "IP Protection & Legal Governance",
    emuski: "NDA-backed, India-based engineering under one legal jurisdiction",
    buildToPrint: "Depends on individual vendor agreements",
    overseas: "Cross-border IP enforcement is slower and more complex",
  },
  {
    attribute: "Communication & Project Management",
    emuski: "English-speaking team, dedicated project manager, overlapping business hours",
    buildToPrint: "Single point of contact, but limited engineering dialogue",
    overseas: "Time-zone gaps and language barriers slow iteration",
  },
  {
    attribute: "Cost Optimization",
    emuski: "15–25% BOM savings via should-cost modeling",
    buildToPrint: "Priced to quote; savings require a separate cost review",
    overseas: "Lower unit price, but tooling, logistics, and rework can erode it",
  },
]

export function SourcingComparison() {
  return (
    <section id="sourcing-comparison" className="py-16 md:py-24 bg-white" aria-labelledby="sourcing-comparison-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Sourcing Models Compared</p>
          <h2 id="sourcing-comparison-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Direct India sourcing vs. build-to-print vs. overseas sourcing
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="px-5 py-3 font-semibold text-gray-900">Attribute</th>
                <th scope="col" className="px-5 py-3 font-semibold text-white bg-emuski-dark">Direct India Sourcing (EMUSKI)</th>
                <th scope="col" className="px-5 py-3 font-semibold text-gray-900">Traditional Build-to-Print</th>
                <th scope="col" className="px-5 py-3 font-semibold text-gray-900">China / Overseas Sourcing</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.attribute} className="border-b border-gray-100 last:border-b-0 align-top">
                  <th scope="row" className="px-5 py-4 font-semibold text-gray-900 whitespace-normal">{row.attribute}</th>
                  <td className="px-5 py-4 text-gray-900 bg-emuski-teal/5 font-medium">{row.emuski}</td>
                  <td className="px-5 py-4 text-gray-600">{row.buildToPrint}</td>
                  <td className="px-5 py-4 text-gray-600">{row.overseas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
