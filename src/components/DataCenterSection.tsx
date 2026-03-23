'use client'

import { useState, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

const serviceItems = [
  // Engineering Innovations
  {
    category: "Precision Engineering",
    title: "CNC Machining Excellence",
    description: "High-precision CNC machining capabilities delivering complex geometries with tight tolerances for automotive and aerospace applications.",
    image: "/assets/componets/Part-Photos/IMG-20250310-WA0011.jpg",
    link: "/cost-engineering#cnc"
  },
  {
    category: "Engineering Innovations",
    title: "Component Design & Validation",
    description: "Complete product development lifecycle from concept to production, including rapid prototyping and validation services.",
    image: "/assets/componets/forus/WhatsApp Image 2025-08-23 at 10.06.37 PM.jpeg",
    link: "/cost-engineering#design"
  },
  {
    category: "Quality Assurance",
    title: "Quality Control Systems",
    description: "Advanced quality inspection and testing protocols ensuring every component meets exact specifications and industry standards.",
    image: "/assets/componets/Part-Photos/IMG-20250519-WA0016.jpg",
    link: "/cost-engineering#quality"
  },
  {
    category: "Custom Solutions",
    title: "Fixture Design & Tooling",
    description: "Custom-designed fixtures and tooling solutions to optimize manufacturing processes and ensure consistent component quality.",
    image: "/assets/componets/3-Oct-25/cent_fixture/WhatsApp Image 2025-10-27 at 3.21.23 PM.jpeg",
    link: "/manufacturing-services#custom"
  },
  // Manufacturing Excellences
  {
    category: "Manufacturing Excellences",
    title: "Production Line Excellence",
    description: "Professional production line setup and manufacturing excellence with advanced assembly stations and workflow optimization.",
    image: "/assets/componets/Matica-Photos2/DSC_1008.JPG",
    link: "/manufacturing-services#scaling"
  },
  {
    category: "Manufacturing Excellences",
    title: "Precision Component Manufacturing",
    description: "High-precision manufactured components showcasing our CNC machining capabilities and partnership with automotive OEMs.",
    image: "/assets/componets/Part-Photos/IMG-20250206-WA0025.jpg",
    link: "/manufacturing-services#oem"
  },
  // Next-GenAI Services
  {
    category: "Next-GenAI",
    title: "Mithran AI Platform",
    description: "AI-powered intelligence for smarter product development, supply chain, and cost optimization delivering measurable results for OEMs.",
    image: "/assets/componets/3-Oct-25/WhatsApp Image 2025-08-28 at 10.34.17 AM.jpeg",
    link: "/solutions/ai#mithran-overview"
  },
];

const quickLineupServices = [
  {
    title: "CNC Machining Excellence",
    category: "Precision Engineering",
    link: "/cost-engineering#cnc"
  },
  {
    title: "Component Design & Validation", 
    category: "Engineering Innovations",
    link: "/cost-engineering#design"
  },
  {
    title: "Quality Control Systems",
    category: "Quality Assurance", 
    link: "/cost-engineering#quality"
  },
  {
    title: "Fixture Design & Tooling",
    category: "Custom Solutions",
    link: "/manufacturing-services#custom"
  },
  {
    title: "Production Line Excellence",
    category: "Manufacturing Excellences",
    link: "/manufacturing-services#scaling"
  },
  {
    title: "Precision Component Manufacturing",
    category: "Manufacturing Excellences", 
    link: "/manufacturing-services#oem"
  },
  {
    title: "Mithran AI Platform",
    category: "Next-GenAI",
    link: "/solutions/ai#mithran-overview"
  }
];

export const DataCenterSection = () => {
  const [showQuickLineup, setShowQuickLineup] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleQuickLineup = () => {
    setShowQuickLineup(prev => !prev);
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowQuickLineup(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowQuickLineup(false);
    }, 200);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-secondary/30" style={{ marginTop: '0' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Side - Title and Description */}
            <div className="lg:col-span-1 space-y-4">
              
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive engineering and manufacturing solutions designed to drive product value, cost optimization, and supply chain excellence through deep expertise and advanced technology.
              </p>
              
              {/* Quick Lineup */}
              <button
                onClick={toggleQuickLineup}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="mt-4 text-emuski-teal-darker hover:text-emuski-teal-dark font-medium flex items-center transition-colors"
              >
                Quick Lineup
                <ChevronDown className={`ml-2 h-4 w-4 transform transition-transform ${showQuickLineup ? 'rotate-180' : ''}`} />
              </button>
              
              {showQuickLineup && (
                <div 
                  className="mt-3 space-y-1 bg-white p-3 rounded-lg shadow-lg border border-gray-200"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {quickLineupServices.map((service, index) => (
                    <Link 
                      key={index}
                      href={service.link} 
                      className="group flex flex-col py-2 px-3 -mx-2 rounded text-sm text-gray-600 hover:text-emuski-teal-darker hover:bg-emuski-teal/5 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 group-hover:bg-emuski-teal-darker rounded-full mr-3 transition-colors"></span>
                        <span className="flex-1 flex items-center font-medium">
                          {service.title}
                          {service.title === "Mithran AI Platform" && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded border border-slate-300">
                              BETA
                            </span>
                          )}
                        </span>
                        <svg className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                      {/* Find the corresponding service item to get the description */}
                      {serviceItems.find(item => item.title === service.title)?.description && (
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          {serviceItems.find(item => item.title === service.title)?.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Horizontal Scroll */}
            <div className="flex lg:hidden justify-end mb-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={scrollLeft}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white border-emuski-teal"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={scrollRight}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white border-emuski-teal"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            <div className="lg:col-span-2">
              {/* Navigation Arrows */}
              <div className="hidden lg:flex justify-end mb-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={scrollLeft}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white border-emuski-teal"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={scrollRight}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white border-emuski-teal"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-hide"
              >
                {serviceItems.map((item, index) => (
                  <Card key={index} className="flex-shrink-0 w-80 sm:w-96 group bg-white border-gray-200 hover:border-emuski-teal-darker/50 transition-all duration-300 cursor-pointer overflow-hidden">
                    <Link href={item.link} className="block h-full hover:no-underline">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">{item.category}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Service</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
           
        </div>
      </section>
  );
};
