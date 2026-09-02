import Image from "next/image"
import Link from "next/link"

const industries = [
  {
    title: "Aerospace",
    image: "/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-2.jpeg",
    imageAlt: "Precision-machined aerospace component with tight bore tolerances",
    challenge: "Tolerance stack-up and material traceability drive the cost model here, not just process time.",
    detail: "Traceability requirements aerospace OEMs demand add cost a generic manufacturing quote won't itemize.",
    featured: true,
  },
  {
    title: "Defense",
    image: "/assets/industry-components/defense-technology-manufacturing/defense-component-1.jpeg",
    imageAlt: "Complex machined defense bracket with precision-bored bearing insert",
    challenge: "Compliance overhead a commercial quote doesn't carry.",
    detail: "Process-control work, like anodization-thickness R&D behind a zero-zero tolerance mating.",
    href: "/blog/defense-sector",
  },
  {
    title: "Medical Devices",
    image: "/assets/industry-components/medical-device-manufacturing/medical-device-component-3.jpeg",
    imageAlt: "Precision-turned medical device components with concentric machined finish",
    challenge: "FDA and ISO 13485 process requirements factor into the cost model.",
    detail: "Low-volume, high-mix economics, different from high-volume commercial parts.",
  },
  {
    title: "Automotive & EV",
    image: "/assets/industry-components/automotive-component-manufacturing/automotive-component-2.jpg",
    imageAlt: "CNC machine actively cutting an automotive component with coolant spray",
    challenge: "Tooling amortization drives the economics, not just per-part machining time.",
    detail: "A should-cost model separates piece-price from tooling investment to be useful at volume.",
  },
  {
    title: "Industrial Equipment",
    image: "/assets/industry-components/industrial-components-manufacturing/industrial-component-1.jpg",
    imageAlt: "Industrial equipment components on EMUSKI's production floor",
    challenge: "Often a process-selection question as much as a cost question.",
    detail: "Casting, fabrication, and machining routes each carry a different cost structure worth comparing.",
  },
]

export function Industries() {
  const [featured, ...rest] = industries

  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="industries-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Industries</p>
          <h2 id="industries-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Industry Solutions (Aerospace, Medical Devices ISO 13485, EV Mobility)
          </h2>
          <p className="mt-4 text-lg text-gray-600">Manufacturing looks different by vertical.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <IndustryPanel item={featured} className="lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-[520px]" large />

          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {rest.slice(0, 2).map((item) => (
              <IndustryPanel key={item.title} item={item} className="aspect-[16/10] lg:h-[248px]" />
            ))}
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          {rest.slice(2).map((item) => (
            <IndustryPanel key={item.title} item={item} className="aspect-[16/9]" />
          ))}
        </div>
      </div>
    </section>
  )
}

type Industry = (typeof industries)[number]

function IndustryPanel({ item, className = "", large = false }: { item: Industry; className?: string; large?: boolean }) {
  const content = (
    <div className={`group relative rounded-2xl overflow-hidden ${className}`}>
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <h3 className={`font-bold text-white ${large ? "text-2xl md:text-3xl" : "text-lg"}`}>{item.title}</h3>
        <p className={`text-gray-200 mt-2 leading-snug ${large ? "text-sm md:text-base max-w-md" : "text-xs"}`}>
          {item.challenge}
        </p>
        {large && <p className="text-gray-300 text-xs md:text-sm mt-2 max-w-md leading-relaxed">{item.detail}</p>}
      </div>
    </div>
  )

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    )
  }
  return content
}
