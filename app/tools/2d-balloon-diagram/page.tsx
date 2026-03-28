import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Suspense } from 'react';
import DynamicBalloonAnalysis from '@/components/DynamicBalloonAnalysis';

export const metadata: Metadata = {
  title: '2D Balloon Diagram Tool',
  description: 'Internal drawing annotation tool.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function BalloonDiagramPage() {

  return (
    <div className="min-h-screen bg-background">
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
      
    </div>
  );
}