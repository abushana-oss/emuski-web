import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import Image from "next/image";

const servicesData = {
  "on-demand": {
    title: "On-Demand Manufacturing",
    tagline: "Flexible production when you need it",
    image: "/assets/industry-components/defense-technology-manufacturing/defense-component-16.svg",
    features: [
      { title: "No Minimum Orders", desc: "From single units to full production runs" },
      { title: "Quick Response", desc: "Fast quotes and rapid turnaround times" },
      { title: "Inventory Freedom", desc: "Reduce warehousing costs and risks" },
      { title: "Scalable Capacity", desc: "Ramp up or down based on demand" }
    ]
  },
  "prototyping": {
    title: "Rapid Prototyping",
    tagline: "From concept to reality in record time",
    image: "/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-10.svg",
    features: [
      { title: "Multi-Technology", desc: "CNC, 3D printing (SLA, SLS, FDM, MIF - metal), vacuum casting" },
      { title: "Fast Turnaround", desc: "Rapid iterations to speed up development" },
      { title: "Design Validation", desc: "Functional testing before production" },
      { title: "Cost Optimization", desc: "Value engineering from the start" }
    ]
  },
  "custom": {
    title: "Custom Manufacturing",
    tagline: "Tailored solutions for unique requirements",
    image: "/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-6.svg",
    features: [
      { title: "Precision Machining", desc: "VMC for complex parts" },
      { title: "Material Expertise", desc: "Metals, plastics, and composites" },
      { title: "Tight Tolerances", desc: "±0.005mm precision capabilities" },
      { title: "Custom Fixtures", desc: "Specialized tooling and jigs" }
    ]
  },
  "scaling": {
    title: "Production Scaling",
    tagline: "Seamless transition from prototype to production",
    image: "/assets/industry-components/defense-technology-manufacturing/defense-component-22.svg",
    features: [
      { title: "Capacity Planning", desc: "Strategic scaling without quality compromise" },
      { title: "Process Optimization", desc: "Lean manufacturing principles" },
      { title: "Supply Chain", desc: "Integrated sourcing and logistics" },
      { title: "Quality Systems", desc: "ISO-Certified production standards" }
    ]
  }
};

function ServiceTabContent({ service }: { service: typeof servicesData["on-demand"] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {service.title}
        </h2>
        <p className="text-sm sm:text-base text-emuski-teal-darker font-medium">
          {service.tagline}
        </p>
      </div>

      {service.image && (
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="aspect-[16/9] sm:aspect-[21/9] relative">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 75vw"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {service.features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:bg-gray-100 hover:border-emuski-teal-dark hover:shadow-md transition-all duration-200"
          >
            <h3 className="font-semibold text-sm text-gray-900 mb-1">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-xs leading-snug">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ManufacturingServicesTabs() {
  return (
    <section id="manufacturing-tabs" className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <Tabs defaultValue="on-demand" className="w-full">
          <div className="max-w-2xl mx-auto mb-5">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100/80 border border-gray-200 rounded-lg p-1">
              <TabsTrigger value="on-demand" className="text-xs sm:text-sm px-2 py-1.5 data-[state=active]:bg-emuski-teal-dark data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200">On-Demand</TabsTrigger>
              <TabsTrigger value="prototyping" className="text-xs sm:text-sm px-2 py-1.5 data-[state=active]:bg-emuski-teal-dark data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200">Prototyping</TabsTrigger>
              <TabsTrigger value="custom" className="text-xs sm:text-sm px-2 py-1.5 data-[state=active]:bg-emuski-teal-dark data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200">Custom</TabsTrigger>
              <TabsTrigger value="scaling" className="text-xs sm:text-sm px-2 py-1.5 data-[state=active]:bg-emuski-teal-dark data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200">Scaling</TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(servicesData).map(([key, service]) => (
            <TabsContent key={key} value={key} className="mt-4 fade-in">
              <ServiceTabContent service={service} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
