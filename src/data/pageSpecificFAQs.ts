export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

// Home page FAQs - EMUSKI company focused with brand intent and semantic matching
export const HOME_FAQS: FAQItem[] = [
  {
    id: 'who-is-EMUSKI-company',
    question: 'Who is EMUSKI and what makes us different from other manufacturing companies?',
    answer: 'EMUSKI is a pioneering manufacturing company in Bangalore, India, founded in 2008 with 15+ years of proven excellence. What sets us apart is our unique combination of traditional manufacturing expertise with cutting-edge AI technology, Industry 4.0 integration, and unwavering commitment to quality. We are ISO 9001:2015 certified with state-of-the-art facilities in Electronic City, serving global clients across automotive, aerospace, medical devices, and electronics industries.',
    category: 'About EMUSKI',
    keywords: ['EMUSKI company profile', 'who is EMUSKI', 'EMUSKI manufacturing expertise', 'EMUSKI Bangalore company', 'manufacturing company since 2008', 'Industry 4.0 EMUSKI']
  },
  {
    id: 'EMUSKI-mission-vision-values',
    question: 'What is EMUSKI\'s mission and core values in manufacturing?',
    answer: 'EMUSKI\'s mission is to revolutionize manufacturing through precision engineering, AI-driven innovation, and sustainable practices while delivering exceptional value to our global clients. Our core values include: Quality Excellence (ISO certified processes), Innovation Leadership (AI-powered manufacturing), Customer Success (dedicated partnership approach), Sustainability (eco-friendly practices), and Integrity (transparent business ethics). We believe in transforming ideas into reality with precision and passion.',
    category: 'About EMUSKI',
    keywords: ['EMUSKI mission', 'EMUSKI values', 'manufacturing philosophy', 'quality excellence EMUSKI', 'innovation leadership', 'sustainable manufacturing']
  },
  {
    id: 'EMUSKI-leadership-team-expertise',
    question: 'What expertise does EMUSKI\'s leadership team bring to manufacturing?',
    answer: 'EMUSKI\'s leadership combines decades of manufacturing excellence with cutting-edge technology expertise. Our team includes seasoned manufacturing engineers, AI technology specialists, quality management experts, and business leaders with global experience. We have deep domain knowledge in automotive engineering, aerospace precision, medical device regulations, and electronics manufacturing, enabling us to deliver world-class solutions across diverse industries.',
    category: 'Leadership & Expertise',
    keywords: ['EMUSKI leadership', 'manufacturing expertise', 'engineering team EMUSKI', 'automotive expertise', 'aerospace engineering', 'medical device experts']
  },
  {
    id: 'EMUSKI-technology-innovation',
    question: 'How does EMUSKI use technology and innovation in manufacturing?',
    answer: 'EMUSKI leverages advanced Industry 4.0 technologies with measurable performance: AI-powered quality control achieving 99.5% first-pass yield, IoT sensors monitoring 200+ process parameters in real-time, predictive maintenance with 94.2% accuracy reducing downtime by 35%, and digital twin technology covering 68% of manufacturing processes. Our OEE (Overall Equipment Effectiveness) reaches 87.3% through automation integration and machine learning algorithms.',
    category: 'Technology & Innovation',
    keywords: ['EMUSKI AI manufacturing', 'OEE 87.3%', 'IoT manufacturing', '94.2% predictive maintenance', 'digital twin technology', 'Industry 4.0 manufacturing']
  },
  {
    id: 'EMUSKI-global-reach-bangalore',
    question: 'How does EMUSKI serve global clients from Bangalore?',
    answer: 'From our strategic Bangalore location, EMUSKI serves clients worldwide with comprehensive global support services. We offer 24/7 communication across time zones, English-speaking project management teams, international quality certifications, seamless export logistics, and compliance with global standards including FDA, CE, and ITAR. Our Bangalore facility provides cost advantages while maintaining world-class quality standards for international markets.',
    category: 'Global Services',
    keywords: ['EMUSKI global services', 'international manufacturing Bangalore', 'global client support', '24/7 manufacturing support', 'export manufacturing India', 'worldwide quality standards']
  },
  {
    id: 'EMUSKI-success-stories-achievements',
    question: 'What are EMUSKI\'s key achievements and success stories?',
    answer: 'EMUSKI delivers measurable results: 15+ industries served, 75+ global clients, 150+ individual engineering projects, 4000+ unique components manufactured. Technical achievements include ISO 9001:2015/14001:2015/45001:2018 certifications, 98.7% on-time delivery rate, 99.5% quality acceptance rate, 15 PPM defect rate, Cpk values >2.0 for critical processes, and OEE of 87.3%. Cost engineering delivers 25-45% reductions while maintaining precision tolerances ±0.0025mm.',
    category: 'Success Stories',
    keywords: ['15+ industries', '75+ clients', '150+ projects', '4000+ components', '98.7% on-time delivery', 'Cpk >2.0', 'OEE 87.3%']
  }
];

