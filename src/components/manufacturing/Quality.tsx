import Image from "next/image"
import { ShieldCheck, FileCheck2, Ruler, ClipboardList } from "lucide-react"

const points = [
  {
    icon: ShieldCheck,
    title: "ISO 9001:2015 certified",
    body: "Process discipline runs through the engineering center, not just a final visual check before shipment.",
  },
  {
    icon: Ruler,
    title: "Tolerances held, not estimated",
    body: "±0.005mm work is validated against dimensional requirements before a part is called done, not assumed from the machine's rated accuracy.",
  },
  {
    icon: FileCheck2,
    title: "Process control, not guesswork",
    body: "On a defense project where prior suppliers failed, EMUSKI ran anodization-thickness R&D to freeze the right tolerance values, eliminating a recurring assembly failure.",
  },
  {
    icon: ClipboardList,
    title: "Documented, every project",
    body: "Cost, material, and process data are captured in a structured report, the same discipline shown throughout this page, not produced only when a client asks.",
  },
]

export function Quality() {
  return (
    <section className="py-16 md:py-24 bg-gray-50" aria-labelledby="quality-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Quality</p>
            <h2 id="quality-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Manufacturing is controlled, not handed off into a black box
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              A quote isn&apos;t the end of EMUSKI&apos;s involvement. Process control and documentation carry
              through production.
            </p>

            <div className="mt-8 relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg aspect-[4/3]">
              <Image
                src="/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-4.jpeg"
                alt="Precision-machined component held to tight bore tolerances"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-8">
              {points.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-5 border-t border-gray-200 pt-8 first:border-t-0 first:pt-0">
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-emuski-teal/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-emuski-teal-darker" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
