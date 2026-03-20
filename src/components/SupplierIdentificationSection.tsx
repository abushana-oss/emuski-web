import Image from 'next/image';

export function SupplierIdentificationSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Supplier Identification and Part Localization in India
          </h2>
          <p className="mt-6 text-muted-foreground max-w-3xl mx-auto">
            To localize parts, we first take apart vehicles and figure out who makes each part using our supplier database. Then, we compare this with competitor data and our findings to find the right local suppliers. We work with these suppliers to develop the parts locally, and support the process with cost estimates through our should-costing service. After deriving the cost from our teardown benchmarking analysis, we recommend suppliers based on a rigorous selection process from our vetted database.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-muted-foreground">
            <p>We then engage potential suppliers to develop and localize the target parts, ensuring optimal results.</p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Image src="/assets/engineering/bullet.png" alt="bullet" width={24} height={24} className="w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Extensive Supplier Network</h4>
                  <p>Access a network of suppliers across India, featuring top-tier facilities with industry-leading certifications.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Image src="/assets/engineering/bullet.png" alt="bullet" width={24} height={24} className="w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Supplier Nomination & Negotiation</h4>
                  <p>EMUSKI supports technical evaluations, facility audits, and provides data to support vendor benchmarking and negotiation.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Image src="/assets/engineering/bullet.png" alt="bullet" width={24} height={24} className="w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Multiple Quotations</h4>
                  <p>We gather competitive quotes from various suppliers and locations to ensure the best value and flexibility.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Image src="/assets/engineering/bullet.png" alt="bullet" width={24} height={24} className="w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Vetted Supplier Access</h4>
                  <p>Customers benefit from a pool of pre-qualified, reliable suppliers with proven track records in quality and performance.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Image src="/assets/engineering/bullet.png" alt="bullet" width={24} height={24} className="w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Flexible Supply Chain Solutions</h4>
                  <p>Scalable and adaptable supply chain options tailored to meet changing production needs with ease.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Image src="/assets/engineering/supplier.png" alt="Supplier" width={400} height={300} className="rounded-lg shadow-lg" />
            <Image src="/assets/engineering/reduction.png" alt="Reduction" width={400} height={300} className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
