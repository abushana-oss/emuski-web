import Image from "next/image"
import Link from "next/link"

export function GlobalSourcing() {
  return (
    <section className="py-16 md:py-24 bg-gray-50" aria-labelledby="sourcing-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Why Manufacture Through EMUSKI</p>
          <h2 id="sourcing-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            An engineering center, not a sourcing agent
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-12">
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xl aspect-[4/5] lg:aspect-auto lg:h-[440px]">
            <Image
              src="/assets/npdcentre/centerlessgrinding.png"
              alt="Centerless grinding machine at EMUSKI's Bangalore engineering center"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-white text-sm font-medium leading-snug">
                Engineering, machining, and mold-tooling capability sit under one roof, not spread across
                unrelated vendors.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">A verified supplier network</h3>
              <p className="text-gray-700 leading-relaxed">
                Where a part is better made by a partner shop than in-house, EMUSKI sources against the same
                should-cost model, through a network of 500+ verified suppliers, not an unvetted marketplace. See
                our framework for{" "}
                <Link
                  href="/blog/how-to-choose-the-right-manufacturing-partner-in-india-precision-machining-for-robotics-aerospace"
                  className="text-emuski-teal-darker font-medium hover:underline"
                >
                  evaluating precision machining partners
                </Link>{" "}
                in India before committing a program.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">A real comparison against China</h3>
              <p className="text-gray-700 leading-relaxed">
                Total cost of ownership, not unit price, is what should drive a sourcing decision. Our{" "}
                <Link
                  href="/blog/strategic-sourcing-for-oem-manufacturers-how-india-s-supplier-ecosystem-compares-to-china-for-precision-parts"
                  className="text-emuski-teal-darker font-medium hover:underline"
                >
                  comparison of India&apos;s supplier ecosystem against China for precision parts
                </Link>{" "}
                weighs tooling and qualification costs, IP protection risk, and quality-failure cost, not just
                the number on a quote.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivered outside India, already</h3>
              <p className="text-gray-700 leading-relaxed">
                New tooling designed and shipped to the US on a 3-day deadline other vendors missed. A cost
                workshop run for a German automotive client&apos;s India facelift program. Global delivery isn&apos;t
                a claim here, it&apos;s in the case studies above.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emuski-dark text-white rounded-2xl p-8 md:p-10 grid sm:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl md:text-3xl font-bold">500+</div>
            <p className="text-gray-300 text-sm mt-2">Verified suppliers in the sourcing network.</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold">15–20%</div>
            <p className="text-gray-300 text-sm mt-2">Typical sourcing cost savings identified.</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold">95%</div>
            <p className="text-gray-300 text-sm mt-2">Sourcing engagement success rate.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
