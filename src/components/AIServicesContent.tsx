'use client'

import { Brain, Sparkles, Database, Network, FileText, Zap, CheckCircle, TrendingUp, Shield, Clock, Target, Cpu } from "lucide-react";
import Image from "next/image";

export const AIServicesContent = () => {
  return (
    <div className="space-y-0">
      {/* What is Mithran */}
      <section id="mithran-overview" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Next-Gen AI Platform</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Meet Mithran: Your AI-Powered Manufacturing Intelligence
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  EMUSKI is building Mithran, a revolutionary AI-driven platform that transforms how OEMs manage their entire product lifecycle. From initial design to final delivery, Mithran acts as your digital backbone—automating workflows, optimizing costs, and connecting you with the right suppliers at the right time.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By combining cutting-edge artificial intelligence with real-time data analytics, supplier networking, and automated monitoring, Mithran transforms traditional manufacturing operations into a smart, predictive, and highly efficient ecosystem.
                </p>

                {/* Key Benefits */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">30% Faster Cycles</h4>
                      <p className="text-sm text-gray-600">Accelerated design-to-production</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">15% Cost Savings</h4>
                      <p className="text-sm text-gray-600">AI-powered cost validation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Reduced Errors</h4>
                      <p className="text-sm text-gray-600">Automated accuracy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Full Visibility</h4>
                      <p className="text-sm text-gray-600">End-to-end tracking</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 p-8">
                  <Image
                    src="/assets/mitran/ai-mithran-ai.svg"
                    alt="Mithran AI Platform"
                    width={1600}
                    height={900}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23ffffff' width='600' height='400'/%3E%3Ctext fill='%236b7280' font-family='system-ui' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EMithran AI Platform%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Mithran Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Mithran Transforms Your Workflow
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Mithran enables OEMs to streamline every stage of product development with intelligent automation
              </p>
            </div>

            {/* Capabilities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {/* CAD to BOM */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Automated BOM Generation
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Upload CAD drawings and instantly generate structured, accurate Bills of Materials. No more manual data entry or spreadsheet errors.
                </p>
              </div>

              {/* AI Cost Estimation */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  AI-Driven Process Planning
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get intelligent process recommendations and precise cost estimations powered by machine learning algorithms trained on thousands of manufacturing scenarios.
                </p>
              </div>

              {/* Supplier Network */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Smart Supplier Matching
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Automatically identify capable suppliers, manage RFQs, and validate quotations against our global cost database for optimal pricing.
                </p>
              </div>

              {/* DFM Collaboration */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  DFM Review Automation
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Collaborate seamlessly on design-for-manufacturing reviews with automated feedback loops and finalize production-ready drawings faster.
                </p>
              </div>

              {/* Real-time Monitoring */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Real-Time Project Tracking
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monitor every project and logistics milestone in real time with AI-powered risk detection for faster, more predictable execution.
                </p>
              </div>

              {/* Data Intelligence */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Predictive Analytics
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Leverage historical data and AI models to predict costs, lead times, and potential bottlenecks before they impact your timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image - Left side */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src="/assets/mitran/ai-raw-material-optimization.svg"
                    alt="Mithran AI Intelligence"
                    width={1600}
                    height={900}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23ffffff' width='600' height='400'/%3E%3Ctext fill='%236b7280' font-family='system-ui' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EMithran AI%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>

              {/* Content - Right side */}
              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Business Impact</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Why Mithran Matters for Your Business
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  In today's competitive manufacturing landscape, speed and accuracy aren't optional—they're essential. Mithran is being built to address the critical pain points that slow down OEMs and inflate costs.
                </p>

                {/* Key Benefits */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Accelerate Time-to-Market</h4>
                      <p className="text-sm text-gray-600">Reduce design-to-production cycles by 30% with automated workflows and intelligent process planning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Eliminate Manual Errors</h4>
                      <p className="text-sm text-gray-600">AI-driven automation removes human error from BOM generation, cost estimation, and quote validation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Optimize Sourcing Decisions</h4>
                      <p className="text-sm text-gray-600">Leverage global cost intelligence to negotiate better prices and identify reliable suppliers faster</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Gain Complete Visibility</h4>
                      <p className="text-sm text-gray-600">Real-time dashboards and predictive analytics provide end-to-end project transparency</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-lg p-4">
                    <div className="text-3xl font-bold mb-1 text-white">30%</div>
                    <div className="text-sm" style={{color: '#161615'}}>Faster Sourcing Cycles</div>
                  </div>
                  <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-lg p-4">
                    <div className="text-3xl font-bold mb-1 text-white">15%</div>
                    <div className="text-sm" style={{color: '#161615'}}>Cost Savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Ahead */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">The Future - Mithran AI</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  The Future of Manufacturing Intelligence
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  EMUSKI is building Mithran to help OEMs gain AI-powered intelligence, stronger control, and global competitiveness. Once launched, Mithran will be the platform that connects engineering precision with data-driven decision-making.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Imagine a world where your entire product development ecosystem is connected—where design changes automatically update cost models, where supplier selection is backed by real-time quality data, and where potential delays are predicted and resolved before they happen.
                </p>

                {/* Vision Points */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h4 className="font-bold mb-6 text-base">Mithran's Vision</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#161615'}}>1</div>
                      <p className="text-base leading-relaxed" style={{color: '#161615'}}>Unite engineering, procurement, and manufacturing in one intelligent platform</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#161615'}}>2</div>
                      <p className="text-base leading-relaxed" style={{color: '#161615'}}>Democratize access to world-class manufacturing intelligence for OEMs of all sizes</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#161615'}}>3</div>
                      <p className="text-base leading-relaxed" style={{color: '#161615'}}>Create a global ecosystem where suppliers and OEMs collaborate seamlessly</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#161615'}}>4</div>
                      <p className="text-base leading-relaxed" style={{color: '#161615'}}>Continuously learn and improve through AI, making every project smarter than the last</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src="/assets/mitran/ai-mitran-future.svg"
                    alt="Future of Manufacturing"
                    width={1600}
                    height={900}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23f3f4f6' width='600' height='400'/%3E%3Ctext fill='%236b7280' font-family='system-ui' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EFuture Vision%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};