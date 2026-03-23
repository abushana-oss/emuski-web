'use client'

import { useState, useRef } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const featuredContent = [
  {
    id: "manufacturing",
    label: "Manufacturing",
    items: [
      {
        category: "OEM Manufacturing",
        title: "Complete Manufacturing Solutions",
        description: "Your One-Stop Strategic Companion for AI-Driven Manufacturing Excellence. At EMUSKI, where cost and quality meets profitability - delivering straight to your door.",
        image: "/assets/manufacturing/services.svg",
        link: "/assets/manufacturing/ManufacturingServices.pdf"
      },
      {
        category: "Custom Manufacturing",
        title: "Tailored Manufacturing Excellences",
        description: "Customized manufacturing solutions meeting your specific requirements with precision engineering and quality assurance at every step.",
        image: "/assets/manufacturing/solution.svg",
        link: "/manufacturing-services#custom"
      }
    ]
  },
  {
    id: "engineering",
    label: "Engineering",
    items: [
      {
        category: "Product Cost Estimation",
        title: "Mastering Costs Engineering Success",
        description: "From initial design and cost estimation to strategic sourcing and expert deployment, we provide integrated Engineering Innovations that drive efficiency, reduce costs, and accelerate your time-to-market",
        image: "/assets/engineering/automotive-engineering-cost-estimation.svg",
        link: "/cost-engineering#cost-estimation"
      },
      {
        category: "VAVE & Benchmarking",
        title: "Teardown & Value Engineering",
        description: "Comprehensive teardown analysis and value Engineering Innovations to optimize product costs while maintaining quality standards and performance requirements.",
        image: "/assets/engineering/product-teardown-analysis.png",
        link: "/cost-engineering#vave"
      }
    ]
  },
  {
    id: "ai-mithran",
    label: "AI Mithran",
    items: [
      {
        category: "AI-Driven Platform",
        title: "Next-GenAI - Mithran",
        description: "AI-powered intelligence for smarter product development, supply chain, and cost optimization. Transform traditional workflows into a smart, data-driven ecosystem.",
        image: "/assets/mitran/ai-mithran-platform-dashboard.png",
        link: "/solutions/ai#mithran-overview"
      },
      {
        category: "Smart Sourcing",
        title: "Intelligent Supplier Management",
        description: "AI-driven supplier identification, RFQ management, and quotation validation. Accelerate sourcing cycles by 30% with intelligent automation.",
        image: "/assets/mitran/ai-intelligent-sourcing-system.jpeg",
        link: "/solutions/ai#mithran-overview"
      }
    ]
  }
];

