const rows = [
  {
    service: "Precision CNC Machining & Turning",
    processes: "5-axis VMC milling; CNC turning with live tooling and C-axis",
    materials: "Aluminum (6061, 7075), Stainless Steel (304, 316), Titanium, Inconel",
    tolerance: "Down to ±0.005 mm",
  },
  {
    service: "Sheet Metal Fabrication",
    processes: "Laser cutting, waterjet cutting, precision bending, punching, certified welding",
    materials: "Aluminum, Stainless Steel (304, 316)",
    tolerance: "Per drawing specification",
  },
  {
    service: "Injection Molding",
    processes: "Mold design, tooling, low-to-high volume molding",
    materials: "POM/Delrin, ABS, Polycarbonate, engineering thermoplastics",
    tolerance: "Per drawing specification",
  },
  {
    service: "Electronics Manufacturing Services (EMS)",
    processes: "SMT & PTH PCB assembly (PCBA), box-build & electro-mechanical assembly, cable harnessing, precision housings, heat sinks, EMI shielding, connector assemblies, enclosures",
    materials: "Aluminum, Stainless Steel (304, 316), engineering plastics",
    tolerance: "IPC-A-610 Class 2 & Class 3 / Per drawing specification",
  },
]

export function CapabilitiesTable() {
  return (
    <section id="capabilities-table" className="py-16 md:py-24 bg-gray-50" aria-labelledby="capabilities-table-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">At a Glance</p>
          <h2 id="capabilities-table-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Manufacturing capabilities, materials, and tolerances
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="px-5 py-3 font-semibold text-gray-900">Service</th>
                <th scope="col" className="px-5 py-3 font-semibold text-gray-900">Capabilities / Processes</th>
                <th scope="col" className="px-5 py-3 font-semibold text-gray-900">Supported Materials</th>
                <th scope="col" className="px-5 py-3 font-semibold text-gray-900">Standard Tolerances</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.service} className="border-b border-gray-100 last:border-b-0 align-top">
                  <th scope="row" className="px-5 py-4 font-semibold text-gray-900 whitespace-normal">{row.service}</th>
                  <td className="px-5 py-4 text-gray-600">{row.processes}</td>
                  <td className="px-5 py-4 text-gray-600">{row.materials}</td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{row.tolerance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
