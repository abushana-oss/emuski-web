'use client'

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';


const servicesData = [
  {
    category: "Engineering Innovation",
    items: [
      { name: "Product Cost Estimation", link: "/cost-engineering#cost-estimation" },
      { name: "VAVE - Teardown & Benchmarking", link: "/cost-engineering#vave" },
      { name: "Strategic Sourcing Support", link: "/cost-engineering#sourcing" },
      { name: "Expert Engineer Support", link: "/cost-engineering#expert-support" },
    ]
  },
  {
    category: "Manufacturing Excellence",
    items: [
      { name: "Rapid Prototyping", link: "/manufacturing-services#rapid-prototyping" },
      { name: "On-demand Manufacturing", link: "/manufacturing-services#on-demand-manufacturing" },
    ]
  },
  {
    category: "Next-Gen AI - Mithran",
    items: [
      { name: "Mithran AI Platform", link: "/solutions/ai" },
    ]
  }
];

const ServiceBreakdownSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">OUR SERVICES</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((serviceCategory, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:border-emuski-teal-dark transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-emuski-dark-blue mb-6 border-b pb-4">
                {serviceCategory.category}
              </h3>
              <ul className="space-y-4">
                {serviceCategory.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href={item.link} className="flex items-center justify-between group text-lg text-gray-700 hover:text-emuski-teal-darker transition-colors duration-200">
                      <span>{item.name}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emuski-teal-darker transition-colors duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBreakdownSection;