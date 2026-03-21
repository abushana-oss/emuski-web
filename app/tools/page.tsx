import { Metadata } from 'next';
import Link from 'next/link';
import { Box, Zap, Wrench } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Tools | EMUSKI - Advanced Manufacturing & Engineering Tools',
  description: 'Access EMUSKI\'s suite of advanced tools for manufacturing and engineering including 3D CAD analysis, cost estimation, and more.',
  keywords: 'manufacturing tools, engineering tools, CAD analysis, cost estimation, design optimization',
};

const tools = [
  {
    id: '3d-cad-analysis',
    title: '3D CAD Analysis',
    description: 'Upload and analyze your 3D CAD files with advanced manufacturing insights, cost estimations, and design optimization suggestions.',
    icon: Box,
    features: [
      'Support for STEP, STL, IGES, OBJ files',
      'Real-time 3D visualization',
      'Manufacturing process recommendations',
      'Cost estimation and optimization',
      'Design for manufacturing analysis'
    ],
    href: '/tools/3d-cad-analysis',
    status: 'available'
  },
  {
    id: 'cost-calculator',
    title: 'Manufacturing Cost Calculator',
    description: 'Get instant cost estimates for various manufacturing processes based on your part specifications.',
    icon: Zap,
    features: [
      'Multi-process cost comparison',
      'Material cost analysis',
      'Volume pricing tiers',
      'Lead time estimation',
      'Tooling cost breakdown'
    ],
    href: '/tools/cost-calculator',
    status: 'coming-soon'
  },
  {
    id: 'design-optimizer',
    title: 'Design Optimization Tool',
    description: 'Optimize your designs for manufacturability, cost-effectiveness, and performance.',
    icon: Wrench,
    features: [
      'DFM analysis and suggestions',
      'Material usage optimization',
      'Tolerance analysis',
      'Weight reduction strategies',
      'Performance enhancement recommendations'
    ],
    href: '/tools/design-optimizer',
    status: 'coming-soon'
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative mt-16 sm:mt-20 py-16 sm:py-20 md:py-24 lg:py-32 border-b border-border/30 overflow-hidden" style={{backgroundColor: 'rgb(18, 26, 33)'}}>
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
                    Advanced Engineering Tools
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2">
                  Engineering Tools Suite
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  Access our comprehensive suite of advanced tools designed to streamline your manufacturing 
                  and engineering workflows. From CAD analysis to cost estimation, we've got you covered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              const isAvailable = tool.status === 'available';
              
              return (
                <div key={tool.id} className="group relative">
                  {isAvailable ? (
                    <Link href={tool.href} className="block h-full">
                      <div className="h-full p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:border-emuski-teal hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-emuski-teal-darker transition-colors">
                              {tool.title}
                            </h3>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 mt-1 text-xs font-bold uppercase tracking-wider rounded-full bg-green-100 text-green-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Available
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {tool.description}
                        </p>
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Key Features:</h4>
                          <ul className="space-y-2">
                            {tool.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-emuski-teal rounded-full flex-shrink-0"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-border">
                          <div className="inline-flex items-center gap-2 text-emuski-teal font-semibold group-hover:gap-3 transition-all">
                            Launch Tool
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="h-full p-8 bg-card rounded-2xl border border-border shadow-sm relative overflow-hidden opacity-75">
                      <div className="absolute top-4 right-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-700">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          Coming Soon
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-muted-foreground">
                            {tool.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {tool.description}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Planned Features:</h4>
                        <ul className="space-y-2">
                          {tool.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full flex-shrink-0"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

            {/* Call to Action */}
            <div className="mt-20 text-center">
              <div className="p-8 bg-gradient-to-r from-emuski-teal/10 to-emuski-teal-light/10 rounded-2xl border border-emuski-teal/20">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Need a Custom Tool?
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We're constantly developing new tools to meet our clients' needs. 
                  Have a specific requirement? Let us know!
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emuski-teal text-white font-semibold rounded-xl hover:bg-emuski-teal-dark transition-colors"
                >
                  Request Custom Tool
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}