import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Suspense } from 'react';
import { DynamicCadAnalysis } from '@/components/DynamicCadAnalysis';

export const metadata: Metadata = {
  title: 'Free 3D CAD Analysis Tool | AI-Powered DFM Analysis | EMUSKI',
  description: 'Upload STL, STEP, IGES files for instant AI-powered Design for Manufacturing analysis. Get cost estimates, manufacturability insights, and production recommendations in seconds. Free daily credits available.',
  keywords: 'CAD analysis tool, DFM analysis, 3D file viewer, STL viewer, STEP analysis, IGES viewer, manufacturing analysis, cost estimation, design for manufacturing, CNC analysis, 3D printing optimization, AI CAD tool, free CAD analysis, manufacturing cost calculator',
  openGraph: {
    title: '3D CAD Analysis & Viewer | EMUSKI Manufacturing',
    description: 'Professional 3D CAD file analysis with AI-powered insights. Upload STL, STEP, IGES files for instant visualization and manufacturing recommendations.',
    type: 'website',
    url: 'https://www.emuski.com/tools/3d-cad-analysis',
    images: [
      {
        url: 'https://www.emuski.com/social-banner-cad-analysis.jpg',
        width: 1200,
        height: 630,
        alt: '3D CAD Analysis Tool by EMUSKI'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D CAD Analysis & Viewer | EMUSKI',
    description: 'Professional 3D CAD file analysis with AI-powered manufacturing insights.',
    images: ['https://www.emuski.com/social-banner-cad-analysis.jpg']
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
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.emuski.com/tools/3d-cad-analysis'
  }
};

export default function CadAnalysisPage() {
  const structuredData = [
    // Main Software Application
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "EMUSKI 3D CAD Analysis Tool",
      "description": "Professional 3D CAD file analysis with AI-powered manufacturing insights. Upload STL, STEP, IGES files for instant visualization and cost estimation.",
      "applicationCategory": ["EngineeringApplication", "DesignApplication"],
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free 3D CAD file analysis with daily credit system",
        "eligibleRegion": "Worldwide",
        "availability": "https://schema.org/InStock"
      },
      "provider": {
        "@type": "Organization",
        "name": "EMUSKI Manufacturing Solutions",
        "url": "https://emuski.com",
        "@id": "https://emuski.com/#organization"
      },
      "featureList": [
        "3D Model Visualization",
        "STL File Viewer", 
        "STEP File Analysis",
        "IGES File Support",
        "AI Manufacturing Analysis",
        "Cost Estimation Calculator",
        "Design for Manufacturing (DFM) Analysis",
        "Material Recommendations",
        "Manufacturing Process Optimization",
        "Real-time 3D Rendering"
      ],
      "screenshot": "https://emuski.com/screenshots/cad-analysis-tool.webp",
      "softwareVersion": "2.0",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    // FAQ Schema
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question", 
          "name": "What CAD file formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool supports STEP (.step, .stp), STL (.stl), and IGES (.igs, .iges) files. These are the most common CAD file formats used in manufacturing and 3D modeling."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate is the AI manufacturing analysis?", 
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our AI analysis provides 95%+ accuracy for manufacturability assessments and cost estimates, trained on thousands of real manufacturing projects and industry data."
          }
        },
        {
          "@type": "Question",
          "name": "Is the CAD analysis tool free?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "Yes! We offer 5 free analyses per day. Each analysis consumes credits based on complexity - simple queries use 0.3 credits, while detailed analyses use up to 1.2 credits."
          }
        }
      ]
    },
    // Service Schema
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "3D CAD File Analysis Service",
      "description": "Professional CAD file analysis and manufacturing consultation service",
      "provider": {
        "@type": "Organization", 
        "name": "EMUSKI",
        "@id": "https://emuski.com/#organization"
      },
      "serviceType": "CAD Analysis",
      "audience": {
        "@type": "Audience",
        "audienceType": "Engineers, Designers, Manufacturers"
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://emuski.com/tools/3d-cad-analysis",
        "serviceName": "Online CAD Analysis Tool"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <Navbar />
      
      {/* Hero Section */}
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
                    Advanced Engineering Tools
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2">
                  3D CAD Analysis & Viewer
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  Professional 3D CAD file analysis with real-time visualization. Upload STL, STEP, IGES, OBJ files 
                  for instant AI-powered manufacturing analysis, cost estimations, and design optimization recommendations.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    Real-time 3D Viewer
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    AI Manufacturing Analysis
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    Instant Cost Estimates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="pt-20">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emuski-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Initializing 3D CAD Analysis...</p>
            </div>
          </div>
        }>
          <DynamicCadAnalysis />
        </Suspense>
        
        
        {/* Request for Quote CTA */}
        <section className="py-16 bg-gradient-to-br from-emuski-teal/5 to-emuski-teal-light/5 border-t border-border">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-6">

                {/* Content */}
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Transform Your 3D Models Into Reality
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Get professional manufacturing quotes for your analyzed CAD files. Our expert team provides 
                    detailed cost analysis, material recommendations, and optimized manufacturing strategies for your 3D models.
                  </p>
                  
                  {/* Trust indicators */}
                  <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>ISO 9001 Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>24/7 Expert Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>AI-Powered Analysis</span>
                    </div>
                  </div>
                </div>


                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-emuski-teal text-white font-bold rounded-xl hover:bg-emuski-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Request for Quote
                  </a>
                  
                  <a 
                    href="tel:+918667088060"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-card border border-border text-foreground font-semibold rounded-xl hover:border-emuski-teal hover:bg-emuski-teal/5 transition-all duration-300"
                  >
                    Call Expert: +91 86670 88060
                  </a>
                </div>

                {/* Additional Info */}
                <p className="text-sm text-muted-foreground mt-6">
                  <strong>No commitment required.</strong> Free consultation and quote for all manufacturing inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Additional SEO enhancements */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.emuski.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": "https://www.emuski.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "3D CAD Analysis",
                "item": "https://www.emuski.com/tools/3d-cad-analysis"
              }
            ]
          })
        }}
      />
    </div>
  );
}