// Manufacturing Excellences page FAQs - Process-focused with service delivery intent
export const MANUFACTURING_SERVICES_FAQS: FAQItem[] = [
  {
    id: 'oem-manufacturing-process-flow',
    question: 'What is the complete OEM manufacturing process at EMUSKI?',
    answer: 'EMUSKI\'s OEM manufacturing process follows a proven 7-stage methodology: 1) Initial consultation and requirement analysis, 2) Design for Manufacturing (DFM) optimization, 3) Rapid prototyping and validation, 4) Tooling design and development, 5) Pilot production and testing, 6) Full-scale production with quality monitoring, 7) Packaging, logistics, and after-sales support. Each stage includes client collaboration, milestone reviews, and quality checkpoints to ensure perfect outcomes.',
    category: 'OEM Process',
    keywords: ['OEM manufacturing process', 'manufacturing workflow', 'DFM process', 'prototype to production process', 'OEM methodology', 'manufacturing stages']
  },
  {
    id: 'manufacturing-capabilities-technologies',
    question: 'What manufacturing technologies and capabilities does EMUSKI offer?',
    answer: 'EMUSKI offers comprehensive manufacturing technologies including: CNC Machining (3-axis to 5-axis, turning centers), Injection Molding (multi-cavity, overmolding, insert molding), Sheet Metal Fabrication (laser cutting, bending, welding), 3D Printing (FDM, SLA, SLS, metal printing), Assembly & Integration (automated and manual), Surface Finishing (anodizing, powder coating, plating), and Quality Testing (CMM, optical inspection, functional testing).',
    category: 'Manufacturing Capabilities',
    keywords: ['CNC machining services', 'injection molding capabilities', 'sheet metal fabrication', '3D printing technologies', 'assembly services', 'surface finishing options']
  },
  {
    id: 'custom-manufacturing-solutions',
    question: 'How does EMUSKI approach custom manufacturing projects?',
    answer: 'Our custom manufacturing approach is tailored to each client\'s unique needs: We begin with detailed technical discussions to understand specifications, conduct feasibility analysis and material selection, develop custom tooling and fixtures, create prototypes for validation, implement flexible production systems, establish quality protocols specific to the product, and provide ongoing optimization throughout the production lifecycle. This ensures perfect fit for your specific requirements.',
    category: 'Custom Solutions',
    keywords: ['custom manufacturing approach', 'bespoke manufacturing', 'tailored production solutions', 'flexible manufacturing systems', 'custom tooling design', 'product-specific manufacturing']
  },
  {
    id: 'rapid-prototyping-to-production',
    question: 'How quickly can EMUSKI move from prototype to production?',
    answer: 'EMUSKI accelerates time-to-market with our streamlined prototype-to-production process: Rapid prototyping (3-5 days), Design validation and testing (1-2 weeks), Tooling and setup (2-4 weeks depending on complexity), Pilot production run (1 week), Full production ramp-up (2-3 weeks). Our parallel processing approach and pre-validated supply chains enable industry-leading speed without compromising quality.',
    category: 'Speed to Market',
    keywords: ['rapid prototype to production', 'fast time to market', 'quick manufacturing setup', 'accelerated production', 'fast prototyping services', 'speed manufacturing']
  },
  {
    id: 'quality-assurance-manufacturing',
    question: 'What quality assurance measures ensure manufacturing excellence?',
    answer: 'EMUSKI implements comprehensive quality assurance at every stage: Incoming material inspection with certificates, real-time process monitoring with SPC, in-process dimensional checks with CMM, AI-powered defect detection, final inspection with detailed reports, packaging quality verification, and complete traceability documentation. Our ISO 9001:2015 certified QMS ensures consistent 99.5% quality acceptance rates.',
    category: 'Quality Assurance',
    keywords: ['quality assurance manufacturing', 'ISO 9001 quality system', 'SPC manufacturing', 'CMM inspection', 'AI quality control', 'manufacturing traceability']
  },
  {
    id: 'manufacturing-cost-reduction',
    question: 'How does EMUSKI achieve significant cost reductions in manufacturing?',
    answer: 'EMUSKI delivers 30-60% cost savings through strategic approaches: Value Analysis/Value Engineering (VA/VE) optimization, Design for Manufacturing (DFM) improvements, strategic material sourcing and substitutions, process automation and lean manufacturing, economies of scale through batch optimization, supply chain integration, and continuous improvement programs. Our cost engineering expertise maximizes value while maintaining quality standards.',
    category: 'Cost Engineering',
    keywords: ['manufacturing cost reduction', 'VAVE methodology', 'DFM cost savings', 'lean manufacturing costs', 'cost engineering', 'value engineering manufacturing']
  },
  {
    id: 'manufacturing-scalability-volume',
    question: 'How does EMUSKI handle different production volumes and scalability?',
    answer: 'EMUSKI offers flexible scalability from prototypes to high-volume production: Low-volume (10-1000 pieces) using flexible tooling and manual processes, Medium-volume (1000-50000 pieces) with dedicated tooling and semi-automation, High-volume (50000+ pieces) using automated lines and optimized tooling. Our scalable infrastructure and workforce flexibility ensure cost-effective production at any volume while maintaining consistent quality.',
    category: 'Production Scalability',
    keywords: ['manufacturing scalability', 'volume production', 'flexible manufacturing', 'high volume manufacturing', 'production capacity', 'scalable manufacturing systems']
  },
  {
    id: 'manufacturing-project-management',
    question: 'How does EMUSKI manage manufacturing projects and client communication?',
    answer: 'EMUSKI provides dedicated project management with clear communication protocols: Assigned project managers with engineering expertise, weekly progress reports with photos and data, real-time project tracking portals, milestone-based delivery schedules, 24/7 client support across time zones, regular quality updates and inspections, and transparent issue resolution processes. Our project management ensures on-time delivery with complete visibility.',
    category: 'Project Management',
    keywords: ['manufacturing project management', 'project tracking', 'client communication', 'progress reporting', 'manufacturing transparency', 'project delivery']
  }
];

