import React, { memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

const manufacturingExcellenceItems = [
  {
    title: "Automotive Excellence Partnership",
    description: "EMUSKI delivered 500,000 precision brake components for a Tier-1 automotive supplier, achieving zero defects across 18 months of production",
    image: "/assets/componets/Part-Photos/IMG-20250206-WA0025.jpg",
    link: "/manufacturing-services"
  },
  {
    title: "Aerospace Innovation Story",
    description: "Our 4-axis CNC capabilities enabled a aerospace client to reduce component weight by 35% while improving structural integrity for next-gen aircraft",
    image: "/assets/componets/Part-Photos/IMG-20250310-WA0011.jpg",
    link: "/manufacturing-services"
  },
  {
    title: "Medical Device Success",
    description: "EMUSKI's cleanroom assembly operations helped a medical device startup achieve FDA approval 4 months ahead of schedule, accelerating life-saving technology to market",
    image: "/assets/componets/Matica-Photos2/DSC_1006.JPG",
    link: "/manufacturing-services"
  },
  {
    title: "Defense Partnership Achievement",
    description: "Our quality systems exceeded military specifications, earning EMUSKI a 5-year partnership for critical defense components valued at $12M annually",
    image: "/assets/componets/Part-Photos/IMG-20250519-WA0016.jpg",
    link: "/manufacturing-services"
  },
  {
    title: "Smart Factory Implementation",
    description: "Our custom fixture design reduced cycle time by 45% for an electronics manufacturer, increasing annual capacity from 800K to 1.2M units with same workforce",
    image: "/assets/componets/3-Oct-25/cent_fixture/WhatsApp Image 2025-10-27 at 3.21.23 PM.jpeg",
    link: "/manufacturing-services"
  },
  {
    title: "R&D Partnership Success",
    description: "EMUSKI's rapid prototyping enabled a Fortune 500 client to test 15 design iterations in 3 weeks, accelerating product launch by 6 months in competitive market",
    image: "/assets/componets/forus/WhatsApp Image 2025-08-23 at 10.06.37 PM.jpeg",
    link: "/manufacturing-services"
  }
];

const ManufacturingExcellenceSection = memo(() => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Manufacturing Excellence</h2>
          <div className="flex space-x-2">
            <Button onClick={scrollLeft} className="bg-emuski-teal-darker hover:bg-emuski-teal-darker/80 text-white border-emuski-teal-darker">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button onClick={scrollRight} className="bg-emuski-teal-darker hover:bg-emuski-teal-darker/80 text-white border-emuski-teal-darker">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-hide" ref={scrollContainerRef}>
          {manufacturingExcellenceItems.map((item, index) => (
            <div key={index} className="rounded-lg border text-card-foreground shadow-sm flex-shrink-0 w-72 sm:w-80 group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
              <a href={item.link} className="block h-full hover:no-underline">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={320}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-emuski-teal-dark transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ManufacturingExcellenceSection;