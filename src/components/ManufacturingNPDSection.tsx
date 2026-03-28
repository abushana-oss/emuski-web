'use client'

import { useState } from "react";
import Image from "next/image";

const npdMachines = [
  {
    id: 1,
    title: "VMC 5-Axis Precision Machining",
    subtitle: "Simultaneous 5-Axis Vertical Machining Center",
    description: "Ultra-precision 5-axis VMC delivering ±2 micron accuracy for complex aerospace, medical implants, and defense components. Reduces lead time by 60% through single-setup machining.",
    image: "/assets/npdcentre/vmc-5-axis.png",
    capabilities: ["±2 μm precision", "60% faster lead time", "Single setup machining", "Ra 0.1 μm surface finish"]
  },
  {
    id: 2,
    title: "VMC 3-Axis High-Speed Machining",
    subtitle: "Production-Grade Vertical Machining Center",
    description: "High-speed 3-axis VMC with 24,000 RPM spindle for rapid prototyping and medium-volume production. Achieves ±5 micron repeatability with 50% faster cycle times.",
    image: "/assets/npdcentre/vmc-3-axsis.png",
    capabilities: ["±5 μm repeatability", "24,000 RPM spindle", "50% faster cycles", "Lights-out production"]
  },
  {
    id: 3,
    title: "VMC 4-Axis Rotary Machining",
    subtitle: "Advanced Vertical Machining Center",
    description: "4-axis rotary table VMC enabling complex angular cuts and multi-sided machining in single setup. Reduces handling time by 70% with automated tool changing.",
    image: "/assets/npdcentre/vmc-4-axis.png",
    capabilities: ["±3 μm positioning", "70% less handling", "360° rotary table", "80-tool ATC"]
  },
  {
    id: 4,
    title: "CNC Multi-Axis Turning Center",
    subtitle: "Live Tooling Turning & Milling Center",
    description: "Advanced CNC turning center with live tooling and C-axis capability. Delivers ±3 micron concentricity for precision shafts, reducing secondary operations by 80%.",
    image: "/assets/npdcentre/cnc.png",
    capabilities: ["±3 μm concentricity", "80% fewer operations", "Live tooling", "Sub-spindle capability"]
  },
  {
    id: 5,
    title: "Wire EDM Ultra-Precision Cutting",
    subtitle: "Mitsubishi Wire Electrical Discharge Machine",
    description: "Mitsubishi wire EDM achieving ±1 micron cutting accuracy through hardened materials up to 65 HRC. Enables complex geometries impossible with conventional machining.",
    image: "/assets/npdcentre/wireedm.png",
    capabilities: ["±1 μm wire cutting", "65 HRC materials", "Ra 0.05 μm finish", "Zero tool deflection"]
  },
  {
    id: 6,
    title: "Centerless Grinding Precision Finishing",
    subtitle: "CNC Centerless Grinding Machine",
    description: "CNC centerless grinding delivering mirror Ra 0.025 micron surface finish with ±1 micron diameter tolerance. Processes 500+ parts/hour for volume production.",
    image: "/assets/npdcentre/centerlessgrinding.png",
    capabilities: ["Ra 0.025 μm finish", "±1 μm diameter", "500+ parts/hour", "Automated loading"]
  }
];