// Industries page FAQs - Focus on healthcare, aerospace, defense applications
export const INDUSTRIES_FAQS: FAQItem[] = [
  {
    id: 'medical-device-manufacturing-bangalore',
    question: 'Does EMUSKI manufacture FDA-compliant medical devices in Bangalore?',
    answer: 'Yes, EMUSKI specializes in FDA-compliant medical device manufacturing with ISO 13485 medical device quality management system, cleanroom manufacturing capabilities, biocompatible material expertise, sterilization validation, comprehensive documentation, and regulatory compliance support for 510(k) submissions and CE marking.',
    category: 'Medical Devices',
    keywords: ['medical device manufacturing India', 'FDA compliant manufacturing', 'ISO 13485 certification', 'surgical instrument manufacturing', 'biocompatible materials', 'medical manufacturing Bangalore']
  },
  {
    id: 'aerospace-components-manufacturing',
    question: 'What aerospace components does EMUSKI manufacture?',
    answer: 'We manufacture critical aerospace components including aircraft structural parts, engine components, landing gear parts, avionics housings, satellite components, UAV parts, and defense systems. All components meet aerospace standards like AS9100, NADCAP certification, and material traceability requirements with zero-defect manufacturing.',
    category: 'Aerospace & Defense',
    keywords: ['aerospace manufacturing India', 'aircraft components manufacturing', 'satellite parts manufacturing', 'AS9100 certification', 'NADCAP aerospace', 'defense manufacturing']
  },
  {
    id: 'automotive-industry-manufacturing',
    question: 'What automotive components does EMUSKI manufacture for OEMs?',
    answer: 'We manufacture automotive components including engine parts, transmission components, brake system parts, suspension components, electrical housings, sensor brackets, and custom automotive accessories. We follow IATF 16949 automotive quality standard and work with global OEMs and Tier 1 suppliers.',
    category: 'Automotive',
    keywords: ['automotive manufacturing India', 'IATF 16949 certification', 'automotive OEM supplier', 'engine parts manufacturing', 'automotive components Bangalore']
  },
  {
    id: 'electronics-manufacturing-services',
    question: 'Does EMUSKI provide electronics Manufacturing Excellences?',
    answer: 'Yes, we provide electronics manufacturing including precision housings, heat sinks, electromagnetic shielding components, connector assemblies, PCB mounting hardware, and enclosures for consumer and industrial electronics. We support both prototyping and high-volume production with ESD-safe manufacturing.',
    category: 'Electronics',
    keywords: ['electronics manufacturing India', 'precision housings manufacturing', 'heat sink manufacturing', 'EMI shielding components', 'electronics enclosures']
  },
  {
    id: 'space-technology-manufacturing',
    question: 'Can EMUSKI manufacture components for space applications?',
    answer: 'EMUSKI manufactures space-qualified components including satellite structural parts, antenna components, solar panel brackets, thermal management systems, and payload housings. We follow space industry standards with extensive testing, material certification, and documentation for mission-critical applications.',
    category: 'Space Technology',
    keywords: ['space technology manufacturing', 'satellite components manufacturing', 'space qualified parts', 'ISRO supplier', 'space industry standards']
  },
  {
    id: 'defense-manufacturing-capabilities',
    question: 'What defense manufacturing capabilities does EMUSKI have?',
    answer: 'Our defense manufacturing includes weapon system components, communication equipment housings, radar components, vehicle parts, and specialized assemblies. We maintain security clearances, follow defense standards like MIL-STD specifications, and provide secure manufacturing with controlled access and documentation.',
    category: 'Defense',
    keywords: ['defense manufacturing India', 'military specifications', 'MIL-STD manufacturing', 'defense supplier India', 'weapon system components']
  }
];

