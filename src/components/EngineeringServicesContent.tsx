'use client'

import { Calculator, TrendingDown, Target, BarChart3, CheckCircle, Scissors, DollarSign, FileSearch, ShoppingCart, Globe, Shield, Users, Briefcase, Clock, Award, Cog } from "lucide-react";
import { ProductTeardownCarousel } from "./ProductTeardownCarousel";
import { StrategicSourcingCarousel } from "./StrategicSourcingCarousel";
import { AutomotiveCaseStudyCarousel } from "./AutomotiveCaseStudyCarousel";
import { CostBreakdownCarousel } from "./CostBreakdownCarousel";

export const EngineeringServicesContent = () => {
  return (
    <div className="space-y-0">
      {/* Cost Estimation */}
      <section id="cost-estimation-details" aria-labelledby="cost-estimation-heading" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Product Cost Estimation</p>
                <h2 id="cost-estimation-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
                  Know Your True Product Costs Before You Commit
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Accurate cost estimation is the foundation of profitable product development. Our comprehensive should-cost analysis provides detailed breakdowns of materials, labor, and overhead—helping you negotiate better, design smarter, and maintain healthy margins.
                </p>

                {/* What You Get */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-4">Complete Cost Intelligence</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Detailed Cost Breakdown</p>
                        <p className="text-xs text-white/80">Line-by-line analysis of every cost component</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Material & Process Analysis</p>
                        <p className="text-xs text-white/80">Optimal materials and manufacturing methods</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Supplier Quote Validation</p>
                        <p className="text-xs text-white/80">Verify pricing accuracy and identify overcharges</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Design Optimization Tips</p>
                        <p className="text-xs text-white/80">Practical suggestions to reduce manufacturing costs</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Use Cases */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Target className="w-6 h-6 text-emuski-teal-darker mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-900 mb-1">Design Phase</p>
                    <p className="text-xs text-gray-600">Guide early decisions</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <BarChart3 className="w-6 h-6 text-emuski-teal-darker mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-900 mb-1">Supplier Evaluation</p>
                    <p className="text-xs text-gray-600">Validate quotes</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <TrendingDown className="w-6 h-6 text-emuski-teal-darker mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-900 mb-1">Cost Reduction</p>
                    <p className="text-xs text-gray-600">Find savings</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">±5%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Accuracy Level</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">3-5 days</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Turnaround</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">15-25%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Avg. Savings</div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Carousel */}
              <CostBreakdownCarousel />
            </div>


          </div>
        </div>
      </section>

      {/* VAVE */}
      <section id="vave-details" aria-labelledby="vave-heading" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Carousel - Left side */}
              <div className="order-2 lg:order-1">
                <ProductTeardownCarousel />
              </div>

              {/* Content - Right side */}
              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">VAVE - Teardown & Benchmarking</p>
                <h2 id="vave-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
                  Unlock Hidden Value Through Strategic Analysis
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Value Analysis and Value Engineering (VAVE) isn't just about cutting costs—it's about maximizing value. We systematically analyze your products through competitive teardowns and engineering workshops to identify opportunities for improvement without compromising quality.
                </p>

                {/* Approach */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Our VAVE Approach</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Product Teardown</p>
                        <p className="text-xs text-gray-600">Systematic disassembly and component analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Benchmarking</p>
                        <p className="text-xs text-gray-600">Compare against competitors and industry standards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Value Engineering Workshop</p>
                        <p className="text-xs text-gray-600">Cross-functional ideation and solution development</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Implementation Roadmap</p>
                        <p className="text-xs text-gray-600">Prioritized action plan with ROI projections</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-4">Tangible Outcomes</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">20-30% cost reduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileSearch className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Design simplification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Performance improvement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Material optimization</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">2-3 wks</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Typical Duration</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">50+</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Ideas Generated</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">5-10x</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">ROI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Sourcing */}
      <section id="sourcing-details" aria-labelledby="sourcing-heading" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Strategic Sourcing</p>
                <h2 id="sourcing-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
                  Connect with the Right Suppliers, Every Time
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Finding reliable suppliers shouldn't be a gamble. Our strategic sourcing service leverages a global network of pre-vetted manufacturers to match you with suppliers that meet your exact quality, cost, and delivery requirements.
                </p>

                {/* Key Strengths */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Global Network</h3>
                      <p className="text-sm text-gray-600">500+ verified suppliers across 30+ countries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Quality Assurance</h3>
                      <p className="text-sm text-gray-600">On-site audits and capability assessments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Negotiation Support</h3>
                      <p className="text-sm text-gray-600">Expert guidance for pricing and terms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Risk Mitigation</h3>
                      <p className="text-sm text-gray-600">Supply chain resilience planning</p>
                    </div>
                  </div>
                </div>

                {/* Process */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-4">End-to-End Sourcing Process</h3>
                  <div className="space-y-2">
                    {[
                      { step: '1', title: 'Requirements Analysis', desc: 'Define technical, quality, and commercial needs' },
                      { step: '2', title: 'Supplier Identification', desc: 'Scout and shortlist capable suppliers' },
                      { step: '3', title: 'RFQ Management', desc: 'Manage quote requests and evaluations' },
                      { step: '4', title: 'Supplier Audit', desc: 'On-site quality and capability assessments' },
                      { step: '5', title: 'Negotiation & Contracting', desc: 'Finalize pricing and agreements' }
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">{item.step}</div>
                        <div className="flex-1">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-white/70 ml-2">· {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">500+</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Verified Suppliers</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">15-20%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Cost Savings</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">95%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Strategic Sourcing Carousel */}
              <div className="relative">
                <StrategicSourcingCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automotive Case Study */}
      <section id="expert-support-details" aria-labelledby="expert-support-heading" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Carousel - Left side */}
              <div className="order-2 lg:order-1">
                <AutomotiveCaseStudyCarousel />
              </div>

              {/* Content - Right side */}
              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Expert Engineer Support</p>
                <h2 id="expert-support-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
                  Specialized Talent, On-Demand
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Need specialized engineering expertise without the overhead of full-time hires? Deploy our experienced engineers directly into your team for project-based work or long-term support. Get the skills you need, when you need them.
                </p>

                {/* Expertise Areas */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emuski-teal-darker" />
                      Cost Engineering
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>• Should-cost modeling</li>
                      <li>• Cost reduction initiatives</li>
                      <li>• Supplier quote validation</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-emuski-teal-darker" />
                      Value Engineering
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>• VAVE workshops</li>
                      <li>• Product teardowns</li>
                      <li>• Design optimization</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emuski-teal-darker" />
                      Sourcing Specialists
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>• Supplier identification</li>
                      <li>• RFQ management</li>
                      <li>• Contract negotiation</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Cog className="w-4 h-4 text-emuski-teal-darker" />
                      Manufacturing Engineers
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>• DFM reviews</li>
                      <li>• Process planning</li>
                      <li>• Production ramp-up</li>
                    </ul>
                  </div>
                </div>

                {/* Engagement Models */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-4">Flexible Engagement Models</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Project-Based</p>
                        <p className="text-xs text-white/80">Dedicated resources for specific initiatives with defined deliverables</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Long-Term Partnership</p>
                        <p className="text-xs text-white/80">Extended engagements for ongoing support and team augmentation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Advisory Support</p>
                        <p className="text-xs text-white/80">Strategic guidance and periodic reviews from senior experts</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">50+</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Expert Engineers</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">3-5 days</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Deployment Time</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">98%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
