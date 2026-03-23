'use client'

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FAQSection } from "@/components/FAQSection"
import ProductDeliverablesSection from "@/components/ProductDeliverablesSection"
import { ManufacturingServicesContent } from "@/components/ManufacturingServicesContent"
import { ManufacturingServicesTabs } from "@/components/ManufacturingServicesTabs"
import Link from "next/link"

export default function ManufacturingServices() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All");

  const manufacturingTabs = [
    "All",
    "CNC Machining",
    "Injection Molding", 
    "Prototyping",
    "Casting",
    "Fabrication",
    "Stamping",
    "Forging",
    "Metal Injection"
  ];

  const manufacturingServices = [
    {
      id: 1,
      title: "CNC Machining",
      description: "High quality, tight tolerance machined components with high scalability for diverse applications across various industries.",
      image: "/assets/engineeringservices/solution-we-offers/cnc-vmc-5-axis-precision-machining-prototypes.svg",
      detailedDescription: "EMUSKI's CNC machining services deliver precision-engineered components with tolerances as tight as ±0.005mm. Our state-of-the-art VMC machines handle complex geometries for aerospace, automotive, and medical industries. We specialize in aluminum, steel, titanium, and exotic alloys with complete quality traceability.",
      capabilities: ["5-axis VMC machining", "Tight tolerance ±0.005mm", "Complex geometries", "Multiple materials", "Quality certifications"]
    },
    {
      id: 2,
      title: "Plastic Injection Molding",
      description: "High volume manufacturing of plastic components suitable for identical products with tight tolerances.",
      image: "/assets/engineeringservices/solution-we-offers/injection-molding-low-volume-prototypes.svg",
      detailedDescription: "From prototype to mass production, EMUSKI's injection molding services ensure consistent quality and cost efficiency. Our advanced molding techniques support various thermoplastics and engineering grades with complete mold design and development capabilities.",
      capabilities: ["Low to high volume production", "Multiple plastic grades", "Mold design & development", "Quality control", "Cost optimization"]
    },
    {
      id: 3,
      title: "Prototyping Services",
      description: "One-off Rapid prototypes or direct low volume production runs from CAD data with lead times as low as 24 hours.",
      image: "/assets/engineeringservices/solution-we-offers/3d-printing-sla-sls-prototypes.svg",
      detailedDescription: "EMUSKI accelerates your product development with rapid prototyping using 3D printing (SLA, SLS, FDM), CNC machining, and vacuum casting. Perfect for design validation, functional testing, and market research with professional-grade finishes.",
      capabilities: ["24-48 hour turnaround", "Multiple technologies", "Design validation", "Functional prototypes", "Professional finishes"]
    },
    {
      id: 4,
      title: "Casting",
      description: "One-stop partner for all your Casting requirements including Die Casting, Investment Casting, and Sand Casting.",
      image: "/assets/engineeringservices/solution-we-offers/vacuum-casting-plastic-prototypes.svg",
      detailedDescription: "Comprehensive casting solutions from EMUSKI include die casting for high volumes, investment casting for complex shapes, and sand casting for large components. We work with aluminum, zinc, magnesium, and steel alloys with complete post-processing capabilities.",
      capabilities: ["Die casting", "Investment casting", "Sand casting", "Multiple alloys", "Post-processing"]
    },
    {
      id: 5,
      title: "Fabrication",
      description: "Complete fabrication solutions with excellent laser cutting, water jetting, sheet metal bending, punching & welding capabilities.",
      image: "/assets/engineeringservices/solution-we-offers/sheet-metal-prototypes.svg",
      detailedDescription: "EMUSKI's fabrication services combine precision cutting, forming, and joining technologies. Our capabilities include laser cutting, waterjet cutting, precision bending, punching, and certified welding for structural and aesthetic applications.",
      capabilities: ["Laser cutting", "Waterjet cutting", "Precision bending", "Certified welding", "Complete assembly"]
    },
    {
      id: 6,
      title: "Stamping",
      description: "Realize your prototyping and mass production stamping requirements with EMUSKI hassle-free.",
      image: "/assets/engineeringservices/solution-we-offers/cnc-vmc-aluminum-machining-prototypes.svg",
      detailedDescription: "Progressive and transfer stamping solutions from EMUSKI deliver high-volume precision parts with excellent repeatability. Our tool and die expertise ensures optimal part design and cost-effective production for automotive and electronics industries.",
      capabilities: ["Progressive stamping", "Transfer stamping", "Tool & die design", "High volume production", "Quality assurance"]
    },
    {
      id: 7,
      title: "Forging",
      description: "Source your forged parts with ease with EMUSKI - be it Open die forging, Closed die forging or Roll forging.",
      image: "/assets/engineeringservices/solution-we-offers/fixture-tooling-jig-manufacturing.svg",
      detailedDescription: "EMUSKI's forging capabilities deliver superior strength and grain structure for critical applications. Our open die, closed die, and roll forging processes work with steel, aluminum, and titanium alloys for aerospace, automotive, and industrial applications.",
      capabilities: ["Open die forging", "Closed die forging", "Roll forging", "Multiple alloys", "Critical applications"]
    },
    {
      id: 8,
      title: "Metal Injection Molding",
      description: "Manufacture high volume, intricate metal parts with ease using our Metal injection moulding services.",
      image: "/assets/engineeringservices/solution-we-offers/cnc-vmc-5-axis-precision-machining-prototypes.svg",
      detailedDescription: "MIM technology at EMUSKI enables complex metal geometries impossible with traditional machining. Perfect for high-volume production of intricate parts in stainless steel, tool steels, and exotic alloys with near-net-shape precision.",
      capabilities: ["Complex geometries", "High volume production", "Multiple metal alloys", "Near-net-shape", "Cost effective"]
    }
  ];

  const toggleCard = (cardId: number) => {
    const service = manufacturingServices.find(s => s.id === cardId);
    if (service) {
      // Map service title to tab name
      let tabName = service.title;
      if (service.title === "Metal Injection Molding") {
        tabName = "Metal Injection";
      } else if (service.title === "Plastic Injection Molding") {
        tabName = "Injection Molding";
      }
      
      // Switch to the service's tab and expand the card
      setActiveTab(tabName);
      setExpandedCard(cardId);
    }
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setExpandedCard(null); // Close any expanded cards when switching tabs
  };

  // Filter services based on active tab
  const filteredServices = manufacturingServices.filter(service => {
    if (activeTab === "All") {
      return true; // Show all services
    }
    if (activeTab === "Metal Injection") {
      return service.title === "Metal Injection Molding";
    }
    if (activeTab === "Injection Molding") {
      return service.title === "Plastic Injection Molding";
    }
    return service.title === activeTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 border-b border-border/30 overflow-hidden" style={{backgroundColor: 'rgb(18, 26, 33)'}}>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 pt-4 sm:pt-5 md:pt-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Category Badge */}
                <div className="flex justify-center">
                  <span className="text-emuski-teal text-xs sm:text-sm font-semibold tracking-wider uppercase">
                    Manufacturing Excellence
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2">
                  You Design It, We Build It
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  We are your manufacturing partner from design to delivery. Our team helps you balance cost and quality so every part is reliable, profitable, and on time.
                </p>

                {/* CTA Button */}
                <div className="pt-2 sm:pt-4 flex justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-emuski-teal-darker hover:bg-emuski-teal-dark text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ManufacturingServicesTabs />
      <ManufacturingServicesContent />

      

      {/* End To End Manufacturing Solutions Section */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="manufacturing-solutions">
            <div className="content text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                End To End Manufacturing Solutions With Agility And Scalability!
              </h3>
              <p className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
                EMUSKI is a one-stop partner to all Industrial sectors, helping companies transfer their manufacturing value 
                chain with our complete manufacturing and engineering solutions - from Prototyping to Production.
              </p>
            </div>

            {/* Tabs */}
            <div className="tabs-container mb-6">
              <div className="flex flex-wrap justify-center gap-1 mb-6">
                {manufacturingTabs.map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`tab-btn px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                      activeTab === tab
                        ? 'active bg-emuski-teal-darker text-white'
                        : 'bg-gray-200 hover:bg-emuski-teal/20 text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Container */}
            <div className="card-container">
              <div className={`grid gap-4 justify-center ${
                filteredServices.length === 1 
                  ? 'grid-cols-1 max-w-sm mx-auto' 
                  : filteredServices.length <= 4 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}>
                
                {filteredServices.map((service) => (
                  <div 
                    key={service.id}
                    className={`expandable-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                      expandedCard === service.id 
                        ? 'border-2 border-emuski-teal-darker ring-2 ring-emuski-teal/20' 
                        : 'border border-gray-200 hover:border-emuski-teal'
                    }`}
                  >
                    <div className="card-main p-4">
                      <figure className="mb-3">
                        <img 
                          src={service.image}
                          alt={service.title}
                          className="w-20 h-20 mx-auto"
                        />
                      </figure>
                      <h2 className="card-head text-lg font-bold text-gray-900 mb-2">{service.title}</h2>
                      <p className="card-desc text-gray-600 text-xs leading-relaxed mb-3">
                        {service.description}
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (expandedCard === service.id) {
                            // If this card is expanded, go back to "All" view
                            setActiveTab("All");
                            setExpandedCard(null);
                          } else {
                            // If not expanded, switch to this service and expand
                            toggleCard(service.id);
                          }
                        }}
                        className="learn-more text-emuski-teal-darker font-semibold text-xs hover:text-emuski-teal-dark transition-colors cursor-pointer border-none bg-transparent p-0"
                      >
                        {expandedCard === service.id ? 'Show All Services ↑' : 'Learn More →'}
                      </button>
                    </div>
                    
                    {/* Expanded Content */}
                    <div className={`expanded-content border-t border-gray-100 bg-gradient-to-br from-emuski-teal/5 to-emuski-teal-dark/5 transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedCard === service.id 
                        ? 'max-h-96 opacity-100 p-4' 
                        : 'max-h-0 opacity-0 p-0'
                    }`}>
                      {expandedCard === service.id && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-bold text-emuski-teal-darker mb-2">EMUSKI Excellence in {service.title}</h3>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {service.detailedDescription}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-gray-800 mb-2">Key Capabilities:</h4>
                            <ul className="grid grid-cols-1 gap-1">
                              {service.capabilities.map((capability, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-emuski-teal-darker rounded-full mr-2 flex-shrink-0"></div>
                                  {capability}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="pt-2 border-t border-emuski-teal/20">
                            <Link 
                              href="/contact" 
                              className="inline-flex items-center text-xs font-semibold text-emuski-teal-darker hover:text-emuski-teal-dark transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Get Quote for {service.title} →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductDeliverablesSection />

      <section className="py-16 md:py-20 bg-emuski-teal-darker text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Ready to Start Your Manufacturing Project?
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Get in touch with our manufacturing experts to discuss your requirements and receive a customized quote.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-emuski-teal-darker font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        compact={true}
        maxItems={8}
        showCategories={false}
        usePageSpecific={true}
      />

      <Footer />
    </div>
  )
}
