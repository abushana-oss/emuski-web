import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"

const regions = [
  { name: "United States", path: "/cost-engineering-usa", note: "Should-cost, VAVE & DFM for US OEMs and procurement teams" },
  { name: "India", path: "/cost-engineering", note: "Pan-India cost engineering from our Bangalore facility" },
  { name: "United Kingdom", path: "/cost-engineering-uk", note: "Cost engineering and sourcing support for UK manufacturers" },
  { name: "Germany", path: "/cost-engineering-germany", note: "Cost engineering and sourcing support for German manufacturers" },
]

export function RegionDiscovery() {
  return (
    <section
      className="py-16 md:py-20 border-t border-b border-white/5 relative overflow-hidden"
      style={{ backgroundColor: "rgb(18, 26, 33)" }}
      aria-labelledby="region-discovery-heading"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold text-emuski-teal-light uppercase tracking-wide">Engineering Beyond Borders</p>
          <h2 id="region-discovery-heading" className="mt-2 text-2xl md:text-3xl font-bold text-white">
            One should-cost methodology, wherever you source from
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((r) => (
            <Link
              key={r.path}
              href={r.path}
              className="group flex flex-col justify-between bg-white/5 border border-white/10 hover:border-emuski-teal/40 hover:bg-white/10 rounded-xl p-5 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-emuski-teal-light flex-shrink-0" />
                <span className="font-bold text-white">{r.name}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{r.note}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emuski-teal-light">
                Explore
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