// Precision Engineering page FAQs - Technical capability focused with engineering intent
export const PRECISION_ENGINEERING_FAQS: FAQItem[] = [
  {
    id: 'precision-cnc-machining-technologies',
    question: 'What advanced CNC machining technologies does EMUSKI use for precision engineering?',
    answer: 'EMUSKI utilizes state-of-the-art CNC technologies including 4-axis simultaneous machining centers, high-speed spindles (up to 24,000 RPM), multi-axis turning centers with live tooling, Swiss-type automatic lathes for complex geometries, and automated pallet systems for lights-out manufacturing. Our machines feature sub-micron positioning accuracy, thermal compensation, and real-time vibration monitoring for ultimate precision.',
    category: 'CNC Technologies',
    keywords: ['4-axis CNC machining', 'high-speed machining', 'Swiss machining', 'multi-axis turning', 'automated manufacturing', 'sub-micron precision']
  },
  {
    id: 'ultra-precision-tolerance-capabilities',
    question: 'What are EMUSKI\'s ultra-precision tolerance capabilities and measurement systems?',
    answer: 'EMUSKI achieves industry-leading precision tolerances: Micro-precision (±0.002mm), Ultra-precision (±0.005mm), High-precision (±0.005mm), and Standard precision (±0.05mm). Our metrology lab includes Coordinate Measuring Machines (CMM) with 0.001mm accuracy, optical comparators, surface roughness testers, hardness testers, and laser interferometry systems for dimensional verification and geometric analysis.',
    category: 'Precision Tolerances',
    keywords: ['ultra precision machining', 'micro tolerance manufacturing', 'CMM inspection', 'metrology lab', 'dimensional accuracy', 'geometric tolerance']
  },
  {
    id: 'cost-engineering-precision-optimization',
    question: 'How does EMUSKI\'s cost engineering optimize precision manufacturing costs?',
    answer: 'Our cost engineering approach for precision manufacturing includes: Design for Manufacturability (DFM) analysis to reduce machining complexity, material optimization and substitution studies, process route optimization to minimize operations, tooling standardization and lifecycle management, setup time reduction through work-holding optimization, and automation integration for lights-out production. This typically achieves 25-45% cost reductions while maintaining precision standards.',
    category: 'Cost Engineering',
    keywords: ['precision manufacturing cost engineering', 'DFM optimization', 'machining cost reduction', 'tooling optimization', 'automation cost savings', 'manufacturing efficiency']
  },
  {
    id: 'advanced-materials-precision-machining',
    question: 'What advanced materials can EMUSKI precision machine with tight tolerances?',
    answer: 'EMUSKI specializes in machining challenging materials including: Aerospace alloys (titanium Ti-6Al-4V, Inconel 718, Hastelloy), Medical-grade materials (316L stainless steel, biocompatible titanium, PEEK), High-performance plastics (PEEK, PEI, PTFE), Carbon fiber composites, Hardened steels (up to 65 HRC), and exotic alloys. Our material expertise includes optimized cutting parameters, specialized tooling, and thermal management for each material type.',
    category: 'Advanced Materials',
    keywords: ['titanium machining', 'Inconel machining', 'PEEK precision machining', 'hardened steel machining', 'carbon fiber machining', 'medical grade materials']
  },
  {
    id: 'precision-surface-finishing-technologies',
    question: 'What precision surface finishing and coating technologies does EMUSKI offer?',
    answer: 'EMUSKI provides comprehensive precision surface finishing including: Ultra-fine machined surfaces (Ra 0.05-0.4μm), Mirror polishing (Ra 0.01μm), Precision grinding and lapping, Hard anodizing (Type III), Precision electroplating, PVD/CVD coatings, Chemical etching and passivation, and Specialty coatings for aerospace and medical applications. All finishes include documented surface roughness verification and coating thickness measurements.',
    category: 'Surface Finishing',
    keywords: ['precision surface finishing', 'mirror polishing', 'hard anodizing', 'PVD coating', 'precision grinding', 'surface roughness control']
  },
  {
    id: 'smart-manufacturing-cost-engineering',
    question: 'How does EMUSKI integrate smart manufacturing in precision engineering?',
    answer: 'EMUSKI\'s smart precision manufacturing includes: Real-time process monitoring with IoT sensors, AI-powered predictive quality control, machine learning algorithms for tool wear prediction, automated in-process inspection with vision systems, digital twin technology for process optimization, and Industry 4.0 connectivity for remote monitoring. This integration ensures consistent precision while reducing cycle times and improving efficiency.',
    category: 'Smart Manufacturing',
    keywords: ['smart precision manufacturing', 'IoT manufacturing', 'AI quality control', 'predictive maintenance', 'digital twin manufacturing', 'Industry 4.0 precision']
  },
  {
    id: 'precision-tooling-fixture-design',
    question: 'What precision tooling and fixture design capabilities does EMUSKI have?',
    answer: 'EMUSKI designs and manufactures precision tooling including: Modular fixture systems for repeatability, Pneumatic and hydraulic workholding solutions, Custom cutting tools and tool holders, Precision measuring and inspection fixtures, Assembly and test fixtures, and Automation-ready tooling for robotic integration. Our tooling design ensures micron-level repeatability and optimizes cycle times while maintaining precision standards.',
    category: 'Precision Tooling',
    keywords: ['precision fixture design', 'custom cutting tools', 'modular fixturing', 'automation tooling', 'precision workholding', 'tool design engineering']
  },
  {
    id: 'cost-engineering-quality-systems',
    question: 'What quality systems ensure precision engineering excellence at EMUSKI?',
    answer: 'EMUSKI\'s precision quality systems include: ISO 9001:2015 certified quality management, Statistical Process Control (SPC) with real-time monitoring, First Article Inspection (FAI) protocols, Geometric Dimensioning & Tolerancing (GD&T) verification, Material traceability and certification, Environmental monitoring for temperature and humidity control, and Measurement Systems Analysis (MSA) for gauge repeatability and reproducibility.',
    category: 'Quality Systems',
    keywords: ['precision quality systems', 'SPC monitoring', 'first article inspection', 'GD&T verification', 'measurement systems analysis', 'precision quality control']
  }
];

