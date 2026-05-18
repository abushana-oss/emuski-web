'use client'

import { Menu, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
const emuskiLogo = "/logo.svg";
const emuskiLogoMobile = "/logo.webp";

interface NavItem {
  name: string;
  path: string;
  hideOnMobile?: boolean;
}

const servicesDropdown = {
  manufacturingServices: {
    name: "Precision Manufacturing",
    path: "/manufacturing-services",
    subItems: [
      { name: "On-Demand Manufacturing", path: "/manufacturing-services#on-demand-details" },
      { name: "Rapid Prototyping", path: "/manufacturing-services#prototyping-details" },
      { name: "Custom Manufacturing", path: "/manufacturing-services#custom-details" },
      { name: "Production Scaling", path: "/manufacturing-services#scaling-details" }
    ]
  },
  costEngineering: {
    name: "Cost Engineering",
    path: "/cost-engineering",
    subItems: [
      { name: "Product Cost Estimation", path: "/cost-engineering#cost-estimation-details" },
      { name: "VAVE & Benchmarking", path: "/cost-engineering#vave-details" },
      { name: "Strategic Sourcing", path: "/cost-engineering#sourcing-details" },
      { name: "Expert Engineer Support", path: "/cost-engineering#expert-support-details" },
      { name: "Mithran AI", path: "/solutions/ai", beta: true }
    ]
  },
};



const navigationConfig = {
  leftMenu: [
    { name: "Next-GenAI", path: "/solutions/ai" },
    { name: "Blog", path: "/blog" }
  ],
  rightMenu: [
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ],
  mobileMenuSections: [
    {
      title: "Precision Manufacturing",
      items: [
        { name: "On-Demand Manufacturing", path: "/manufacturing-services#on-demand-details" },
        { name: "Rapid Prototyping", path: "/manufacturing-services#prototyping-details" },
        { name: "Custom Manufacturing", path: "/manufacturing-services#custom-details" },
        { name: "Production Scaling", path: "/manufacturing-services#scaling-details" }
      ]
    },
    {
      title: "Cost Engineering",
      items: [
        { name: "Product Cost Estimation", path: "/cost-engineering#cost-estimation-details" },
        { name: "VAVE & Benchmarking", path: "/cost-engineering#vave-details" },
        { name: "Strategic Sourcing", path: "/cost-engineering#sourcing-details" },
        { name: "Expert Engineer Support", path: "/cost-engineering#expert-support-details" }
      ]
    },
    {
      title: "Solutions",
      items: [
        { name: "Next-GenAI", path: "/solutions/ai" },
        { name: "Blog", path: "/blog" },
        { name: "Gallery", path: "/gallery" },
        { name: "Contact", path: "/contact" }
      ]
    }
  ]
};

// Map of all routes to their display names
const routeToPageName: Record<string, string> = {
  "/": "Home",
  "/manufacturing-services": "Precision Manufacturing",
  "/cost-engineering": "Cost Engineering",
  "/blog": "Blog",
  "/gallery": "Gallery",
  "/contact": "Request Quote",
  "/solutions/ai": "Next-GenAI"
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeServiceDropdown, setActiveServiceDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setActiveServiceDropdown(null);
      }
    };

    if (isMenuOpen || activeServiceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, activeServiceDropdown]);

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  const isActiveServiceLink = () => {
    return Object.values(servicesDropdown).some(service => service.path === pathname);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "transition-colors duration-150 text-[16px] font-medium tracking-wide whitespace-nowrap";
    const activeClasses = "text-emuski-teal-darker";
    const inactiveClasses = "text-gray-900 hover:text-emuski-teal-darker";

    return `${baseClasses} ${isActiveLink(path) ? activeClasses : inactiveClasses}`;
  };

  const getServicesButtonClasses = () => {
    const baseClasses = "transition-colors duration-150 text-[16px] font-medium tracking-wide flex items-center space-x-1 whitespace-nowrap";
    const activeClasses = "text-emuski-teal-darker";
    const inactiveClasses = "text-gray-900 hover:text-emuski-teal-darker";

    return `${baseClasses} ${isActiveServiceLink() ? activeClasses : inactiveClasses}`;
  };

  const getCurrentPageName = () => {
    return routeToPageName[pathname] || "Page";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <div className="w-full px-8 sm:px-14">
        <div className="flex items-center justify-between h-16">
          {/* Logo — far left */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src={emuskiLogo}
              alt="EMUSKI Manufacturing Solutions Logo"
              width={40}
              height={40}
              sizes="40px"
              className="h-10 w-10 object-contain flex-shrink-0"
              quality={100}
              priority
              unoptimized={true}
            />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">EMUSKI</span>
          </Link>

          {/* Right side — centered nav + CTA + mobile controls */}
          <div className="flex items-center flex-1">
            {/* Desktop nav — centered */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center" ref={servicesRef}>
              {/* Service dropdowns */}
              {Object.entries(servicesDropdown).map(([key, service]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setActiveServiceDropdown(key)}
                  onMouseLeave={() => setActiveServiceDropdown(null)}
                >
                  <div className="flex items-center">
                    {service.path !== "#" ? (
                      <Link
                        href={service.path}
                        className={getLinkClasses(service.path)}
                        onClick={() => setActiveServiceDropdown(null)}
                      >
                        {service.name}
                      </Link>
                    ) : (
                      <span className={getLinkClasses("#")}>{service.name}</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveServiceDropdown(activeServiceDropdown === key ? null : key);
                      }}
                      className="ml-1 p-1 text-gray-400 hover:text-emuski-teal-darker transition-colors duration-150"
                    >
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeServiceDropdown === key ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {activeServiceDropdown === key && (
                    <div className="absolute top-full right-0 pt-2 w-64 z-[60]">
                      <div
                        className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                        style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                      >
                        <div className="py-2">
                          {service.path !== "#" && (
                            <Link
                              href={service.path}
                              className="block px-4 py-3 text-sm font-semibold text-emuski-teal-darker border-b border-gray-100 hover:bg-emuski-teal/5"
                              onClick={() => setActiveServiceDropdown(null)}
                            >
                              {service.name} Overview
                            </Link>
                          )}
                          {service.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-emuski-teal/5 hover:text-emuski-teal-darker transition-colors"
                              onClick={() => setActiveServiceDropdown(null)}
                            >
                              <div className="flex items-center justify-between">
                                <span>{subItem.name}</span>
                                {subItem.beta && (
                                  <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-300">
                                    BETA
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {[...navigationConfig.leftMenu, ...navigationConfig.rightMenu].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={getLinkClasses(item.path)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Request Quote CTA — far right corner */}
            <Link
              href="/contact#request-form"
              className="hidden md:inline-flex items-center gap-2 flex-shrink-0 bg-emuski-teal text-white text-[13px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full shadow-md hover:bg-emuski-teal-dark hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-150"
            >
              Request Quote
              <span className="text-base leading-none">→</span>
            </Link>

            {/* Mobile: current page name + hamburger — pushed to far right */}
            <div className="flex items-center gap-2 md:hidden ml-auto" ref={menuRef}>
            <span className="sm:hidden transition-colors text-lg font-medium text-gray-900">
              {getCurrentPageName()}
            </span>

            <div className="flex items-center space-x-2 relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent h-10 w-10 text-foreground hover:text-emuski-teal-darker"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[70]" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                  <div className="relative z-20 p-4 bg-gradient-to-br from-emuski-teal/5 to-emuski-teal/10 border-b border-gray-100 flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={emuskiLogoMobile}
                        alt="EMUSKI Manufacturing Solutions Logo"
                        width={72}
                        height={72}
                        sizes="22px"
                        className="h-[18px] w-auto object-contain opacity-80"
                        style={{ 
                          width: "22px", 
                          height: "22px", 
                          maxWidth: "22px", 
                          maxHeight: "22px",
                          imageRendering: "-webkit-optimize-contrast"
                        } as React.CSSProperties}
                        quality={100}
                        unoptimized={true}
                        priority
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-700 leading-tight">One-stop solution for OEMs</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {navigationConfig.mobileMenuSections.map((section, sectionIndex) => {
                      // Get the link for section titles
                      const getSectionLink = (title: string) => {
                        if (title === "Precision Manufacturing") return "/manufacturing-services";
                        if (title === "Cost Engineering") return "/cost-engineering";
                        return null;
                      };

                      const sectionLink = section.title ? getSectionLink(section.title) : null;

                      return (
                        <div key={sectionIndex} className={sectionIndex > 0 ? "border-t border-gray-100 pt-2 mt-2" : ""}>
                          {section.title && (
                            sectionLink ? (
                              <Link
                                href={sectionLink}
                                className="flex items-center justify-between text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-3 hover:text-emuski-teal-darker transition-colors whitespace-nowrap"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <span>{section.title}</span>
                              </Link>
                            ) : (
                              <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-3 whitespace-nowrap">{section.title}</h4>
                              </div>
                            )
                          )}
                          <div className="space-y-0.5">
                            {section.items.map((item) => (
                              <Link
                                key={item.path}
                                href={item.path}
                                className="block pl-5 pr-3 py-1.5 text-[13px] text-gray-700 hover:bg-emuski-teal/5 hover:text-emuski-teal-darker transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};