export const FeaturedTabs = () => {
  const [activeTab, setActiveTab] = useState("manufacturing");
  const [manufacturingSlide, setManufacturingSlide] = useState(0);
  const [engineeringSlide, setEngineeringSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Manufacturing services carousel images with SEO-optimized names
  const manufacturingSlides = [
    '/assets/manufacturingservices/custom-manufacturing-solutions.svg',
    '/assets/manufacturingservices/prototype-manufacturing-services.svg',
    '/assets/manufacturingservices/production-scaling-capabilities.svg',
    '/assets/manufacturingservices/on-demand-manufacturing.svg',
    '/assets/manufacturingservices/sheet-metal-fabrication.svg',
    '/assets/manufacturingservices/injection-molding-services.svg',
    '/assets/manufacturingservices/quality-control-manufacturing.svg',
    '/assets/manufacturingservices/assembly-services-manufacturing.svg',
    '/assets/manufacturingservices/finishing-services-manufacturing.svg'
  ];

  // Engineering services carousel images with SEO-optimized names
  const engineeringSlides = [
    '/assets/engineeringservices/engineering-service-cost-estimation.svg',
    '/assets/engineeringservices/engineering-service-value-analysis.svg',
    '/assets/engineeringservices/engineering-service-design-optimization.svg',
    '/assets/engineeringservices/engineering-service-supplier-sourcing.svg',
    '/assets/engineeringservices/engineering-service-quality-assurance.svg',
    '/assets/engineeringservices/engineering-service-process-improvement.svg',
    '/assets/engineeringservices/engineering-service-technical-support.svg',
    '/assets/engineeringservices/engineering-service-project-management.svg',
    '/assets/engineeringservices/engineering-service-manufacturing-consulting.svg',
    '/assets/engineeringservices/engineering-service-product-development.svg',
    '/assets/engineeringservices/engineering-service-benchmarking-analysis.svg',
    '/assets/engineeringservices/engineering-service-cost-modeling.svg',
    '/assets/engineeringservices/engineering-service-supply-chain-optimization.svg'
  ];

  const nextSlide = () => {
    if (activeTab === "manufacturing") {
      setManufacturingSlide((prev) => (prev + 1) % manufacturingSlides.length);
    } else if (activeTab === "engineering") {
      setEngineeringSlide((prev) => (prev + 1) % engineeringSlides.length);
    }
  };

  const prevSlide = () => {
    if (activeTab === "manufacturing") {
      setManufacturingSlide((prev) => (prev - 1 + manufacturingSlides.length) % manufacturingSlides.length);
    } else if (activeTab === "engineering") {
      setEngineeringSlide((prev) => (prev - 1 + engineeringSlides.length) % engineeringSlides.length);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeTab === "manufacturing" || activeTab === "engineering") {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    }
  };

  // Touch swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swiped left
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      // Swiped right
      prevSlide();
    }
  };

  // Render carousel for a given set of slides
  const renderCarousel = (slides: string[], currentSlide: number, setSlide: (index: number) => void) => (
    <div
      className="w-full relative"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Carousel Container */}
      <div className="relative bg-white rounded-md sm:rounded-lg border border-border overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Image Display */}
        <div
          ref={carouselRef}
          className="w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white relative"
        >
          <div className="relative w-full h-[45vh] min-h-[350px] xs:h-[48vh] xs:min-h-[380px] sm:h-[55vh] sm:min-h-[450px] md:h-[60vh] md:min-h-[500px] lg:h-[70vh] lg:min-h-[600px] xl:h-[75vh] xl:min-h-[650px] 2xl:h-[80vh] 2xl:max-h-[900px] py-3 xs:py-4 sm:py-6 md:py-8 lg:py-10 flex items-center justify-center">
            <Image
              key={currentSlide}
              src={slides[currentSlide]}
              alt={`${activeTab === 'manufacturing' ? 'Manufacturing' : 'Engineering'} Service ${currentSlide + 1} - Precision Manufacturing Solutions`}
              width={1600}
              height={900}
              className="object-contain px-1 py-1 xs:p-2 sm:p-4 md:p-6 w-full h-auto"
              loading={currentSlide === 0 ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          onTouchEnd={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-2 bottom-16 xs:bottom-20 sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto md:left-6 lg:left-8 bg-emuski-teal-darker/90 hover:bg-emuski-teal-darker active:bg-emuski-teal-darker hover:scale-105 active:scale-95 text-white p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-20 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
        </button>
        <button
          onClick={nextSlide}
          onTouchEnd={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-2 bottom-16 xs:bottom-20 sm:right-4 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto md:right-6 lg:right-8 bg-emuski-teal-darker/90 hover:bg-emuski-teal-darker active:bg-emuski-teal-darker hover:scale-105 active:scale-95 text-white p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-20 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center items-center gap-0 z-10 bg-white/85 backdrop-blur-sm px-1 py-0.5 sm:px-1.5 sm:py-1 rounded-full shadow-sm max-w-[calc(100vw-80px)]">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setSlide(index)}
              className="p-1 sm:p-1.5 touch-manipulation flex items-center justify-center"
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            >
              <span className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-emuski-teal-darker w-3 sm:w-4 md:w-5 h-1 sm:h-1.5'
                  : 'bg-gray-400 hover:bg-gray-600 active:bg-gray-700 w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5'
              }`} />
            </button>
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-2 xs:top-3 sm:top-6 md:top-8 right-2 xs:right-3 sm:right-6 md:right-8 bg-black/70 backdrop-blur-sm text-white px-2 xs:px-2.5 sm:px-4 md:px-5 py-1 xs:py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs xs:text-sm sm:text-base md:text-lg font-semibold shadow-md z-10">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-2 xs:py-3 sm:py-6 md:py-8 lg:py-10 bg-background">
      <div className="w-full px-2 xs:px-3 sm:px-6 md:px-8 lg:px-10 max-w-[2000px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex-wrap sm:flex-nowrap justify-center bg-secondary border-b border-border rounded-none h-auto p-0 mb-0 gap-0">
            {featuredContent.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-emuski-teal-darker/10 data-[state=active]:border-b-2 data-[state=active]:border-emuski-teal-darker data-[state=active]:text-emuski-teal-darker rounded-none px-3 xs:px-4 sm:px-6 py-3 xs:py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base font-medium backdrop-blur-sm transition-all flex-1 sm:flex-initial whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {featuredContent.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4 sm:mt-6 md:mt-8">
              {tab.id === "manufacturing" ? (
                renderCarousel(manufacturingSlides, manufacturingSlide, setManufacturingSlide)
              ) : tab.id === "engineering" ? (
                renderCarousel(engineeringSlides, engineeringSlide, setEngineeringSlide)
              ) : (
                <div className="grid md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
                  {tab.items.map((item, index) => (
                    <Card
                      key={index}
                      className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 rounded-md sm:rounded-lg"
                    >
                      <div className="relative h-48 xs:h-56 sm:h-64 overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                        <Image
                          src={item.image}
                          alt={`${item.title} - ${item.category}`}
                          width={1200}
                          height={675}
                          className={`${
                            tab.id === "manufacturing"
                              ? "object-contain"
                              : "object-cover"
                          } w-full h-auto group-hover:scale-105 transition-transform duration-500`}
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4">
                          <span className="inline-block px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 bg-emuski-teal-darker text-white text-[10px] xs:text-xs font-semibold rounded-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 xs:p-4 sm:p-5 md:p-6">
                        <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 xs:mb-2.5 sm:mb-3 group-hover:text-emuski-teal-darker transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs xs:text-sm sm:text-base text-muted-foreground mb-3 xs:mb-3.5 sm:mb-4 leading-relaxed">
                          {item.description}
                        </p>
                        <Link
                          href={
                            item.link ||
                            (tab.id === "engineering"
                              ? "/cost-engineering"
                              : "/solutions/ai")
                          }
                        >
                          <Button
                            variant="link"
                            className="text-emuski-teal-darker hover:text-emuski-teal-dark p-0 h-auto font-semibold"
                          >
                            Read More →
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