export const ManufacturingNPDSection = () => {
  const [selectedMachine, setSelectedMachine] = useState<number>(1);

  const activeMachine = npdMachines.find(machine => machine.id === selectedMachine);

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 bg-emuski-teal/10 rounded-full mb-3">
            <span className="text-xs font-semibold text-emuski-teal-darker uppercase tracking-wider">
              New Product Development Centre
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            EMUSKI NPD Centre - Complete Manufacturing Under One Roof
          </h2>
          
          <p className="text-sm text-gray-600 max-w-3xl mx-auto">
            Our <span className="font-semibold text-emuski-teal-darker">New Product Development Centre</span> houses world-class manufacturing equipment delivering micron-precision for Medical Devices, Aerospace, Defense & Automotive. <span className="font-semibold">Reduce your lead time by 60%</span> with all capabilities integrated in one facility.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
          
          {/* Mobile - Machine Selection Grid */}
          <div className="block lg:hidden">
            <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">Select Equipment</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {npdMachines.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => setSelectedMachine(machine.id)}
                  className={`p-2 text-center rounded-lg transition-all duration-300 border ${
                    selectedMachine === machine.id 
                      ? 'border-emuski-teal bg-emuski-teal/10 shadow-md' 
                      : 'border-gray-200 hover:border-emuski-teal/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mx-auto mb-2">
                    <Image
                      src={machine.image}
                      alt={machine.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <h4 className={`font-semibold text-xs mb-1 leading-tight ${
                    selectedMachine === machine.id ? 'text-emuski-teal-darker' : 'text-gray-900'
                  }`}>
                    {machine.title.split(' ').slice(0, 2).join(' ')}
                  </h4>
                  <div className={`w-2 h-2 rounded-full mx-auto ${
                    selectedMachine === machine.id ? 'bg-emuski-teal' : 'bg-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Desktop - Machine List */}
          <div className="hidden lg:block lg:col-span-1 space-y-2">
            <h3 className="text-base font-bold text-gray-900 mb-3">Equipment in Our NPD Centre</h3>
            
            {npdMachines.map((machine) => (
              <button
                key={machine.id}
                onClick={() => setSelectedMachine(machine.id)}
                className={`w-full p-3 text-left rounded-xl transition-all duration-300 border ${
                  selectedMachine === machine.id 
                    ? 'border-emuski-teal bg-emuski-teal/5 shadow-md' 
                    : 'border-gray-200 hover:border-emuski-teal/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={machine.image}
                      alt={machine.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm mb-0.5 ${
                      selectedMachine === machine.id ? 'text-emuski-teal-darker' : 'text-gray-900'
                    }`}>
                      {machine.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-tight">
                      {machine.subtitle}
                    </p>
                  </div>
                  
                  <div className={`w-2 h-2 rounded-full ${
                    selectedMachine === machine.id ? 'bg-emuski-teal' : 'bg-gray-300'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Machine Details - Responsive */}
          <div className="col-span-1 lg:col-span-2">
            {activeMachine && (
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                
                {/* Machine Image */}
                <div className="relative mb-4 mx-auto max-w-xs sm:max-w-sm">
                  <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden shadow-lg bg-white">
                    <Image
                      src={activeMachine.image}
                      alt={activeMachine.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 300px, 384px"
                      priority
                    />
                  </div>
                </div>

                {/* Machine Details */}
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {activeMachine.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emuski-teal-darker font-semibold mb-2 sm:mb-3">
                    {activeMachine.subtitle}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2">
                    {activeMachine.description}
                  </p>
                </div>

                {/* Capabilities */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 text-center mb-2 sm:mb-3">Precision Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeMachine.capabilities.map((capability, index) => (
                      <div key={index} className="bg-white rounded-lg p-2 text-center shadow-sm border-l-2 border-emuski-teal">
                        <p className="text-xs font-medium text-gray-700">{capability}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats & CTA */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                  <div className="text-center p-1.5 sm:p-2 bg-white rounded-lg border border-emuski-teal/20">
                    <div className="text-base sm:text-lg font-bold text-emuski-teal-darker">60%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Faster Lead Time</div>
                  </div>
                  <div className="text-center p-1.5 sm:p-2 bg-white rounded-lg border border-emuski-teal/20">
                    <div className="text-base sm:text-lg font-bold text-emuski-teal-darker">±1μm</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Precision Level</div>
                  </div>
                  <div className="text-center p-1.5 sm:p-2 bg-white rounded-lg border border-emuski-teal/20">
                    <div className="text-base sm:text-lg font-bold text-emuski-teal-darker">24/7</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Lights-Out Mfg</div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emuski-teal-darker text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-emuski-teal transition-colors duration-300 shadow-lg"
                  >
                    <span className="hidden sm:inline">Reduce Lead Time by 60% - Get Free Quote</span>
                    <span className="sm:hidden">Get Free Quote - 60% Faster</span>
                    <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};