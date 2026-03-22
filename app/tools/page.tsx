import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { Box, Zap, Wrench, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Free DFM Tools Online | 3D DFM Analysis & 2D Balloon Diagrams | EMUSKI',
  description: 'Free Design for Manufacturing (DFM) tools online. Instant 3D DFM analysis for CAD files and 2D balloon diagram tool for engineering drawings. No download required.',
  keywords: [
    'DFM tools',
    'DFM analysis tool',
    'Design for Manufacturing software',
    'free DFM tool online',
    '3D DFM analysis',
    '2D balloon diagram tool',
    'online DFM checker',
    'DFM software',
    'web-based DFM tool',
    'automated DFM analysis',
    'manufacturability analysis',
    'DFM checklist',
    'design for manufacturing',
    'CAD DFM check',
    'engineering balloon diagram',
    'manufacturing design tool',
    'cloud-based DFM',
    'browser-based DFM tool'
  ].join(', '),
  openGraph: {
    title: 'Free DFM Tools Online | 3D DFM Analysis & 2D Balloon Diagrams | EMUSKI',
    description: 'Free Design for Manufacturing (DFM) tools online. Instant 3D DFM analysis and 2D balloon diagram tool. No download required.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/tools-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EMUSKI Engineering Tools Suite - 3D CAD Analysis and 2D Balloon Diagrams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Tools Suite | EMUSKI',
    description: 'Professional 3D CAD analysis and 2D balloon diagram tools for engineers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://emuski.com/tools',
  },
};

const faqData = [
  {
    question: "What are DFM tools?",
    answer: "DFM tools are software applications that help engineers and designers analyze a product's design for ease and cost-effectiveness of manufacturing. They identify potential production issues early — such as tight tolerances, excess part complexity, or assembly conflicts — before tooling or production begins."
  },
  {
    question: "What does DFM stand for?",
    answer: "DFM stands for Design for Manufacturing (also called Design for Manufacturability). It is the practice of designing products with the manufacturing process in mind from the earliest stages of development."
  },
  {
    question: "What software is used for DFM analysis?",
    answer: "Common DFM analysis software includes DFMPro, SolidWorks DFM tools, Autodesk Fusion 360, Creo by PTC, and web-based tools like emuski.com that provide instant 3D analysis and 2D balloon diagram features without any download required."
  },
  {
    question: "What is a DFM?",
    answer: "A DFM (Design for Manufacturing) is both a methodology and a document/analysis output. As a methodology, it guides product design to optimize manufacturability. As a tool output, it is a report identifying design issues that could complicate or increase the cost of production."
  },
  {
    question: "How does 3D DFM analysis work?",
    answer: "3D DFM analysis automatically scans your CAD file for manufacturability issues like wall thickness violations, undercuts, draft angles, tolerance stack-ups, and material conflicts. Our tool provides instant visual feedback and cost estimates without requiring any software downloads."
  },
  {
    question: "What is a balloon diagram in engineering?",
    answer: "A balloon diagram is an engineering drawing annotation tool that uses numbered balloons to identify and reference specific parts or features in technical drawings. It's essential for First Article Inspection (FAI), quality control, and assembly documentation."
  },
  {
    question: "Why use online DFM tools instead of desktop software?",
    answer: "Online DFM tools like EMUSKI offer instant access without downloads, automatic updates, collaboration features, and typically faster analysis. Unlike expensive enterprise solutions, web-based DFM tools provide free tiers and work across any device."
  },
  {
    question: "Can DFM analysis reduce manufacturing costs?",
    answer: "Yes, DFM analysis can reduce manufacturing costs by 15-40% by identifying design issues early. It prevents costly tooling changes, reduces material waste, optimizes manufacturing processes, and accelerates time to market through fewer design iterations."
  }
];

