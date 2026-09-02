export const faqData = [
  {
    question: "What can EMUSKI manufacture?",
    answer:
      "Precision machined components, sheet-metal parts and assemblies, injection-molded plastic parts, and complex sub-assemblies, across aerospace, defense, medical device, automotive, and industrial applications. See What We Manufacture above for real examples.",
  },
  {
    question: "Can EMUSKI review my part before manufacturing?",
    answer:
      "Yes. Every project goes through a DFM review and should-cost model before process or tooling is locked, so manufacturability and cost are known before production starts, not discovered during it.",
  },
  {
    question: "Can you validate a supplier quote we already have?",
    answer:
      "Yes. We build an independent should-cost model and compare it line by line against the supplier's number, to show where price and cost diverge.",
  },
  {
    question: "Do you handle assemblies, or only single components?",
    answer:
      "Both. Machined and sheet-metal assemblies are fit-checked before shipment, not just individually machined and boxed.",
  },
  {
    question: "What information do you need to start?",
    answer:
      "A drawing, CAD file, or BOM is enough to begin an engineering and cost review. A full data package isn't required upfront.",
  },
  {
    question: "How does EMUSKI's India-based model work for a global buyer?",
    answer:
      "Engineering, machining, and sourcing run out of an ISO 9001:2015 certified center in Bangalore, backed by a network of 500+ verified suppliers. We've delivered internationally under deadline, including a 3-day turnaround shipment to the US.",
  },
]

export function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-gray-50" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">FAQ</p>
            <h2 id="faq-heading" className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {faqData.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-gray-900">
                  {faq.question}
                  <span className="flex-shrink-0 text-emuski-teal-darker text-xl leading-none transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
