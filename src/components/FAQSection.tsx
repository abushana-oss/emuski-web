'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Search, MessageCircle, HelpCircle } from 'lucide-react';
import { getFAQsForPage, getFAQMetaForPage, type FAQItem } from '../data/pageSpecificFAQs';

// Remove duplicate interface - using the one from pageSpecificFAQs.ts

const FAQ_DATA: FAQItem[] = [
  // Manufacturing Excellences
  {
    id: 'what-is-oem-manufacturing',
    question: 'What is OEM manufacturing and how does EMUSKI provide it?',
    answer: 'OEM (Original Equipment Manufacturing) is when one company manufactures products or components that are sold by another company under their brand name. EMUSKI provides comprehensive OEM Manufacturing Excellences including design consultation, prototyping, production, quality control, and logistics. We handle everything from initial concept to final delivery, allowing you to focus on your core business while we manufacture your products to exact specifications.',
    category: 'Manufacturing Excellences',
    keywords: ['OEM manufacturing', 'original equipment manufacturer', 'custom manufacturing', 'private label manufacturing']
  },
  {
    id: 'manufacturing-capabilities',
    question: 'What manufacturing capabilities does EMUSKI offer?',
    answer: 'EMUSKI offers a complete range of manufacturing capabilities including CNC machining, injection molding, sheet metal fabrication, precision engineering, rapid prototyping, assembly services, quality testing, and packaging. Our state-of-the-art facility in Bangalore is equipped with advanced machinery and staffed by experienced engineers and technicians.',
    category: 'Manufacturing Excellences',
    keywords: ['CNC machining', 'injection molding', 'sheet metal', 'precision engineering', 'manufacturing capabilities']
  },
  {
    id: 'minimum-order-quantity',
    question: 'What is the minimum order quantity (MOQ) for manufacturing?',
    answer: 'Our minimum order quantity varies depending on the product complexity, materials, and manufacturing process. For prototyping and small batches, we can work with quantities as low as 10-50 pieces. For full production runs, MOQs typically range from 100-1000 pieces. We work closely with each client to find the most cost-effective solution for their specific needs.',
    category: 'Manufacturing Excellences',
    keywords: ['minimum order quantity', 'MOQ', 'small batch manufacturing', 'production quantities']
  },
  {
    id: 'lead-times',
    question: 'What are typical lead times for manufacturing projects?',
    answer: 'Lead times depend on project complexity and quantity. Rapid prototyping: 3-7 days. Small batch production (100-500 pieces): 2-3 weeks. Medium production runs (500-5000 pieces): 3-6 weeks. Large volume production: 6-12 weeks. We provide detailed timelines during the quotation process and offer expedited services when needed.',
    category: 'Manufacturing Excellences',
    keywords: ['lead times', 'delivery time', 'production schedule', 'manufacturing timeline']
  },

  // Quality & Certifications
  {
    id: 'quality-certifications',
    question: 'What quality certifications does EMUSKI have?',
    answer: 'EMUSKI is ISO 9001:2015 certified for Quality Management Systems, ISO 14001:2015 for Environmental Management, and ISO 45001:2018 for Occupational Health and Safety. We also maintain industry-specific certifications and follow international quality standards including Six Sigma methodologies and lean manufacturing principles.',
    category: 'Quality & Certifications',
    keywords: ['ISO certification', 'quality management', 'quality standards', 'Six Sigma', 'lean manufacturing']
  },
  {
    id: 'quality-control-process',
    question: 'How does EMUSKI ensure product quality?',
    answer: 'Our quality control process includes incoming material inspection, in-process quality checks, final product inspection, and statistical process control (SPC). We use advanced measurement equipment, conduct dimensional analysis, material testing, and functional testing. Every product is traceable through our quality management system with complete documentation.',
    category: 'Quality & Certifications',
    keywords: ['quality control', 'inspection process', 'quality assurance', 'testing procedures']
  },

  // Industries & Applications
  {
    id: 'industries-served',
    question: 'Which industries does EMUSKI serve?',
    answer: 'EMUSKI serves multiple industries including Automotive (components, assemblies), Aerospace (aircraft parts, defense systems), Medical Devices (surgical instruments, diagnostic equipment), Electronics (consumer and industrial), Defense (specialized components), Space Technology (satellite components), and Energy Sector (renewable energy components). Each industry receives specialized manufacturing solutions.',
    category: 'Industries & Applications',
    keywords: ['automotive manufacturing', 'aerospace components', 'medical devices', 'electronics manufacturing', 'defense manufacturing']
  },
  {
    id: 'automotive-manufacturing',
    question: 'Does EMUSKI manufacture automotive components?',
    answer: 'Yes, EMUSKI specializes in automotive component manufacturing including engine parts, transmission components, brake systems, suspension parts, electrical components, and custom automotive accessories. We follow automotive industry standards (IATF 16949) and work with both OEMs and Tier 1 suppliers globally.',
    category: 'Industries & Applications',
    keywords: ['automotive components', 'automotive parts', 'IATF 16949', 'automotive OEM', 'car parts manufacturing']
  },

  // Pricing & Business
  {
    id: 'cost-savings',
    question: 'How much can companies save by manufacturing with EMUSKI?',
    answer: 'Companies typically save 30-60% compared to manufacturing in Western countries while maintaining the same quality standards. Savings come from competitive labor costs, efficient processes, economies of scale, and our optimized supply chain. We provide detailed cost breakdowns and ROI analysis for each project.',
    category: 'Pricing & Business',
    keywords: ['cost savings', 'manufacturing costs', 'competitive pricing', 'ROI', 'cost optimization']
  },
  {
    id: 'payment-terms',
    question: 'What are EMUSKI\'s payment terms and accepted currencies?',
    answer: 'We offer flexible payment terms including 30% advance with 70% on delivery for new clients, and extended terms for established partnerships. We accept payments in USD, EUR, GBP, and INR through bank transfers, letters of credit, and other secure payment methods. All pricing is transparent with no hidden costs.',
    category: 'Pricing & Business',
    keywords: ['payment terms', 'currencies accepted', 'payment methods', 'pricing', 'international payments']
  },

  // Technical & Engineering
  {
    id: 'design-support',
    question: 'Does EMUSKI provide design and engineering support?',
    answer: 'Yes, our experienced engineering team provides comprehensive design support including Design for Manufacturing (DFM), CAD modeling, prototyping, material selection, and design optimization. We use advanced software tools and work collaboratively with clients to optimize designs for manufacturability, cost, and performance.',
    category: 'Technical & Engineering',
    keywords: ['design for manufacturing', 'DFM', 'CAD design', 'engineering support', 'design optimization']
  },
  {
    id: 'materials-used',
    question: 'What materials can EMUSKI work with?',
    answer: 'We work with a wide range of materials including metals (aluminum, steel, stainless steel, titanium, brass, copper), plastics (ABS, PC, PP, PE, POM, PEEK), composites (carbon fiber, fiberglass), ceramics, and specialty materials. Our material selection expertise helps optimize performance while controlling costs.',
    category: 'Technical & Engineering',
    keywords: ['materials', 'metals', 'plastics', 'composites', 'material selection', 'engineering materials']
  },

  // International & Logistics
  {
    id: 'international-shipping',
    question: 'How does EMUSKI handle international shipping and logistics?',
    answer: 'We have established partnerships with major logistics providers (DHL, FedEx, UPS) and freight forwarders for seamless international shipping. We handle all export documentation, customs clearance, and compliance requirements. Our logistics team tracks shipments and provides real-time updates to ensure timely delivery.',
    category: 'International & Logistics',
    keywords: ['international shipping', 'logistics', 'export', 'customs clearance', 'freight forwarding']
  },
  {
    id: 'global-support',
    question: 'Does EMUSKI provide support for international clients?',
    answer: 'Yes, we provide comprehensive support for international clients including English-speaking project managers, timezone-flexible communication, cultural business understanding, compliance with international standards, and local representation in key markets. Our team is experienced in working with clients from USA, UK, Europe, and Asia-Pacific.',
    category: 'International & Logistics',
    keywords: ['international support', 'global clients', 'English communication', 'international standards']
  },

  // Technology & Innovation
  {
    id: 'ai-manufacturing',
    question: 'How does EMUSKI use AI in manufacturing?',
    answer: 'EMUSKI leverages AI and Industry 4.0 technologies for predictive maintenance, quality control automation, production optimization, supply chain management, and real-time monitoring. Our AI-powered systems help reduce defects, optimize production schedules, and improve overall efficiency while maintaining consistent quality.',
    category: 'Technology & Innovation',
    keywords: ['AI manufacturing', 'Industry 4.0', 'smart manufacturing', 'automation', 'predictive maintenance']
  },
  {
    id: 'prototyping-services',
    question: 'What rapid prototyping services does EMUSKI offer?',
    answer: 'We offer comprehensive rapid prototyping services including 3D printing (SLA, SLS, FDM), CNC prototyping, vacuum casting, sheet metal prototyping, and functional testing. Our rapid prototyping helps validate designs quickly, test functionality, and accelerate time-to-market for new products.',
    category: 'Technology & Innovation',
    keywords: ['rapid prototyping', '3D printing', 'CNC prototyping', 'product development', 'prototyping services']
  }
];