// Contact page FAQs - Focus on communication, support, getting started
export const CONTACT_FAQS: FAQItem[] = [
  {
    id: 'how-to-contact-EMUSKI',
    question: 'How can I contact EMUSKI for manufacturing inquiries?',
    answer: 'You can contact EMUSKI through multiple channels: Phone +91-86670-88060, Email enquiries@emuski.com, visit our facility at 126, RNS Plaza, Electronic City Phase 2, Bangalore, or use our online contact form. We respond to inquiries within 24 hours with dedicated project managers for international clients.',
    category: 'Contact Information',
    keywords: ['contact EMUSKI', 'manufacturing inquiry', 'Bangalore manufacturing contact', 'international client support', 'project manager assignment']
  },
  {
    id: 'quote-request-process',
    question: 'What is the process for requesting a manufacturing quote?',
    answer: 'Our quote process: 1) Submit project details via our form or email, 2) Upload CAD files, drawings, or specifications, 3) Our engineers review requirements within 24 hours, 4) We provide detailed quotation with timeline and technical recommendations, 5) Schedule consultation call if needed. Most quotes are provided within 48 hours.',
    category: 'Quote Process',
    keywords: ['manufacturing quote request', 'RFQ process', 'CAD file submission', 'quotation timeline', 'technical consultation']
  },
  {
    id: 'international-client-support',
    question: 'What support does EMUSKI provide for international clients?',
    answer: 'We provide comprehensive international support: English-speaking project managers, timezone-flexible communication (US, UK, EU hours), video conferences, regular progress updates, export documentation, shipping coordination, customs clearance assistance, and compliance with international standards.',
    category: 'International Support',
    keywords: ['international client support', 'English communication', 'timezone flexibility', 'export assistance', 'global manufacturing partner']
  },
  {
    id: 'project-consultation-services',
    question: 'Does EMUSKI offer project consultation services?',
    answer: 'Yes, we provide comprehensive project consultation including feasibility analysis, design for manufacturing (DFM) review, material selection guidance, cost optimization recommendations, timeline planning, risk assessment, and technical documentation review. Initial consultations are complimentary for potential projects.',
    category: 'Consultation Services',
    keywords: ['project consultation', 'DFM consultation', 'feasibility analysis', 'manufacturing consultation', 'technical review services']
  },
  {
    id: 'communication-languages',
    question: 'What languages does EMUSKI support for communication?',
    answer: 'EMUSKI primarily operates in English for international business communication. Our technical team is proficient in English for documentation, specifications, and project discussions. We also support Hindi and Kannada for local interactions, ensuring clear communication throughout the project lifecycle.',
    category: 'Communication',
    keywords: ['English communication', 'international communication', 'technical documentation', 'multilingual support', 'project communication']
  },
  {
    id: 'facility-visits-tours',
    question: 'Can clients visit EMUSKI\'s manufacturing facility in Bangalore?',
    answer: 'Yes, we welcome client visits to our Bangalore facility. We offer guided facility tours, manufacturing process demonstrations, quality lab inspections, and meetings with engineering teams. Please schedule visits in advance. We also provide virtual facility tours via video conference for international clients.',
    category: 'Facility Visits',
    keywords: ['facility visit Bangalore', 'manufacturing facility tour', 'virtual facility tour', 'client meetings', 'facility inspection']
  }
];

