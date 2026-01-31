'use client'

import { Menu, ChevronDown, Home } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
const emuskiLogo = "/assets/emuski-logo-optimized.webp";

interface NavItem {
  name: string;
  path: string;
  hideOnMobile?: boolean;
}

const servicesDropdown = {
  manufacturingServices: {
    name: "Manufacturing Excellence",
    path: "/manufacturing-services",
    subItems: [
      { name: "On-Demand Manufacturing", path: "/manufacturing-services#on-demand-details" },
      { name: "Rapid Prototyping", path: "/manufacturing-services#prototyping-details" },
      { name: "Custom Manufacturing", path: "/manufacturing-services#custom-details" },
      { name: "Production Scaling", path: "/manufacturing-services#scaling-details" }
    ]
  },
  precisionEngineering: {
    name: "Engineering Innovation",
    path: "/precision-engineering",
    subItems: [
      { name: "Product Cost Estimation", path: "/precision-engineering#cost-estimation-details" },
      { name: "VAVE & Benchmarking", path: "/precision-engineering#vave-details" },
      { name: "Strategic Sourcing", path: "/precision-engineering#sourcing-details" },
      { name: "Expert Engineer Support", path: "/precision-engineering#expert-support-details" },
      { name: "Mithran AI", path: "/solutions/ai", beta: true }
    ]
  }
};

const navigationConfig = {
  leftMenu: [
    { name: "Next-GenAI", path: "/solutions/ai" },
    { name: "Blog", path: "/blog" }
  ],
  rightMenu: [
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact", hideOnMobile: true }
  ],
  mobileMenuSections: [
    {
      title: "Manufacturing Excellence",
      items: [
        { name: "On-Demand Manufacturing", path: "/manufacturing-services#on-demand-details" },
        { name: "Rapid Prototyping", path: "/manufacturing-services#prototyping-details" },
        { name: "Custom Manufacturing", path: "/manufacturing-services#custom-details" },
        { name: "Production Scaling", path: "/manufacturing-services#scaling-details" }
      ]
    },
    {
      title: "Engineering Innovation",
      items: [
        { name: "Product Cost Estimation", path: "/precision-engineering#cost-estimation-details" },
        { name: "VAVE & Benchmarking", path: "/precision-engineering#vave-details" },
        { name: "Strategic Sourcing", path: "/precision-engineering#sourcing-details" },
        { name: "Expert Engineer Support", path: "/precision-engineering#expert-support-details" }
      ]
    },
    {
      title: "Solutions",
      items: [
        { name: "Next-GenAI", path: "/solutions/ai" },
        { name: "Gallery", path: "/gallery" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" }
      ]
    }
  ]
};

// Map of all routes to their display names
const routeToPageName: Record<string, string> = {
  "/": "Home",
  "/manufacturing-services": "Manufacturing Excellence",
  "/precision-engineering": "Engineering Innovation",
  "/blog": "Blog",
  "/gallery": "Gallery",
  "/contact": "Contact",
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
    const baseClasses = "transition-colors text-sm font-medium";
    const activeClasses = "text-emuski-teal-darker";
    const inactiveClasses = "text-foreground hover:text-emuski-teal-darker";
    
    return `${baseClasses} ${isActiveLink(path) ? activeClasses : inactiveClasses}`;
  };

  const getServicesButtonClasses = () => {
    const baseClasses = "transition-colors text-sm font-medium flex items-center space-x-1";
    const activeClasses = "text-emuski-teal-darker";
    const inactiveClasses = "text-foreground hover:text-emuski-teal-darker";
    
    return `${baseClasses} ${isActiveServiceLink() ? activeClasses : inactiveClasses}`;
  };

  const getCurrentPageName = () => {
    return routeToPageName[pathname] || "Page";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-1.5 group">
              <Image
                src={emuskiLogo}
                alt="EMUSKI Manufacturing Solutions Logo"
                width={32}
                height={16}
                style={{ width: 'auto', height: 'auto' }}
                className="h-4 sm:h-5 w-auto object-contain [image-rendering:crisp-edges] contrast-110 brightness-105"
                quality={75}
                priority
              />
              <span className="text-base sm:text-lg font-bold text-foreground">EMUSKI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6" ref={servicesRef}>
              <Link
                href="/"
                className={`${getLinkClasses("/")} flex items-center gap-1`}
                title="Home"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>

              {/* Individual Service Dropdowns */}
              {Object.entries(servicesDropdown).map(([key, service]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setActiveServiceDropdown(key)}
                  onMouseLeave={() => setActiveServiceDropdown(null)}
                >
                  <div className="flex items-center">
                    <Link
                      href={service.path}
                      className={getLinkClasses(service.path)}
                      onClick={() => setActiveServiceDropdown(null)}
                    >
                      {service.name}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveServiceDropdown(activeServiceDropdown === key ? null : key);
                      }}
                      className="ml-1 p-1 text-foreground hover:text-emuski-teal-darker transition-colors"
                    >
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeServiceDropdown === key ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {activeServiceDropdown === key && (
                    <div
                      className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                      style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    >
                      <div className="py-2">
                        <Link
                          href={service.path}
                          className="block px-4 py-3 text-sm font-semibold text-emuski-teal-darker border-b border-gray-100 hover:bg-emuski-teal/5"
                          onClick={() => setActiveServiceDropdown(null)}
                        >
                          {service.name} Overview
                        </Link>
                        {service.subItems.map((subItem, index) => (
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
                  )}
                </div>
              ))}

              {navigationConfig.leftMenu.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={getLinkClasses(item.path)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              {navigationConfig.rightMenu.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={getLinkClasses(item.path)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <span className="sm:hidden transition-colors text-sm font-medium text-emuski-teal-darker">
              {getCurrentPageName()}
            </span>

            <div className="flex items-center space-x-2 relative md:hidden" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent h-10 w-10 text-foreground hover:text-emuski-teal-darker"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[9998]" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                  <div className="p-3 bg-gradient-to-br from-emuski-teal/5 to-emuski-teal/10 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={emuskiLogo}
                        alt="EMUSKI Manufacturing Solutions Logo"
                        width={28}
                        height={14}
                        style={{ width: 'auto', height: 'auto' }}
                        className="h-3.5 w-auto object-contain [image-rendering:crisp-edges] contrast-[1.2] brightness-110 opacity-80"
                        quality={75}
                      />
                      <div>
                        <p className="text-[10px] text-gray-600 leading-tight">One-stop solution for OEMs</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {navigationConfig.mobileMenuSections.map((section, sectionIndex) => {
                      // Get the link for section titles
                      const getSectionLink = (title: string) => {
                        if (title === "Manufacturing Excellence") return "/manufacturing-services";
                        if (title === "Engineering Innovation") return "/precision-engineering";
                        return null;
                      };

                      const sectionLink = section.title ? getSectionLink(section.title) : null;

                      return (
                        <div key={sectionIndex} className={sectionIndex > 0 ? "border-t border-gray-100 pt-2 mt-2" : ""}>
                          {section.title && (
                            sectionLink ? (
                              <Link
                                href={sectionLink}
                                className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-3 hover:text-emuski-teal-darker transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {section.title}
                              </Link>
                            ) : (
                              <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-3">{section.title}</h4>
                            )
                          )}
                          <div className="space-y-0.5">
                            {section.items.map((item) => (
                              <Link
                                key={item.path}
                                href={item.path}
                                className="block px-3 py-1.5 text-[13px] text-gray-700 hover:bg-emuski-teal/5 hover:text-emuski-teal-darker transition-colors"
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
    </nav>
  );
};