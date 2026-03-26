'use client'

import { useState, useRef, useEffect, memo, useMemo, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

const servicesData = [
  {
    id: "manufacturing",
    category: "Manufacturing Excellence",
    tagline: "Precision at Scale",
    description: "Through the EMUSKI NPD Innovation Center, we transform your concepts into market-ready products with rapid prototyping and on-demand manufacturing—delivering precision, speed, and scalability across automotive, aerospace, and industrial applications.",
    gradient: "from-emuski-teal via-emuski-teal-dark to-emuski-teal-darker",
    accentColor: "bg-emuski-teal-darker",
    items: [
      {
        name: "On-Demand Manufacturing",
        link: "/manufacturing-services#on-demand",
      },
      {
        name: "Rapid Prototyping",
        link: "/manufacturing-services#prototyping",
      },
      {
        name: "Custom Manufacturing",
        link: "/manufacturing-services#custom",
      },
      {
        name: "Production Scaling",
        link: "/manufacturing-services#scaling",
      },
    ],
    relatedCategories: ["Manufacturing Excellences"]
  },
  {
    id: "engineering",
    category: "Engineering Innovation",
    tagline: "Engineering Excellence",
    description: "Leverage deep engineering expertise to optimize costs, validate designs, and strategically source components with precision and efficiency. Our expert team delivers data-driven insights for competitive advantage.",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    accentColor: "bg-emuski-teal-darker",
    items: [
      {
        name: "Product Cost Estimation",
        link: "/cost-engineering#cost-estimation",
      },
      {
        name: "VAVE - Teardown & Benchmarking",
        link: "/cost-engineering#vave",
      },
      {
        name: "Strategic Sourcing Support",
        link: "/cost-engineering#sourcing",
      },
      {
        name: "Expert Engineer Support",
        link: "/cost-engineering#expert-support",
      },
      {
        name: "Mithran AI Platform",
        link: "/solutions/ai#mithran-overview",
        beta: true,
      },
    ],
    relatedCategories: ["Engineering Innovations", "Next-GenAI"]
  }
];

const showcaseItems = [
  {
    title: "Product Cost Estimation",
    category: "Engineering Innovations",
    description: "Accurate cost analysis and estimation services to optimize your product development budget and maximize profitability.",
    image: "/assets/engineering/automotive-engineering-cost-estimation.svg",
    link: "/cost-engineering#cost-estimation"
  },
  {
    title: "VAVE - Teardown & Benchmarking",
    category: "Engineering Innovations",
    description: "Value Analysis and Value Engineering through comprehensive teardown studies and competitive benchmarking for cost optimization.",
    image: "/assets/engineering/product-teardown-analysis.png",
    link: "/cost-engineering#vave"
  },
  {
    title: "Strategic Sourcing Support",
    category: "Engineering Innovations",
    description: "Expert guidance in supplier selection and procurement strategy to ensure quality components at competitive prices.",
    image: "/assets/engineering/strategic-sourcing-solutions.svg",
    link: "/cost-engineering#sourcing"
  },
  {
    title: "Expert Engineer Support",
    category: "Engineering Innovations",
    description: "Dedicated engineering expertise to solve complex technical challenges and accelerate your product development lifecycle.",
    image: "/assets/engineering/supplier-management-system.svg",
    link: "/cost-engineering#expert-support"
  },
  {
    title: "On-Demand Manufacturing",
    category: "Manufacturing Excellences",
    description: "Flexible manufacturing solutions as you need them with high-precision components manufactured to demanding specifications.",
    image: "/assets/industry-components/defense-technology-manufacturing/defense-component-16.svg",
    link: "/manufacturing-services#on-demand"
  },
  {
    title: "Rapid Prototyping",
    category: "Manufacturing Excellences",
    description: "Fast and efficient prototyping services from concept to completion with precision and cost optimization.",
    image: "/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-10.svg",
    link: "/manufacturing-services#prototyping"
  },
  {
    title: "Custom Manufacturing",
    category: "Manufacturing Excellences",
    description: "Engineered manufacturing excellence designed around your requirements with precision and scalability.",
    image: "/assets/industry-components/aerospace-engineering-manufacturing/aerospace-component-6.svg",
    link: "/manufacturing-services#custom"
  },
  {
    title: "Production Scaling",
    category: "Manufacturing Excellences",
    description: "Seamless scaling from prototype to full production with advanced assembly stations and workflow optimization.",
    image: "/assets/industry-components/defense-technology-manufacturing/production.jpg",
    link: "/manufacturing-services#scaling"
  },
  {
    title: "Mithran AI Platform",
    category: "Next-GenAI",
    description: "AI-powered intelligence for smarter product development, supply chain, and cost optimization delivering measurable results for OEMs.",
    image: "/assets/mitran/ai-mithran-platform-dashboard.png",
    link: "/solutions/ai#mithran-overview"
  }
];

// Memoize the heavy project card component
const ProjectCard = memo(({ project, projectIndex }: { project: any; projectIndex: number }) => (
  <Link
    key={projectIndex}
    href={project.link}
    className="flex-shrink-0 w-[340px] group"
  >
    <div className="relative h-full bg-white overflow-hidden border border-gray-200 hover:border-emuski-teal-darker/40 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
        <Image
          src={project.image}
          alt={`${project.title} - ${project.category} Service`}
          width={800}
          height={450}
          className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6 flex-1">
        <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emuski-teal-darker transition-colors line-clamp-2">
          {project.title}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>
        <div className="flex items-center gap-2 text-emuski-teal-darker font-semibold group-hover:gap-3 transition-all duration-300">
          <span className="text-sm">Learn more</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emuski-teal via-emuski-teal-dark to-emuski-teal-darker transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  </Link>
));

const ServicesShowcase = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState<{ [key: string]: boolean }>({});
  const [showRightGradient, setShowRightGradient] = useState<{ [key: string]: boolean }>({});
  const [expandedQuickLinks, setExpandedQuickLinks] = useState<{ [key: string]: boolean }>({});
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const sectionScrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleQuickLinks = (serviceId: string) => {
    setExpandedQuickLinks(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback((serviceId: string) => {
    const container = sectionScrollRefs.current[serviceId];
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftGradient(prev => ({ ...prev, [serviceId]: scrollLeft > 10 }));
      setShowRightGradient(prev => ({ ...prev, [serviceId]: scrollLeft < scrollWidth - clientWidth - 10 }));
    }
  }, []);

  useEffect(() => {
    // Initialize gradient states
    servicesData.forEach(service => {
      const container = sectionScrollRefs.current[service.id];
      if (container) {
        setShowRightGradient(prev => ({ ...prev, [service.id]: true }));
        setShowLeftGradient(prev => ({ ...prev, [service.id]: false }));
      }
    });
  }, []);

  const scrollSection = useCallback((direction: 'left' | 'right', serviceId: string) => {
    const scrollContainer = sectionScrollRefs.current[serviceId];
    if (scrollContainer) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  const getFilteredShowcaseItems = useMemo(() => {
    const cache = new Map<string, typeof showcaseItems>();
    return (relatedCategories: string[]) => {
      const key = relatedCategories.join(',');
      if (!cache.has(key)) {
        cache.set(key, showcaseItems.filter(item =>
          relatedCategories.includes(item.category)
        ));
      }
      return cache.get(key)!;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-8 sm:py-10 bg-gradient-to-br from-slate-50 via-white to-slate-50"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emuski-teal/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full px-4 sm:px-6 relative z-10">
        {/* Services Sections */}
        <div className="space-y-10">
          {servicesData.map((service, serviceIndex) => {
            const filteredProjects = getFilteredShowcaseItems(service.relatedCategories);

            return (
              <div
                key={service.id}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${serviceIndex * 200}ms` }}
              >
                {/* Section Navigation */}
                <div className="flex items-center justify-end gap-2 mb-4">
                  <button
                    onClick={() => scrollSection('left', service.id)}
                    className="p-2.5 rounded-lg bg-emuski-teal-darker text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                    aria-label="Scroll section left"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => scrollSection('right', service.id)}
                    className="p-2.5 rounded-lg bg-emuski-teal-darker text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                    aria-label="Scroll section right"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Scrollable Section Wrapper */}
                <div className="relative">


                  {/* Service Info - Mobile First */}
                  <div className="lg:hidden mb-6">
                    <div className="flex-shrink-0 w-full">
                      <div className="space-y-4">
                        {/* Category Title */}
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                          {service.category}
                        </h3>

                        {/* Description */}
                        <p className="text-base text-gray-600 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Quick Links */}
                        <div className="pt-2">
                          <h3
                            className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 cursor-pointer active:text-emuski-teal-darker transition-colors select-none"
                            onClick={() => toggleQuickLinks(service.id)}
                          >
                            <ChevronRight className={`w-4 h-4 text-emuski-teal-darker transition-transform duration-200 ${expandedQuickLinks[service.id] ? 'rotate-90' : ''}`} />
                            Quick Links
                          </h3>
                          <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expandedQuickLinks[service.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <ul className="space-y-2 pb-2">
                              {service.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={item.link}
                                    className="group flex items-center gap-2 text-gray-700 active:text-emuski-teal-darker transition-colors duration-200"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-gray-400 group-active:bg-emuski-teal-darker transition-colors"></span>
                                    <span className="text-sm font-medium">{item.name}</span>
                                    {item.beta && (
                                      <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-300">
                                        BETA
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scroll Container */}
                  <div
                    ref={(el) => { if (el) sectionScrollRefs.current[service.id] = el }}
                    onScroll={() => handleScroll(service.id)}
                    className="overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {/* Service Section */}
                    <div className="flex gap-8 items-start min-w-full">

                      {/* Left Column - Service Info - Desktop Only */}
                      <div className="hidden lg:block flex-shrink-0 w-full lg:w-[400px]">
                        <div className="space-y-4">
                          {/* Category Title */}
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                            {service.category}
                          </h2>

                          {/* Description */}
                          <p className="text-base text-gray-600 leading-relaxed">
                            {service.description}
                          </p>

                          {/* Quick Links */}
                          <div className="pt-2">
                            <h3
                              className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 cursor-pointer hover:text-emuski-teal-darker transition-colors"
                              onClick={() => toggleQuickLinks(service.id)}
                              onMouseEnter={() => setExpandedQuickLinks(prev => ({ ...prev, [service.id]: true }))}
                            >
                              <ChevronRight className={`w-4 h-4 text-emuski-teal-darker transition-transform duration-300 ${expandedQuickLinks[service.id] ? 'rotate-90' : ''}`} />
                              Quick Links
                            </h3>
                            <div className={`overflow-hidden transition-all duration-300 ${expandedQuickLinks[service.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <ul className="space-y-2">
                                {service.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={item.link}
                                      className="group flex items-center gap-2 text-gray-700 hover:text-emuski-teal-darker transition-colors duration-200"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-emuski-teal-darker transition-colors"></span>
                                      <span className="text-sm font-medium">{item.name}</span>
                                      {item.beta && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-300">
                                          BETA
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Featured Projects */}
                      <div className="flex-shrink-0 w-full lg:w-auto">
                        {filteredProjects.length > 0 && (
                          <div className="space-y-4">
                            {/* Projects Carousel */}
                            <div className="flex gap-6">
                              {filteredProjects.map((project, projectIndex) => (
                                <ProjectCard 
                                  key={projectIndex} 
                                  project={project} 
                                  projectIndex={projectIndex} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Divider */}
                {serviceIndex < servicesData.length - 1 && (
                  <div className="mt-10">
                    <div className="h-px bg-gradient-to-r from-emuski-teal via-emuski-teal-dark to-emuski-teal-darker opacity-20"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export { ServicesShowcase };
