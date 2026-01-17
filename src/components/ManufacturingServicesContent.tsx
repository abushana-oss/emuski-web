import { CheckCircle, Zap, Layers, Cog, TrendingUp, Clock, Target, Award } from "lucide-react";
import Image from "next/image";

export const ManufacturingServicesContent = () => {
  const videoSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "On-Demand Manufacturing Services",
      "description": "EMUSKI On-Demand Manufacturing - No minimum order quantities, 24-48h turnaround. Ideal for prototyping and production.",
      "thumbnailUrl": "https://www.emuski.com/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-6.jpeg",
      "contentUrl": "https://www.emuski.com/video/manufacturing-video/ondemandmanufaturing.mp4",
      "uploadDate": "2025-01-01T08:00:00+05:30",
      "duration": "PT1M" // Estimate
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Custom Manufacturing & Precision Engineering",
      "description": "Precision engineering for complex components. VMC, Grinding, EDM capabilities for aerospace and medical industries.",
      "thumbnailUrl": "https://www.emuski.com/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-1.jpeg",
      "contentUrl": "https://www.emuski.com/video/manufacturing-video/custummanufaturing.mp4",
      "uploadDate": "2025-01-01T08:00:00+05:30",
      "duration": "PT1M" // Estimate
    }
  ];

  return (
    <div className="space-y-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchemas) }}
      />

      {/* On-Demand Manufacturing */}
      <section id="on-demand-details" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">On-Demand Manufacturing</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Manufacturing When You Need It, How You Need It
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We do not require minimum order quantities, and we keep lead times short. Our on-demand manufacturing service lets you order exactly what you need, when you need it. It is ideal for testing new products, handling seasonal demand, and keeping your inventory under control.
                </p>

                {/* Key Benefits */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">24-48h Turnaround</h4>
                      <p className="text-sm text-gray-600">Lightning-fast production cycles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Zero MOQ</h4>
                      <p className="text-sm text-gray-600">Order 1 unit or 10,000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                      <p className="text-sm text-gray-600">No compromise on standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emuski-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-emuski-teal-darker" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Scalable</h4>
                      <p className="text-sm text-gray-600">Grow as your demand grows</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">24-48h</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Lead Time</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">1-10k</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Unit Range</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">99.5%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">On-Time</div>
                  </div>
                </div>
              </div>

              {/* Video */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <video
                    className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    aria-label="On-demand manufacturing capabilities video"
                    poster="/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-6.jpeg"
                  >
                    <source src="/video/manufacturing-video/ondemandmanufaturing.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rapid Prototyping */}
      <section id="prototyping-details" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image - Left side */}
              <div className="relative order-2 lg:order-1 h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
                <Image
                  src="/assets/rapid-proto.svg"
                  alt="Rapid Prototyping Manufacturing"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>

              {/* Content - Right side */}
              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Rapid Prototyping</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  From Concept to Reality in Days, Not Months
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Fast and efficient prototyping services from concept to completion with precision and cost optimization.                </p>

                {/* Technologies */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h4 className="font-bold mb-4">Multi-Technology Approach</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Precision Machining</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">3D Printing (SLA / SLS / FDM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Vacuum Casting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Sheet Metal Fabrication</span>
                    </div>
                  </div>
                </div>


                {/* Process */}
                <div className="grid grid-cols-4 gap-3 pt-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">1</div>
                    <p className="text-xs text-gray-600">Design Review</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">2</div>
                    <p className="text-xs text-gray-600">Technology Selection</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">3</div>
                    <p className="text-xs text-gray-600">Production</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emuski-teal-dark text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">4</div>
                    <p className="text-xs text-gray-600">Validation</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">3-5 days</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Typical Lead Time</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">10+</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Materials Available</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">±0.005mm</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Precision</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Manufacturing */}
      <section id="custom-details" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Custom Manufacturing</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Precision Engineering for Complex Components
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your specifications, our expertise. We specialize in manufacturing complex, high-precision components that meet exact tolerances and stringent quality standards. From aerospace to medical devices, we deliver excellence across industries.
                </p>

                {/* Capabilities */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Core Capabilities</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">VMC Machining</p>
                        <p className="text-xs text-gray-600">Complex geometries with tight tolerances</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Precision Grinding</p>
                        <p className="text-xs text-gray-600">Micro-level surface finishing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">EDM & Wire Cutting</p>
                        <p className="text-xs text-gray-600">Hard materials and intricate patterns</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Surface Treatment</p>
                        <p className="text-xs text-gray-600">Anodizing, plating, coating</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industries */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Industries We Serve</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Aerospace', 'Automotive', 'Medical', 'Electronics', 'Industrial', 'Defense'].map((industry) => (
                      <span key={industry} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">±0.005mm</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Precision Level</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">50+</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Material Options</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">100%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Inspection</div>
                  </div>
                </div>
              </div>

              {/* Video */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <video
                    className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    aria-label="Custom manufacturing and precision engineering video"
                    poster="/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-1.jpeg"
                  >
                    <source src="/video/manufacturing-video/custummanufaturing.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Scaling */}
      <section id="scaling-details" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image - Left side */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src="/assets/precision-engineering-icon.svg"
                    alt="Production Scaling"
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23ffffff' width='600' height='400'/%3E%3Ctext fill='%236b7280' font-family='system-ui' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduction Scaling%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>

              {/* Content - Right side */}
              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Production Scaling</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Scale from Prototype to Mass Production Seamlessly
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Ready to scale? We manage the entire transition from low-volume prototyping to high-volume mass production. Our systematic approach ensures quality remains consistent while costs decrease through economies of scale.
                </p>

                {/* Scaling Approach */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h4 className="font-bold mb-4">Our Scaling Methodology</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                      <div>
                        <p className="font-medium text-sm">DFM Optimization</p>
                        <p className="text-xs text-white/80">Design refinement for manufacturability</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                      <div>
                        <p className="font-medium text-sm">Tooling Development</p>
                        <p className="text-xs text-white/80">Production tooling and fixtures</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                      <div>
                        <p className="font-medium text-sm">Process Validation</p>
                        <p className="text-xs text-white/80">PPAP and quality system setup</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                      <div>
                        <p className="font-medium text-sm">Ramp-Up</p>
                        <p className="text-xs text-white/80">Gradual volume increase with monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0" />
                    <span className="text-sm text-gray-700">30-50% cost reduction at scale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0" />
                    <span className="text-sm text-gray-700">Consistent quality assurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0" />
                    <span className="text-sm text-gray-700">Supply chain optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emuski-teal-darker flex-shrink-0" />
                    <span className="text-sm text-gray-700">Inventory management support</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">8-12 wks</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Scaling Timeline</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">98%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">On-Time Delivery</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-emuski-teal-darker">50k+</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Units/Month Capacity</div>
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
