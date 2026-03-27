'use client'

import { useState } from "react";
import Image from "next/image";

const solutions = [
  {
    title: "3D Printing",
    subtitle: "SLA, SLS, FDM, MIF - metal",
    description: "Advanced additive manufacturing with SLA, SLS, FDM, MIF - metal technologies for rapid prototyping and functional parts.",
    image: "/assets/engineeringservices/solution-we-offers/3d-printing-sla-sls-prototypes.svg"
  },
  {
    title: "VMC",
    subtitle: "VMC Machining",
    description: "High-precision VMC machining for complex geometries and tight tolerances in critical applications.",
    image: "/assets/engineeringservices/solution-we-offers/cnc-vmc-5-axis-precision-machining-prototypes.svg"
  },
  {
    title: "Turning Centre",
    subtitle: "Machining",
    description: "Specialized Turning Centre machining delivering lightweight, high-strength components for demanding applications.",
    image: "/assets/engineeringservices/solution-we-offers/cnc-vmc-aluminum-machining-prototypes.svg"
  },
  {
    title: "Fixture & Tooling",
    subtitle: "Manufacturing",
    description: "Custom fixture, tooling, and jig design to optimize production processes and ensure consistency.",
    image: "/assets/engineeringservices/solution-we-offers/fixture-tooling-jig-manufacturing.svg"
  },
  {
    title: "Injection Molding",
    subtitle: "Low-Volume",
    description: "Low-volume injection molding for rapid prototyping and production with high-quality plastic components.",
    image: "/assets/engineeringservices/solution-we-offers/injection-molding-low-volume-prototypes.svg"
  },
  {
    title: "Sheet Metal",
    subtitle: "Prototyping",
    description: "Precision sheet metal fabrication for enclosures, brackets, and custom metal components.",
    image: "/assets/engineeringservices/solution-we-offers/sheet-metal-prototypes.svg"
  },
  {
    title: "Vacuum Casting",
    subtitle: "Plastic Parts",
    description: "Plastic vacuum casting for high-quality prototypes with excellent surface finish and detail.",
    image: "/assets/engineeringservices/solution-we-offers/vacuum-casting-plastic-prototypes.svg"
  }
];

export const ManufacturingNPDSection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-xs font-bold text-emuski-teal-darker uppercase tracking-wider">New Product Development Centre</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">
            EMUSKI NPD Centre
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We support OEMs in <span className="font-semibold text-gray-900">Medical Devices, Defence, Space Tech, Aerospace, and EV & Automotive</span> through our NPD Center, equipped with in-house <span className="font-semibold text-emuski-teal-darker">VMCs, Turning Centers, Wire EDM, and Centerless Grinders</span>. We also offer <span className="font-semibold text-emuski-teal-darker">3D Printing, Injection Molding, Vacuum Casting, Gravity Die Casting, and Forging</span> — enabling <span className="font-bold text-emuski-teal-darker">complete product development under one roof.</span>
          </p>
        </div>

        {/* Solutions Title */}
        <h3 className="text-lg font-bold text-gray-900 text-center mb-8">
          Solutions We Offer
        </h3>

        {/* Horizontal Scroll Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="flex gap-6 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {solutions.map((solution, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                className="flex-shrink-0 w-32 snap-center cursor-pointer group"
              >
                {/* Circular Image Container */}
                <div className="relative mb-3">
                  <div
                    className={`relative w-32 h-32 rounded-full overflow-hidden transition-all duration-300 ${selectedIndex === index
                      ? 'ring-4 ring-emuski-teal-darker shadow-2xl scale-105'
                      : 'ring-2 ring-gray-200 group-hover:ring-emuski-teal-darker/50 group-hover:shadow-lg'
                      }`}
                  >
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      sizes="128px"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent transition-opacity duration-300 ${selectedIndex === index ? 'opacity-0' : 'opacity-100 group-hover:opacity-50'
                        }`}
                    />
                  </div>

                  {/* Selection Indicator */}
                  {selectedIndex === index && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emuski-teal-darker rounded-full animate-pulse" />
                  )}
                </div>

                {/* Title */}
                <div className="text-center">
                  <h4
                    className={`text-sm font-bold transition-colors duration-200 ${selectedIndex === index
                      ? 'text-emuski-teal-darker'
                      : 'text-gray-900 group-hover:text-emuski-teal-darker'
                      }`}
                  >
                    {solution.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{solution.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description Panel */}
        <div className="max-w-4xl mx-auto mt-8">
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedIndex !== null ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            {selectedIndex !== null && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  {/* Mini Icon */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-emuski-teal-darker/20 flex-shrink-0">
                    <Image
                      src={solutions[selectedIndex].image}
                      alt={solutions[selectedIndex].title}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      sizes="64px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {solutions[selectedIndex].title}
                    </h4>
                    <p className="text-xs text-emuski-teal-darker font-semibold mb-2 uppercase tracking-wide">
                      {solutions[selectedIndex].subtitle}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {solutions[selectedIndex].description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hint Text */}
          {selectedIndex === null && (
            <p className="text-center text-xs text-gray-400 mt-4 animate-pulse">
              Click on any solution to learn more
            </p>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
