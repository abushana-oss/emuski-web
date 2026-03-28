import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Suspense } from 'react';
import { DynamicCadAnalysis } from '@/components/DynamicCadAnalysis';

export const metadata: Metadata = {
  title: '3D CAD Analysis Tool',
  description: 'Basic CAD file viewer for internal use.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CadAnalysisPage() {

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
                    Free DFM Analysis Tool
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2">
                  AI-Powered 3D DFM Analysis Tool with Instant Design for Manufacturing Check
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  Upload your CAD file and get instant AI-powered 3D DFM analysis. Our artificial intelligence identifies manufacturing errors like wall thickness violations, 
                  undercuts, and draft angle issues before production.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    AI-Powered Analysis
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    Zero Install Required
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-emuski-teal/20 text-emuski-teal border border-emuski-teal/30">
                    AI Cost Optimization
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
                    Complete Your DFM Workflow
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    After analyzing your 3D design, <a href="/tools/2d-balloon-diagram" className="text-emuski-teal hover:underline">annotate findings with our 2D balloon diagram tool</a> for First Article Inspection (FAI) and quality documentation. Get professional manufacturing quotes for your analyzed CAD files.
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
      
    </div>
  );
}