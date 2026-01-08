'use client'

import Link from "next/link";
import { TrendingUp, BarChart3, Cog, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";

export const ProductionScalingSection = () => {
  return (
    <section id="scaling-details" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emuski-teal/10 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-emuski-teal-darker" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Production Scaling
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamless transition from prototype to production with proven scaling strategies
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Our Scaling Approach</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Capacity Planning</h4>
                    <p className="text-sm text-white/90">Strategic analysis of volume requirements and timeline</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Process Optimization</h4>
                    <p className="text-sm text-white/90">Lean manufacturing principles to maximize efficiency</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quality Systems</h4>
                    <p className="text-sm text-white/90">Implement robust QC processes for high-volume production</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Supply Chain Integration</h4>
                    <p className="text-sm text-white/90">Streamlined sourcing and logistics management</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Scale Confidently with Proven Expertise
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Transitioning from prototypes to full production is complex. Our production scaling service handles the entire process - from process optimization and tooling investment to supply chain management and quality control - ensuring smooth ramp-up without compromising quality or delivery timelines.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-emuski-teal-darker" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Flexible Volume Range</h4>
                    <p className="text-sm text-gray-600">From 1,000 to 1,000,000+ units per year</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cog className="w-5 h-5 text-emuski-teal-darker" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cost Optimization</h4>
                    <p className="text-sm text-gray-600">Reduce per-unit costs as volume increases</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emuski-teal-darker" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consistent Quality</h4>
                    <p className="text-sm text-gray-600">Maintain prototype-level quality at scale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scaling Benefits */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Us for Scaling?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-emuski-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emuski-teal-darker" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">No Capital Investment</h4>
                <p className="text-sm text-gray-600">We invest in tooling and equipment - you focus on your business growth</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-emuski-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emuski-teal-darker" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Risk Mitigation</h4>
                <p className="text-sm text-gray-600">Proven processes reduce risk during production ramp-up</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-emuski-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emuski-teal-darker" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Faster Time-to-Market</h4>
                <p className="text-sm text-gray-600">Accelerated production readiness with parallel activities</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-emuski-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emuski-teal-darker" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">End-to-End Support</h4>
                <p className="text-sm text-gray-600">From DFM to logistics - complete production management</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-emuski-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emuski-teal-darker" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Scalable Infrastructure</h4>
                <p className="text-sm text-gray-600">Facility capacity to handle growing production needs</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-emuski-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emuski-teal-darker" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Global Standards</h4>
                <p className="text-sm text-gray-600">ISO-Certified processes ensure international quality compliance</p>
              </div>
            </div>
          </div>

          {/* Typical Scaling Timeline */}
          <div className="bg-white border-2 border-emuski-teal-dark/20 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Typical Scaling Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-emuski-teal-darker w-20">Week 1-2</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Design for Manufacturing Review</h4>
                  <p className="text-sm text-gray-600">Optimize design for production efficiency</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-emuski-teal-darker w-20">Week 3-6</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Tooling & Setup</h4>
                  <p className="text-sm text-gray-600">Create production tooling and fixtures</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-emuski-teal-darker w-20">Week 7-8</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Pilot Run & Validation</h4>
                  <p className="text-sm text-gray-600">Test production process and quality systems</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-emuski-teal/10 rounded-lg border-2 border-emuski-teal-dark">
                <div className="text-2xl font-bold text-emuski-teal-darker w-20">Week 9+</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Full Production</h4>
                  <p className="text-sm text-gray-600">Ramp up to target volume with continuous improvement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-emuski-teal-darker mb-2">98%</div>
              <div className="text-sm text-gray-600">On-Time Delivery</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-emuski-teal-darker mb-2">30-50%</div>
              <div className="text-sm text-gray-600">Cost Reduction</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-emuski-teal-darker mb-2">6-8wks</div>
              <div className="text-sm text-gray-600">Avg. Ramp-up Time</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-emuski-teal-darker mb-2">99.5%</div>
              <div className="text-sm text-gray-600">Quality Rate</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Plan Your Production Scale-Up
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