const CATEGORIES = [
  'All',
  'Manufacturing Excellences',
  'Quality & Certifications',
  'Industries & Applications',
  'Pricing & Business',
  'Technical & Engineering',
  'International & Logistics',
  'Technology & Innovation'
];

interface FAQSectionProps {
  compact?: boolean;
  showCategories?: boolean;
  maxItems?: number;
  title?: string;
  description?: string;
  usePageSpecific?: boolean; // New prop to enable page-specific FAQs
  skipSchema?: boolean; // Skip rendering schema (if page has its own combined schema)
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  compact = false,
  showCategories = true,
  maxItems,
  title,
  description,
  usePageSpecific = false,
  skipSchema = false
}) => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [currentFAQs, setCurrentFAQs] = useState<FAQItem[]>(FAQ_DATA);
  const [pageMetaData, setPageMetaData] = useState({
    title: "FAQ - Manufacturing & Engineering Questions",
    description: "Get answers to common questions about EMUSKI's Manufacturing Excellences, quality processes, and how we can help your business succeed."
  });

  // Update FAQs and meta data based on current page
  useEffect(() => {
    if (usePageSpecific) {
      const pageSpecificFAQs = getFAQsForPage(pathname);
      const pageMeta = getFAQMetaForPage(pathname);
      setCurrentFAQs(pageSpecificFAQs);
      setPageMetaData(pageMeta);

      // Update document meta for SEO if on main FAQ page
      if (pathname === '/faq') {
        document.title = pageMeta.title;
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', pageMeta.description);
      }
    }
  }, [pathname, usePageSpecific]);

  // Use provided title/description or page-specific ones
  const displayTitle = title || (usePageSpecific ? pageMetaData.title : "FAQ - Frequently Asked Questions");
  const displayDescription = description || (usePageSpecific ? pageMetaData.description : "Get answers to common questions about EMUSKI's Manufacturing Excellences, quality processes, and how we can help your business succeed.");

  let filteredFAQs = currentFAQs.filter(faq => {
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Update categories based on current FAQs
  const currentCategories = ['All', ...Array.from(new Set(currentFAQs.map(faq => faq.category)))];

  // Limit items if specified
  if (maxItems) {
    filteredFAQs = filteredFAQs.slice(0, maxItems);
  }

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <>
      {/* Enhanced Structured Data for SEO and AI Chatbots - Only render if not skipped */}
      {!skipSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "about": {
                "@type": "Organization",
                "name": "EMUSKI Manufacturing Solutions",
                "description": "Leading manufacturing company in Bangalore, India providing OEM manufacturing, precision engineering, and custom Manufacturing Excellences"
              },
              "mainEntity": currentFAQs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "keywords": faq.keywords.join(", "),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                  "author": {
                    "@type": "Organization",
                    "name": "EMUSKI Manufacturing Solutions"
                  }
                }
              })),
              "inLanguage": "en-US",
              "publisher": {
                "@type": "Organization",
                "name": "EMUSKI Manufacturing Solutions",
                "url": "https://www.emuski.com"
              }
            })
          }}
        />
      )}

      <section className={`${compact ? 'py-12' : 'py-20'} bg-gradient-to-br from-slate-50 to-blue-50`}>
        <div className="w-full px-4 sm:px-6">
          <div className="w-full">
            {/* Header */}
            <div className={`text-center ${compact ? 'mb-8' : 'mb-16'}`}>
              <h2 className={`${compact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} font-bold text-gray-900 mb-4`}>
                {displayTitle}
              </h2>
              <p className={`${compact ? 'text-lg' : 'text-xl'} text-gray-600 max-w-3xl mx-auto`}>
                {displayDescription}
              </p>
            </div>

            {/* Search and Filter */}
            {!compact && (
              <div className="mb-12 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-emuski-teal focus:border-transparent bg-white shadow-sm"
                  />
                </div>

                {/* Category Filter */}
                {showCategories && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                          ? 'bg-emuski-teal-dark text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-emuski-teal/10 hover:text-emuski-teal-dark border border-gray-200'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Results Info */}
            {(searchTerm || selectedCategory !== 'All') && (
              <div className="mb-8 text-center">
                <p className="text-gray-600">
                  Showing {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
                  {searchTerm && (
                    <span> for "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span> in <span className="font-semibold text-blue-600">{selectedCategory}</span></span>
                  )}
                </p>
              </div>
            )}

            {/* FAQ Items */}
            <div className="space-y-3 max-w-4xl mx-auto">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or browse by category
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="bg-emuski-teal-dark text-white px-6 py-2 rounded-lg hover:bg-emuski-teal-darker transition-colors"
                  >
                    View All FAQs
                  </button>
                </div>
              ) : (
                filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-emuski-teal focus:ring-inset"
                      aria-expanded={openItems.has(faq.id)}
                      itemScope
                      itemType="https://schema.org/Question"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-4">
                          <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-1`} itemProp="name">
                            {faq.question}
                          </h3>
                          {!compact && (
                            <span className="inline-block px-3 py-1 bg-emuski-teal/10 text-emuski-teal-darker text-xs font-medium rounded-full">
                              {faq.category}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${openItems.has(faq.id) ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                    </button>

                    {openItems.has(faq.id) && (
                      <div className="px-6 pb-4 pt-2 border-t border-gray-100 bg-gray-50" itemScope itemType="https://schema.org/Answer">
                        <div
                          className={`text-gray-700 leading-relaxed ${compact ? 'text-sm' : 'text-base'}`}
                          data-translate="faq_answer"
                          itemProp="text"
                        >
                          {faq.answer}
                        </div>

                        {/* Keywords for SEO - Only show in full version */}
                        {!compact && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                              <span className="text-sm text-gray-500 mr-2">Related:</span>
                              {faq.keywords.slice(0, 3).map((keyword, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-emuski-teal/10 text-emuski-teal-darker text-xs rounded-md"
                                  itemProp="keywords"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                            {/* Hidden SEO content for search engines and AI (without body-level <meta> tags) */}
                            <div className="sr-only">
                              <span itemProp="about">{faq.category}</span>
                              <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                                <span itemProp="name">EMUSKI Manufacturing Solutions</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Contact CTA - Only show in full version or if specified */}
            {!compact && (
              <div className="mt-12 text-center bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                  Our manufacturing experts are here to help. Get personalized answers to your specific
                  manufacturing requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/contact"
                    className="bg-emuski-teal-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-emuski-teal-darker transition-colors inline-flex items-center justify-center"
                  >
                    Contact Our Experts
                  </a>
                  <a
                    href="tel:+91-86670-88060"
                    className="border-2 border-emuski-teal text-emuski-teal-darker px-6 py-3 rounded-lg font-semibold hover:bg-emuski-teal/5 transition-colors inline-flex items-center justify-center"
                  >
                    +91-86670-88060
                  </a>
                </div>
              </div>
            )}

            {/* Compact version - Link to contact page for more questions */}
            {compact && maxItems && (
              <div className="mt-8 text-center">
                <a
                  href="/contact"
                  className="inline-flex items-center text-emuski-teal-darker hover:text-emuski-teal-dark font-semibold transition-colors"
                >
                  Have More Questions? Contact Us
                  <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};