// Page-specific FAQ mapping (removed separate FAQ page)
export const PAGE_FAQ_MAP = {
  '/': HOME_FAQS,
  '/manufacturing-services': MANUFACTURING_SERVICES_FAQS,
  '/industries': INDUSTRIES_FAQS,
  '/cost-engineering': PRECISION_ENGINEERING_FAQS,
  '/contact': CONTACT_FAQS
};

// Semantic intent matching for better AI understanding
export const SEMANTIC_INTENT_MAP = {
  // Company/Brand related intents
  'company': ['about', 'who is', 'what is', 'company profile', 'mission', 'values', 'leadership', 'team'],
  'services': ['manufacturing', 'capabilities', 'technologies', 'process', 'what do you do'],
  'quality': ['quality', 'certification', 'ISO', 'standards', 'inspection', 'testing'],
  'technical': ['precision', 'tolerance', 'CNC', 'machining', 'engineering', 'specifications'],
  'cost': ['cost', 'price', 'savings', 'optimization', 'value engineering', 'budget'],
  'location': ['where', 'address', 'bangalore', 'contact', 'location', 'facility']
};

// Enhanced FAQ retrieval with semantic matching
export const getFAQsForPage = (pathname: string, searchIntent?: string): FAQItem[] => {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  
  // Get page-specific FAQs
  let pageFAQs = PAGE_FAQ_MAP[normalizedPath as keyof typeof PAGE_FAQ_MAP] || HOME_FAQS;
  
  // If search intent is provided, filter by semantic matching
  if (searchIntent) {
    const intent = detectIntent(searchIntent);
    if (intent) {
      // Filter FAQs based on detected intent
      const filteredFAQs = pageFAQs.filter(faq => 
        faq.keywords.some(keyword => 
          SEMANTIC_INTENT_MAP[intent as keyof typeof SEMANTIC_INTENT_MAP]?.some(intentWord =>
            keyword.toLowerCase().includes(intentWord.toLowerCase()) ||
            faq.question.toLowerCase().includes(intentWord.toLowerCase())
          )
        )
      );
      return filteredFAQs.length > 0 ? filteredFAQs : pageFAQs;
    }
  }
  
  return pageFAQs;
};

