import { Check } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const services = [
  {
    title: "RAPID PROTOTYPING",
    description: "Quickly transform your ideas into tangible prototypes for testing and validation, accelerating your product development cycle."
  },
  {
    title: "RAPID MANUFACTURING",
    description: "Efficiently produce small to medium batches of parts with speed and precision, ideal for initial production runs and market testing."
  },
  {
    title: "STRATEGIC SOURCING SUPPORT",
    description: "Leverage our global network and expertise to identify the best suppliers, negotiate favorable terms, and optimize your supply chain for cost and quality."
  },
  {
    title: "LOW-VOLUME PRODUCTION OF CUSTOM PARTS",
    description: "Get high-quality, custom-made parts in low volumes without the overheads of mass production, perfect for specialized applications."
  },
];

export function PartManufacturingServices() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-emuski-dark-blue mb-6 text-left">
              OUR SERVICE IN PART MANUFACTURING
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {services.map((service, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="flex items-center text-left">
                    <Check className="h-6 w-6 text-emuski-teal-darker mr-4" />
                    <span className="text-lg font-semibold text-muted-foreground">{service.title}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pl-10">{service.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <Image src="/assets/manufacturing/services.svg" alt="Part Manufacturing Excellences" width={500} height={400} className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
