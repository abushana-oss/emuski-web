import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Suspense } from 'react';
import DynamicBalloonAnalysis from '@/components/DynamicBalloonAnalysis';

export const metadata: Metadata = {
  title: '2D Balloon Diagram Tool — Engineering Drawing Annotation Online | Emuski',
  description: 'Create accurate balloon diagrams for engineering drawings in seconds. Emuski\'s free online balloon diagram tool helps quality teams annotate 2D drawings for FAI, DFM review, and inspection.',
  keywords: [
    '2D balloon diagram',
    'technical drawing annotation', 
    'PDF annotation tool',
    'engineering diagrams',
    'balloon numbering',
    'technical documentation',
    'drawing markup',
    'CAD annotation',
    'engineering tools',
    'blueprint annotation',
    'mechanical drawing balloons',
    'assembly drawing annotation',
    'part numbering system',
    'technical drawing software',
    'PDF markup tool',
    'engineering documentation',
    'balloon callouts',
    'dimension annotation'
  ].join(', '),
  openGraph: {
    title: '2D Balloon Diagram Tool — Engineering Drawing Annotation Online | Emuski',
    description: 'Create accurate balloon diagrams for engineering drawings in seconds. Free online balloon diagram tool for FAI, DFM review, and quality inspection.',
    type: 'website',
    url: 'https://www.emuski.com/tools/2d-balloon-diagram',
    images: [
      {
        url: 'https://www.emuski.com/social-banner-balloon-diagram.jpg',
        width: 1200,
        height: 630,
        alt: '2D Balloon Diagram Tool by EMUSKI'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '2D Balloon Diagram Tool | EMUSKI',
    description: 'Professional balloon annotation tool for technical drawings and engineering documentation.',
    images: ['https://www.emuski.com/social-banner-balloon-diagram.jpg']
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
    canonical: 'https://www.emuski.com/tools/2d-balloon-diagram'
  }
};

export default function BalloonDiagramPage() {
  const structuredData = [
    // Main Software Application
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "EMUSKI 2D Balloon Diagram Tool",
      "description": "Professional 2D balloon diagram tool for technical drawings. Upload PDFs, add interactive annotations, customize balloon styles, and export annotated diagrams.",
      "applicationCategory": ["EngineeringApplication", "DesignApplication"],
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free 2D balloon diagram tool with annotation features",
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
        "PDF Upload and Visualization",
        "Interactive Balloon Placement",
        "Drag-and-Drop Annotation Editing", 
        "Customizable Balloon Styles",
        "Color Picker and Custom Colors",
        "Export Annotated Diagrams",
        "Technical Drawing Markup",
        "Engineering Documentation",
        "Auto-Numbering System",
        "Professional Annotation Tools",
        "Blueprint Annotation",
        "Assembly Drawing Balloons",
        "Part Callout Creation",
        "Real-time Collaboration",
        "High-Resolution Export"
      ],
      "screenshot": "https://emuski.com/screenshots/balloon-diagram-tool.webp",
      "softwareVersion": "1.0",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0]
    },
    // FAQ Schema
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question", 
          "name": "What file formats are supported for balloon diagrams?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool supports PDF files for creating balloon diagrams. You can upload technical drawings, engineering drawings, and other PDF documents up to 50MB in size."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize the balloon styles and colors?", 
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can choose from circle, square, or diamond balloon shapes, select from preset colors or use a custom color picker, and all balloons are automatically numbered."
          }
        },
        {
          "@type": "Question",
          "name": "How do I export my annotated diagrams?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "You can export your balloon diagrams as high-quality PNG images or as JSON data containing all annotation information for later editing. Export options include PDF overlay, standalone image, and editable format."
          }
        },
        {
          "@type": "Question",
          "name": "What are balloon diagrams used for in engineering?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Balloon diagrams are used in engineering to identify and number parts in assembly drawings, technical documentation, and manufacturing instructions. They provide clear visual references for part lists, bills of materials, and assembly procedures."
          }
        },
        {
          "@type": "Question",
          "name": "Can I collaborate with team members on balloon diagrams?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the tool supports real-time collaboration features allowing multiple team members to work on the same diagram simultaneously. Changes are automatically synchronized across all users."
          }
        }
      ]
    },
    // Service Schema
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "2D Balloon Diagram Creation Service",
      "description": "Professional balloon diagram annotation service for technical drawings and engineering documentation",
      "provider": {
        "@type": "Organization", 
        "name": "EMUSKI",
        "@id": "https://emuski.com/#organization"
      },
      "serviceType": "Technical Drawing Annotation",
      "audience": {
        "@type": "Audience",
        "audienceType": "Engineers, Designers, Technical Documentarians, Manufacturing Teams"
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://emuski.com/tools/2d-balloon-diagram",
        "serviceName": "Online 2D Balloon Diagram Tool"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Technical Drawing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "PDF Annotation Service",
              "description": "Professional balloon diagram creation for technical drawings"
            }
          }
        ]
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
      <section className="relative mt-16 sm:mt-20 py-12 sm:py-16 md:py-20 lg:py-24 border-b border-border/30 overflow-hidden" style={{backgroundColor: 'rgb(18, 26, 33)'}}>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 pt-2 sm:pt-4 md:pt-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Category Badge */}
                <div className="flex justify-center">
                  <span className="text-emuski-teal text-xs sm:text-sm font-semibold tracking-wider uppercase">
                    Engineering Drawing Tool
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2">
                  2D Balloon Diagram Tool with Annotate Engineering Drawings Online
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  Create balloon diagrams for engineering drawings and technical documentation. Perfect for First Article Inspection (FAI), 
                  DFM review, and quality inspection.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6">
                  <span className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    FAI Balloons
                  </span>
                  <span className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    DFM Review
                  </span>
                  <span className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    Quality Inspection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="pt-8 sm:pt-12 md:pt-16">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emuski-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Initializing 2D Balloon Diagram Tool...</p>
            </div>
          </div>
        }>
          <DynamicBalloonAnalysis />
        </Suspense>
        
        {/* Request for Quote CTA */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-emuski-teal/5 to-emuski-teal-light/5 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-6">

                {/* Content */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    Complete DFM Workflow Integration
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Start by <a href="/tools/3d-cad-analysis" className="text-emuski-teal hover:underline">running a 3D DFM analysis</a> on your CAD files, then use balloon diagrams to document findings for First Article Inspection. Our expert team provides comprehensive engineering documentation services and manufacturing support.
                  </p>
                  
                  {/* Trust indicators */}
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>ISO 9001 Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Professional Documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Expert Engineering Support</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-emuski-teal text-white font-bold rounded-xl hover:bg-emuski-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Get Professional Documentation
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
                  <strong>No commitment required.</strong> Free consultation for all technical documentation needs.
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
                "name": "2D Balloon Diagram",
                "item": "https://www.emuski.com/tools/2d-balloon-diagram"
              }
            ]
          })
        }}
      />
    </div>
  );
}