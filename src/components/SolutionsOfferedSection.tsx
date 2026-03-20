import { Check } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const solutions = [
  {
    title: "CNC/VMC Plastic & Metal 5-Axis Precision Machining Prototypes",
    description: "Utilize advanced CNC/VMC machines for high-precision prototyping of plastic and metal components with complex geometries."
  },
  {
    title: "CNC/VMC Aluminum Machining Prototypes",
    description: "Specialized in machining aluminum prototypes with exceptional accuracy and surface finish for various industrial applications."
  },
  {
    title: "3D Printing SLA & SLS Prototypes",
    description: "Rapidly produce intricate prototypes using Stereolithography (SLA) and Selective Laser Sintering (SLS) 3D printing technologies."
  },
  {
    title: "Sheet Metal Prototypes",
    description: "Fabricate custom sheet metal prototypes with precision bending, cutting, and forming for functional testing and design validation."
  },
  {
    title: "Vacuum Casting Plastic Prototypes",
    description: "Create high-quality plastic prototypes with excellent surface details and material properties using vacuum casting techniques."
  },
  {
    title: "Injection Molding Low-Volume Prototypes",
    description: "Produce low-volume injection molded prototypes for functional testing and market evaluation, bridging the gap to mass production."
  },
  {
    title: "Expert in Fixture, tooling, jig manufacturing",
    description: "Design and manufacture custom fixtures, tooling, and jigs to optimize your production processes and ensure consistent quality."
  },
];

export function SolutionsOfferedSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Image src="/assets/manufacturing/solution.svg" alt="Solutions Offered" width={500} height={400} className="rounded-lg shadow-lg" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-emuski-dark-blue mb-6 text-left">
              SOLUTION WE OFFER
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {solutions.map((solution, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="flex items-center text-left">
                    <Check className="h-6 w-6 text-emuski-teal-darker mr-4" />
                    <span className="text-lg font-semibold text-muted-foreground">{solution.title}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pl-10">{solution.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