// Intent detection for semantic matching
export const detectIntent = (query: string): string | null => {
  const lowerQuery = query.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(SEMANTIC_INTENT_MAP)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return intent;
    }
  }
  
  return null;
};

// Get page-specific title and description with voice/chat optimization
export const getFAQMetaForPage = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  
  const metaMap = {
    '/': {
      title: 'FAQ - Frequently Asked Questions',
      description: 'Learn about EMUSKI - leading manufacturing company in Bangalore with 15+ years expertise in precision engineering, AI-powered production and global manufacturing solutions.'
    },
    '/manufacturing-services': {
      title: 'Manufacturing FAQ - OEM Process & Services Questions',
      description: 'Discover EMUSKI\'s OEM manufacturing process, custom manufacturing capabilities, rapid prototyping services, and production scaling solutions in Bangalore.'
    },
    '/industries': {
      title: 'EMUSKI Industries FAQ - Healthcare, Aerospace & Defense Solutions',
      description: 'Explore EMUSKI\'s specialized manufacturing solutions for healthcare, aerospace, defense, automotive, and electronics industries with regulatory compliance.'
    },
    '/cost-engineering': {
      title: 'Engineering FAQ - Precision CNC & Machining Questions',
      description: 'Advanced precision engineering capabilities including VMC machining, ultra-tight tolerances, smart manufacturing, and cost engineering optimization.'
    },
    '/contact': {
      title: 'Contact FAQ - How to Get Started with Manufacturing',
      description: 'Contact EMUSKI manufacturing experts for project consultation, quotes, international support, and facility visits. 24/7 global client support available.'
    }
  };
  
  return metaMap[normalizedPath as keyof typeof metaMap] || metaMap['/'];
};

// Voice and conversational query optimization
export const VOICE_QUERY_PATTERNS = [
  // Question patterns for voice assistants
  { pattern: /what (is|does|are) EMUSKI/i, redirect: '/', intent: 'company' },
  { pattern: /who (is|are) EMUSKI/i, redirect: '/', intent: 'company' },
  { pattern: /tell me about EMUSKI/i, redirect: '/', intent: 'company' },
  { pattern: /(manufacturing|production) (services|capabilities)/i, redirect: '/manufacturing-services', intent: 'services' },
  { pattern: /(precision|CNC|machining) (engineering|capabilities)/i, redirect: '/cost-engineering', intent: 'technical' },
  { pattern: /(contact|reach|call) EMUSKI/i, redirect: '/contact', intent: 'location' },
  { pattern: /(cost|price|savings|budget)/i, intent: 'cost' },
  { pattern: /(quality|ISO|certification)/i, intent: 'quality' }
];

// Optimize for generative AI engines (ChatGPT, Bard, etc.)
export const getOptimizedFAQsForAI = (query: string, pathname: string) => {
  // Detect voice query patterns
  for (const pattern of VOICE_QUERY_PATTERNS) {
    if (pattern.pattern.test(query)) {
      const targetPath = pattern.redirect || pathname;
      return {
        faqs: getFAQsForPage(targetPath, pattern.intent),
        suggestedPage: targetPath,
        intent: pattern.intent,
        confidence: 0.9
      };
    }
  }
  
  // Fallback to regular semantic matching
  const intent = detectIntent(query);
  return {
    faqs: getFAQsForPage(pathname, query),
    suggestedPage: pathname,
    intent: intent,
    confidence: intent ? 0.7 : 0.5
  };
};