const tools = [
  {
    id: '3d-cad-analysis',
    title: '3D DFM Analysis Tool',
    description: 'Instant Design for Manufacturing analysis for your CAD files. Upload STEP, STL, IGES files and get automated DFM checks, manufacturability insights, and cost optimization recommendations.',
    icon: Box,
    features: [
      'Instant 3D DFM analysis - no download required',
      'Automated manufacturability checks',
      'Wall thickness and draft angle validation',
      'Injection molding and CNC machining DFM',
      'Manufacturing cost estimation',
      'Visual error highlighting in 3D viewer'
    ],
    href: '/tools/3d-cad-analysis',
    status: 'available'
  },
  {
    id: '2d-balloon-diagram',
    title: '2D Balloon Diagram Tool',
    description: 'Professional balloon diagram tool for engineering drawings. Create FAI balloon diagrams, annotate technical drawings for DFM review, and generate quality inspection documentation.',
    icon: FileText,
    features: [
      'Engineering balloon diagram generator',
      'First Article Inspection (FAI) balloons',
      'GD&T balloon diagram support',
      'Quality inspection annotations',
      'PDF drawing annotation tool',
      'Export balloon diagrams for documentation'
    ],
    href: '/tools/2d-balloon-diagram',
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

function FAQSection() {
  const [openItems, setOpenItems] = React.useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our engineering tools
            </p>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  {openItems[index] ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openItems[index] && (
                  <div className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://emuski.com/tools",
                "url": "https://emuski.com/tools",
                "name": "Engineering Tools Suite | 3D CAD Analysis & 2D Balloon Diagrams",
                "description": "Professional engineering tools for 3D CAD analysis, 2D balloon diagrams, manufacturing cost estimation & design optimization.",
                "isPartOf": {
                  "@type": "WebSite",
                  "@id": "https://emuski.com",
                  "name": "EMUSKI",
                  "url": "https://emuski.com"
                },
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://emuski.com"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Tools",
                      "item": "https://emuski.com/tools"
                    }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "3D CAD Analysis Tool",
                "description": "Professional 3D CAD file analysis tool supporting STEP, STL, IGES, and OBJ formats with manufacturing insights and cost estimation.",
                "url": "https://emuski.com/tools/3d-cad-analysis",
                "applicationCategory": "Engineering Software",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                },
                "featureList": [
                  "STEP file analysis",
                  "STL file viewer",
                  "IGES converter",
                  "Manufacturing cost estimation",
                  "DFM analysis",
                  "3D visualization"
                ]
              },
              {
                "@type": "SoftwareApplication", 
                "name": "2D Balloon Diagram Tool",
                "description": "Interactive 2D balloon diagram creator for technical drawings and PDF documents with drag-and-drop annotation placement.",
                "url": "https://emuski.com/tools/2d-balloon-diagram",
                "applicationCategory": "Engineering Software",
                "operatingSystem": "Web Browser", 
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                },
                "featureList": [
                  "PDF annotation",
                  "Balloon diagram creation",
                  "Technical drawing markup",
                  "Export functionality",
                  "Collaborative editing"
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": faqData.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              }
            ]
          })
        }}
      />
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
                    Free DFM Tools Online
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2">
                  Design for Manufacturing (DFM) Tools
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  Free online DFM analysis tools to optimize your designs for manufacturing. Instant 3D DFM checks 
                  and 2D balloon diagram creation — no software downloads required, zero setup time.
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

            {/* Competitive Advantages */}
            <div className="mt-20 text-center">
              <div className="p-8 bg-gradient-to-r from-emuski-teal/10 to-emuski-teal-light/10 rounded-2xl border border-emuski-teal/20">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Why Choose EMUSKI DFM Tools?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emuski-teal/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-emuski-teal" />
                    </div>
                    <h3 className="font-semibold mb-2">Zero Install</h3>
                    <p className="text-sm text-muted-foreground">Instant access in your browser. No downloads, no setup time.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emuski-teal/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Box className="w-6 h-6 text-emuski-teal" />
                    </div>
                    <h3 className="font-semibold mb-2">Universal Parts</h3>
                    <p className="text-sm text-muted-foreground">Works with any part type - not just PCBs or specific industries.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emuski-teal/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Wrench className="w-6 h-6 text-emuski-teal" />
                    </div>
                    <h3 className="font-semibold mb-2">Complete Workflow</h3>
                    <p className="text-sm text-muted-foreground">3D analysis + 2D balloon diagrams in one integrated platform.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emuski-teal/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-emuski-teal" />
                    </div>
                    <h3 className="font-semibold mb-2">Always Free</h3>
                    <p className="text-sm text-muted-foreground">Free tier available - unlike expensive enterprise solutions.</p>
                  </div>
                </div>
                <Link 
                  href="/tools/3d-cad-analysis" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emuski-teal text-white font-semibold rounded-xl hover:bg-emuski-teal-dark transition-colors mr-4"
                >
                  Try 3D DFM Analysis →
                </Link>
                <Link 
                  href="/tools/2d-balloon-diagram" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:border-emuski-teal hover:bg-emuski-teal/5 transition-colors"
                >
                  Try Balloon Diagrams →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FAQSection />
      
      <Footer />
    </div>
  );
}