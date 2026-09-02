export function ElectronicsManufacturing() {
  return (
    <section id="ems" className="py-16 md:py-24 bg-white" aria-labelledby="ems-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Electronics</p>
          <h2 id="ems-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Turnkey Electronics Manufacturing Services (EMS)
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            SMT and PTH PCB assembly (PCBA), box-build integration and electro-mechanical assembly, and cable
            harnessing, alongside precision housings, heat sinks, electromagnetic shielding components, connector
            assemblies, and enclosures for consumer and industrial electronics OEMs, engineered against a
            should-cost model and manufactured under ESD-safe conditions. Supports both prototype runs and
            high-volume production.
          </p>
        </div>

        <dl className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl">
          {[
            { label: "SMT & PTH PCB Assembly (PCBA)" },
            { label: "Box-Build & Electro-Mechanical Assembly" },
            { label: "Cable Harnessing & Wire Harnesses" },
            { label: "Precision Housings & Enclosures" },
            { label: "Heat Sinks" },
            { label: "EMI / EMC Shielding Components" },
            { label: "Connector Assemblies" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 p-5 bg-gray-50">
              <dt className="font-semibold text-gray-900 text-sm">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
