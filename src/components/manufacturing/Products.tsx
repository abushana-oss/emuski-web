import Image from "next/image"

const products = [
  {
    title: "Precision Components",
    image: "/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-7.jpeg",
    imageAlt: "Precision-machined flanged component with tight bore tolerances",
    detail: "Single parts machined to tolerance, from prototype quantities to production runs.",
    featured: true,
  },
  {
    title: "Machined Assemblies",
    image: "/assets/industry-components/defense-technology-manufacturing/defense-component-6.jpeg",
    imageAlt: "Anodized precision-machined bracket component",
    detail: "Multi-part assemblies machined, finished, and fit-checked before shipment.",
  },
  {
    title: "Complex Sub-Assemblies",
    image: "/assets/industry-components/space-satellite-manufacturing/space-satellite-component-6.jpeg",
    imageAlt: "Precision-machined sub-assembly with clevis bracket feature",
    detail: "Multi-feature components combining turning, milling, and precision fits in one part.",
  },
  {
    title: "Sheet-Metal Assemblies",
    image: "/assets/industry-components/industrial-components-manufacturing/industrial-component-1.jpg",
    imageAlt: "Sheet-metal and machined components laid out at EMUSKI's production floor",
    detail: "Cut, formed, and welded assemblies, from brackets to enclosures.",
  },
]

export function Products() {
  const [featured, ...rest] = products

  return (
    <section className="py-16 md:py-24 bg-gray-50" aria-labelledby="products-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">What We Manufacture</p>
          <h2 id="products-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Not just processes, actual parts
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            A capability list doesn&apos;t tell you what we can build. These do.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <ProductPanel item={featured} className="lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-[520px]" large />

          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {rest.slice(0, 2).map((item) => (
              <ProductPanel key={item.title} item={item} className="aspect-[16/10] lg:h-[248px]" />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <ProductPanel item={rest[2]} className="aspect-[21/9]" />
        </div>
      </div>
    </section>
  )
}

type Product = (typeof products)[number]

function ProductPanel({ item, className = "", large = false }: { item: Product; className?: string; large?: boolean }) {
  return (
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
          {item.detail}
        </p>
      </div>
    </div>
  )
}
