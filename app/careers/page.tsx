import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, ArrowRight, Building, Users, Globe, Zap, ChevronDown, Mail, Phone, Target, Heart, Award, Lightbulb } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { OpenRoles } from '@/components/OpenRoles'
import { CareersHeroSection } from '@/components/CareersHeroSection'
import { AnimatedSection, AnimatedCard } from '@/components/AnimatedSection'
import { CountUpAnimation } from '@/components/CountUpAnimation'
import LocationsMap from '@/components/LocationsMap'
import { CareersNavigation } from '@/components/CareersNavigation'

export const metadata: Metadata = {
  title: 'Careers at EMUSKI - Engineering Jobs in Manufacturing & AI | EMUSKI',
  description: 'Join EMUSKI\'s global team of engineers and innovators. Open positions in AI, manufacturing, cost engineering, and software development across Bangalore, Hyderabad, and remote locations.',
  keywords: [
    'engineering jobs',
    'manufacturing careers',
    'AI engineer jobs',
    'cost engineering jobs',
    'software engineer jobs',
    'data scientist jobs',
    'Bangalore jobs',
    'Hyderabad jobs',
    'precision manufacturing',
    'EMUSKI careers',
    'remote engineering jobs',
    'manufacturing technology jobs'
  ],
  openGraph: {
    title: 'Careers at EMUSKI - Engineering Jobs in Manufacturing & AI',
    description: 'Join EMUSKI\'s global team of engineers and innovators. Open positions in AI, manufacturing, cost engineering, and software development.',
    url: 'https://careers.emuski.com',
    siteName: 'EMUSKI Careers',
    images: [
      {
        url: '/social-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'EMUSKI Careers - Engineering Jobs in Manufacturing & AI',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at EMUSKI - Engineering Jobs in Manufacturing & AI',
    description: 'Join EMUSKI\'s global team of engineers and innovators. Open positions in AI, manufacturing, cost engineering, and software development.',
    images: ['/social-banner.jpg'],
    creator: '@emuski_official',
    site: '@emuski_official',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://careers.emuski.com',
  },
  other: {
    'application-name': 'EMUSKI Careers',
  },
}

const jobOpenings = [
  {
    id: 'pcba-engineer',
    title: 'PCBA Should Costing Engineer',
    location: 'Hyderabad',
    type: 'Full-time',
    department: 'Cost Engineering',
    description: 'Are you passionate about cost optimization, electronics, and driving value in manufacturing? We\'re looking for an experienced PCBA Should Costing Engineer to join our team in Hyderabad!',
    responsibilities: [
      'Perform PCBA should-cost analysis, supplier negotiations, and teardown benchmarking',
      'Drive cost reduction strategies and manage component obsolescence',
      'Conduct spend analysis, part cost estimation, and support sourcing decisions',
      'Lead engineering change projects and interface directly with clients'
    ],
    qualifications: [
      'BE/BTech/ME/MTech in ECE, EEE, or E&I',
      '5+ years in PCBA manufacturing, costing, and engineering change management',
      'Strong experience with SMT, PTH, CAM, DFM, PFMEA, aPriori tool, etc.'
    ],
    bonus: [
      'Knowledge of GENESIS, INCAM, CAM350, AutoCAD',
      'Hands-on experience in product performance testing'
    ],
    urgent: false
  },
  {
    id: 'mechanical-engineer',
    title: 'Mechanical Should Costing Engineer',
    location: 'Hyderabad',
    type: 'Full-time',
    department: 'Cost Engineering',
    description: 'Are you a mechanical engineer with a sharp eye for cost, value, and manufacturing efficiency? Join our team in Hyderabad and play a key role in driving cost-effective design and smarter sourcing decisions!',
    responsibilities: [
      'Analyze cost for machined parts, plastics & sheet metal',
      'Evaluate supplier quotes and support cost negotiations',
      'Lead VA/VE initiatives and collaborate with design & sourcing teams'
    ],
    qualifications: [
      'BE/BTech/ME/MTech in Mechanical Engineering',
      '5+ years in cost engineering, manufacturing, or sourcing',
      'Strong in aPriori or DFMA or similar costing software'
    ],
    bonus: [],
    noticePreference: 'Immediate joiners or < 30 days preferred',
    urgent: false
  },
  {
    id: 'ai-security-engineer',
    title: 'AI Security Engineer',
    location: 'Bangalore; Hyderabad; Remote (India)',
    type: 'Full-time',
    department: 'Security',
    description: 'EMUSKI is seeking a hands-on AI Security Engineer to build and evolve the security systems that protect our manufacturing AI platforms. This role focuses on securing AI-driven manufacturing tools and developing security automation for our precision engineering systems.',
    responsibilities: [
      'Design, build, and maintain AI security systems for manufacturing platforms',
      'Implement security monitoring and threat detection for AI-driven manufacturing tools',
      'Develop security automation for CAD/CAM systems and engineering workflows',
      'Partner with engineering teams to secure manufacturing data pipelines and AI models',
      'Build security frameworks for industrial IoT and manufacturing automation systems',
      'Create incident response automation for manufacturing security events'
    ],
    qualifications: [
      '4+ years of experience in cybersecurity with focus on AI/ML systems',
      'Proficiency in Python, Go, or similar languages for security automation',
      'Experience with cloud security (AWS/Azure) and manufacturing system security',
      'Knowledge of AI/ML security, model protection, and data pipeline security',
      'Understanding of industrial security standards and manufacturing protocols'
    ],
    bonus: [
      'Experience with manufacturing system security (CAD/CAM, PLM, ERP)',
      'Knowledge of industrial IoT security and OT/IT convergence',
      'Background in precision manufacturing or engineering environments',
      'Experience with AI model security and adversarial attack prevention'
    ],
    urgent: false
  },
  {
    id: 'software-engineer-security',
    title: 'Software Engineer - Security',
    location: 'Bangalore; Hyderabad; Remote (India)',
    type: 'Full-time',
    department: 'Security',
    description: 'EMUSKI is seeking a hands-on Software Engineer to build and evolve the software, automations, and systems that power our security operations. This role focuses on engineering security tools and internal AI-driven agents that improve detection and response, vulnerability management, and the overall security posture of our products and infrastructure.',
    responsibilities: [
      'Design, build, and maintain software and automation that improves our detection and response program, including alert enrichment, triage workflows, and investigation tooling',
      'Implement and enhance internal AI agents and security bots that assist with monitoring, investigations, reporting, and other security operation tasks',
      'Develop and operate systems and workflows that support the bug bounty and vulnerability disclosure program, including intake, triage, prioritization, and remediation tracking',
      'Partner with product and engineering teams to threat model new features and systems, propose mitigations, and add guardrails into designs and implementations',
      'Contribute to secure-by-default libraries, services, and patterns that make it easy for teams to build secure features',
      'Integrate security signals from cloud, endpoints, SaaS, and applications into cohesive pipelines and data models that support detection and analysis',
      'Build automation to reduce manual work in incident response, containment, and remediation',
      'Collaborate with security engineers and other software engineers to review designs and code, and to continuously improve our security tooling and platforms'
    ],
    qualifications: [
      '4+ years of experience as a software engineer with significant time spent building security-related tools, platforms, or automations',
      'Proficiency in at least one major programming language (such as Python, Go, or TypeScript) and experience building production services, CLIs, or internal tools',
      'Experience integrating with security-relevant systems such as logging pipelines, SIEMs, EDR, cloud APIs, or identity platforms',
      'Practical experience with threat modeling, secure design, or application security reviews for services or features',
      'Familiarity with cloud infrastructure (AWS preferred) and modern SaaS environments',
      'Ability to work closely with cross-functional teams, own projects end-to-end, and ship pragmatic, high-impact improvements'
    ],
    bonus: [
      'Experience operating or contributing to bug bounty or vulnerability management programs',
      'Experience designing or improving AI-powered agents or automation used for security operations',
      'Knowledge of manufacturing system security and industrial environments',
      'Background in DevSecOps and security automation frameworks'
    ],
    urgent: false
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    location: 'Bangalore',
    type: 'Full-time',
    department: 'Data Science',
    description: 'EMUSKI is seeking a Data Scientist who brings AI-native approaches to manufacturing analytics. This role focuses on building AI systems that fundamentally change how manufacturing data science gets done - from precision engineering optimization to supply chain intelligence.',
    responsibilities: [
      'Build AI agents that conduct full manufacturing analyses autonomously - forming hypotheses, analyzing production data, and drafting optimization recommendations',
      'Make manufacturing data AI-readable through semantic layers and context infrastructure for CAD/CAM, quality control, and production systems',
      'Create self-healing data pipelines that detect and fix manufacturing data issues before they impact production',
      'Ship AI-powered experiment analysis for manufacturing process optimization and quality improvement initiatives',
      'Build predictive models for cost estimation, supply chain optimization, and production planning',
      'Accelerate AI-native manufacturing workflows by turning manual processes into scalable, automated systems',
      'Develop internal data products that engineering and manufacturing teams use daily for decision-making',
      'Own the full lifecycle from identifying manufacturing optimization opportunities to production deployment and monitoring'
    ],
    qualifications: [
      '6+ years in data science, analytics engineering, or manufacturing analytics',
      'Strong experience with manufacturing data: production metrics, quality control, supply chain, or cost engineering',
      'Deep SQL expertise and experience building data models for complex manufacturing systems',
      'Pipeline experience with dbt, data warehouses, and manufacturing data quality management',
      'Python proficiency for building production-ready data science tools and applications',
      'Experience with A/B testing and experimentation in manufacturing or engineering contexts',
      'Understanding of manufacturing processes, precision engineering, or industrial systems'
    ],
    bonus: [
      'Experience with CAD/CAM data analysis or engineering design optimization',
      'Background in manufacturing operations, quality control, or supply chain analytics',
      'Knowledge of precision manufacturing, cost engineering, or industrial IoT systems',
      'Experience building AI agents, RAG systems, or automated analysis workflows',
      'Familiarity with manufacturing execution systems (MES) or ERP data analysis',
      'Experience with Snowflake, dbt production models, or BI tools in manufacturing contexts'
    ],
    urgent: false
  },
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    location: 'Bangalore; Hyderabad; Remote (India)',
    type: 'Full-time',
    department: 'Engineering',
    description: 'EMUSKI is seeking a Full Stack Engineer to build and evolve our manufacturing platforms and customer-facing applications. This role focuses on creating scalable web applications that power our precision manufacturing services, cost engineering tools, and client collaboration systems.',
    responsibilities: [
      'Build and maintain full-stack applications for manufacturing project management and client collaboration',
      'Develop responsive web interfaces for CAD/CAM data visualization and engineering workflows',
      'Create APIs and backend services that integrate with manufacturing systems, ERP, and PLM platforms',
      'Build real-time dashboards for production monitoring, quality control, and cost tracking',
      'Implement secure file handling systems for CAD files, engineering drawings, and manufacturing documentation',
      'Develop automated workflows for quote generation, project tracking, and client communication',
      'Optimize application performance for handling large manufacturing datasets and complex calculations',
      'Collaborate with engineering teams to build internal tools that improve manufacturing efficiency'
    ],
    qualifications: [
      '4+ years of full-stack development experience with modern web technologies',
      'Proficiency in JavaScript/TypeScript, React/Next.js, and Node.js or similar backend frameworks',
      'Experience with databases (SQL/NoSQL) and building scalable APIs',
      'Knowledge of cloud platforms (AWS/Azure) and containerization (Docker)',
      'Understanding of software development best practices, testing, and CI/CD',
      'Experience with version control (Git) and agile development methodologies',
      'Strong problem-solving skills and ability to work in a fast-paced environment'
    ],
    bonus: [
      'Experience with manufacturing software, CAD/CAM systems, or engineering applications',
      'Knowledge of industrial data formats and manufacturing execution systems (MES)',
      'Background in B2B applications, client portals, or project management systems',
      'Experience with data visualization libraries and complex dashboard development',
      'Understanding of manufacturing processes, precision engineering, or supply chain systems',
      'Experience with Python, data processing, or machine learning integration'
    ],
    urgent: false
  },
  {
    id: 'ai-software-engineer-agents',
    title: 'AI Software Engineer - Agents',
    location: 'Bangalore; Hyderabad',
    type: 'Full-time',
    department: 'AI',
    description: 'EMUSKI is seeking an energetic AI Software Engineer to join our AI Agents team. You will build intelligent agentic experiences for manufacturing workflows, cost engineering automation, and precision manufacturing systems. Our vision is to empower manufacturing teams with AI agents that can faithfully execute complex engineering tasks and manufacturing processes.',
    responsibilities: [
      'Design AI agents to navigate manufacturing systems and perform valuable automation for engineering teams',
      'Train action and decision models that determine how to accomplish manufacturing objectives based on complex multimodal engineering data',
      'Develop AI agents for CAD/CAM automation, cost analysis, and quality control processes',
      'Build permission architectures and security frameworks for manufacturing AI agent capabilities',
      'Design optimal data representations for agents interacting with manufacturing environments and systems',
      'Integrate AI agents with ERP, PLM, and manufacturing execution systems',
      'Ensure high performance standards for both AI agent capabilities and manufacturing user experience',
      'Collaborate with engineering teams to integrate AI functionality into manufacturing products and workflows'
    ],
    qualifications: [
      'Strong foundational knowledge of the full AI product stack and manufacturing applications',
      'Proficiency in Python with experience in AI/ML frameworks (bonus: TypeScript, Go, Rust)',
      'Significant experience in context engineering and tool interfaces for frontier AI models',
      'Experience with post-training and reinforcement learning, particularly for manufacturing use cases',
      'Knowledge of manufacturing systems integration (ERP, PLM, CAD/CAM APIs)',
      'Strong product intuition for manufacturing workflows and engineering user experience',
      'Comfortable working in fast-moving manufacturing technology environment'
    ],
    bonus: [
      'Experience with manufacturing automation, robotics, or industrial AI systems',
      'Knowledge of precision manufacturing processes and cost engineering workflows',
      'Background in CAD/CAM automation or engineering design systems',
      'Experience with browser technologies for manufacturing web applications',
      'Understanding of industrial IoT and manufacturing data pipelines',
      'Experience with multimodal AI models for engineering and manufacturing data'
    ],
    urgent: false
  },
  {
    id: 'ai-engineer-applied-ml',
    title: 'AI Engineer, Applied ML',
    location: 'Bangalore; Hyderabad',
    type: 'Full-time',
    department: 'AI',
    description: 'EMUSKI is looking for an Applied ML Engineer to design, build, and iterate on cutting-edge AI models powering our manufacturing systems. As an expert in machine learning and artificial intelligence, you will develop scalable and impactful solutions for manufacturing optimization, cost prediction, and quality control - serving precision manufacturing needs across the globe.',
    responsibilities: [
      'Apply state-of-the-art ML and LLM techniques to solve manufacturing problems spanning cost optimization, quality prediction, and process automation',
      'Build personalization systems for manufacturing recommendations, process optimization, and supplier matching',
      'Develop query understanding systems for manufacturing search, part discovery, and engineering intent modeling',
      'Create content discovery systems for manufacturing knowledge bases, technical documentation, and design recommendations',
      'Rigorously evaluate ML models with both offline and online techniques, designing manufacturing-specific experiments and quality metrics',
      'Own the entire model lifecycle from research to production: manufacturing data analysis, modeling, evaluation, A/B testing, and iterative improvement',
      'Collaborate with manufacturing engineers, PMs, data scientists, and designers to ensure AI drives meaningful manufacturing improvements',
      'Stay at the forefront of ML/AI innovation for manufacturing by evaluating and incorporating emerging research into production systems'
    ],
    qualifications: [
      '5+ years experience building and shipping robust ML/AI models for large-scale, manufacturing or industrial products',
      'Deep expertise in deep learning (PyTorch, TensorFlow, JAX), LLMs, information retrieval, and recommendation systems for technical/manufacturing domains',
      'Strong software engineering skills with Python and production-quality codebases for manufacturing environments',
      'In-depth experience with the full ML lifecycle: manufacturing data analysis, feature engineering, model development, evaluation, and monitoring',
      'Experience with manufacturing data: CAD/CAM, quality control, production metrics, or supply chain optimization',
      'Proven collaborator in cross-functional manufacturing and engineering teams',
      'BS, MS, or PhD in Computer Science, Engineering, or related technical field'
    ],
    bonus: [
      'Experience with manufacturing ML applications: predictive maintenance, quality control, or process optimization',
      'Knowledge of precision manufacturing, cost engineering, or industrial automation systems',
      'Background in large-scale manufacturing data processing and real-time manufacturing systems',
      'Experience with manufacturing personalization: supplier recommendations, part matching, or process optimization',
      'Open-source or published contributions in manufacturing ML, industrial AI, or engineering optimization',
      'Understanding of CAD/CAM systems, PLM platforms, or manufacturing execution systems'
    ],
    urgent: false
  },
  {
    id: 'frontend-engineer-design-systems',
    title: 'Frontend Engineer - Design Systems',
    location: 'Bangalore',
    type: 'Full-time',
    department: 'Product Engineering',
    description: 'EMUSKI is seeking an experienced Frontend-focused Engineer to help revolutionize the way manufacturing teams interact with precision engineering platforms. In this role, you\'ll be developing the future of manufacturing AI products and design systems.',
    responsibilities: [
      'Work with the design systems team to build excellent user interaction layers for all manufacturing features, including CAD/CAM interfaces and cost analysis tools',
      'Build and improve components that form the building blocks of EMUSKI\'s manufacturing frontend systems',
      'Always be thinking about how to improve interaction quality, fit & finish, and engineering team velocity',
      'Develop reusable components for manufacturing dashboards, production monitoring, and quality control interfaces',
      'Create primitive pieces of generative UI for manufacturing workflows and automated engineering processes',
      'Build accessible experiences for complex manufacturing data visualization and engineering documentation',
      'Ensure design consistency across manufacturing project management and client collaboration platforms'
    ],
    qualifications: [
      'Experience building and maintaining user interface systems for manufacturing or technical applications at scale',
      'Strong coding fundamentals with React, TypeScript, and modern CSS frameworks',
      'Ability to build foundational components that engineering teams can build manufacturing features on top of',
      'Experience with highly interactive React applications using strongly typed code for technical domains',
      'Knowledge of design and UI patterns for complex data visualization and engineering workflows',
      'Passion for prototyping, experimentation, and creating accessible experiences for technical users',
      '4+ years of industry experience with frontend development'
    ],
    bonus: [
      'Experience with manufacturing software interfaces, CAD/CAM systems, or engineering applications',
      'Knowledge of data visualization libraries for manufacturing metrics and quality control dashboards',
      'Understanding of manufacturing workflows, precision engineering, or technical documentation systems',
      'Experience with design systems for B2B or enterprise manufacturing applications',
      'Background in building interfaces for complex technical data or engineering systems'
    ],
    urgent: false
  },
  {
    id: 'backend-software-engineer',
    title: 'Backend Software Engineer',
    location: 'Bangalore; Hyderabad',
    type: 'Full-time',
    department: 'Platform & Infrastructure',
    description: 'EMUSKI is looking for an experienced Backend Engineer to join our team revolutionizing precision manufacturing systems. You will be responsible for leading design, implementation, and scaling of backend systems that power manufacturing platforms, cost engineering tools, and client collaboration systems.',
    responsibilities: [
      'Build scalable systems that ingest and process manufacturing data from CAD/CAM systems, production lines, and quality control sensors',
      'Optimize interfaces that interact with manufacturing databases, ERP systems, and real-time production data',
      'Collaborate with PMs, frontend engineers, and manufacturing teams to understand precision engineering requirements',
      'Work closely with AI, Data Science, and Manufacturing Engineering teams to iterate on manufacturing optimization systems',
      'Manage complex orchestration systems for manufacturing workflows with many integrated systems and interfaces',
      'Scale, optimize, and load balance multiple manufacturing services with rapidly changing production needs',
      'Build APIs for manufacturing project management, cost analysis, and client collaboration platforms',
      'Ensure high availability and performance for mission-critical manufacturing systems'
    ],
    qualifications: [
      'Strong experience with Python and modern backend frameworks for manufacturing or industrial applications',
      'Strong experience with databases, caching, and real-time data processing for manufacturing systems',
      'Experience with AWS cloud infrastructure at scale for manufacturing or industrial workloads',
      'Experience working with high-scale manufacturing data and complex engineering systems',
      'Knowledge of manufacturing system integration: ERP, PLM, CAD/CAM, or quality control systems',
      '4+ years of backend engineering experience with technical or manufacturing applications',
      'Understanding of manufacturing workflows, precision engineering, or supply chain systems'
    ],
    bonus: [
      'Experience with manufacturing execution systems (MES), ERP integration, or industrial IoT platforms',
      'Knowledge of precision manufacturing processes, quality control systems, or cost engineering workflows',
      'Background in real-time manufacturing data processing and production monitoring systems',
      'Experience with manufacturing APIs, CAD/CAM system integration, or engineering workflow automation',
      'Understanding of manufacturing security requirements and industrial system reliability standards'
    ],
    urgent: false
  }
]

const benefits = [
  {
    title: "Deep Technical Experience",
    description: "Work with advanced engineering methodologies and cutting-edge technical processes that enhance your expertise and professional growth."
  },
  {
    title: "Collaborative Culture",
    description: "Work alongside world-class engineers in a supportive environment that encourages knowledge sharing."
  },
  {
    title: "Global Impact",
    description: "Contribute to projects that serve Fortune 500 companies and shape the future of manufacturing worldwide."
  },
  {
    title: "Cutting-edge Technology",
    description: "Work with AI-powered solutions and next-generation manufacturing technologies at the forefront of innovation."
  },
  {
    title: "Career Growth",
    description: "Continuous learning opportunities with clear career advancement paths and skill development programs."
  },
  {
    title: "Innovation Driven",
    description: "Be part of breakthrough innovations in cost engineering and precision manufacturing solutions."
  }
]

const values = [
  {
    title: "Excellence",
    description: "We pursue perfection in every aspect of our work, from precision manufacturing to cost optimization.",
    metric: "99.8% Quality Rate"
  },
  {
    title: "Innovation",
    description: "We embrace cutting-edge technology and creative solutions to revolutionize manufacturing.",
    metric: "4000+ Unique Components"
  },
  {
    title: "Collaboration",
    description: "We believe in the power of teamwork and cross-functional partnerships for success.",
    metric: "100+ Global Partners"
  },
  {
    title: "Global Impact",
    description: "We create solutions that make a meaningful difference in manufacturing worldwide.",
    metric: "35% Cost Savings"
  }
]

export default function CareersPage() {
  // Structured data for Job Postings
  const jobPostingStructuredData = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "itemListElement": jobOpenings.map((job, index) => ({
      "@type": "JobPosting",
      "position": index + 1,
      "title": job.title,
      "description": job.description,
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "EMUSKI",
        "sameAs": "https://www.emuski.com",
        "logo": "https://www.emuski.com/assets/emuski-logo-optimized.webp"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location,
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": 600000,
          "maxValue": 2500000,
          "unitText": "YEAR"
        }
      },
      "datePosted": "2026-04-01",
      "validThrough": "2026-06-01"
    }))
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EMUSKI",
    "url": "https://www.emuski.com",
    "logo": "https://www.emuski.com/assets/emuski-logo-optimized.webp",
    "description": "Leading precision manufacturing and cost engineering company specializing in AI-driven manufacturing solutions",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "RNS Plaza, Electronic City",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560100",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-80-4096-5000",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.linkedin.com/company/emuski",
      "https://twitter.com/emuski_official"
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData)
        }}
      />

      <div className="min-h-screen bg-background scroll-smooth" style={{ scrollPaddingTop: '120px' }}>
        {/* Perplexity-style Navigation with Dropdowns */}
        <CareersNavigation />

        {/* Animated 3D Hero Section */}
        <CareersHeroSection />

        {/* Mission Section */}
        <AnimatedSection animationType="fadeInUp" delay={200}>
          <section id="mission" className="py-12 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-background to-muted/30">
            <div className="max-w-7xl mx-auto">
              {/* Mission Header */}
              <AnimatedSection animationType="fadeInUp" delay={100}>
                <div className="text-center mb-10">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-12">
                    Our <span className="text-emuski-teal">Mission</span>
                  </h2>
                </div>
              </AnimatedSection>

              {/* Main Mission Content - Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-10">

                {/* Left Side - Mission Statement */}
                <AnimatedSection animationType="fadeInLeft" delay={200}>
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-emuski-teal/10 via-emuski-teal/5 to-emuski-teal/10 rounded-2xl p-8">
                      <h3 className="text-3xl lg:text-4xl font-bold text-emuski-teal mb-4">
                        "Striving for Value-Driven Empowerment"
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        We empower manufacturing leaders to unlock extraordinary value through intelligent cost engineering,
                        precision manufacturing excellence, and transformative digital solutions that drive sustainable growth
                        and competitive advantage.
                      </p>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Right Side - Mission Image Collage */}
                <AnimatedSection animationType="fadeInRight" delay={300}>
                  <div className="relative">
                    {/* College Style Layout - Group Photo as Full Width Top */}
                    <div className="space-y-3">

                      {/* Group Photo - Full Width Top */}
                      <div className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-r from-emuski-teal/5 to-transparent">
                        <img
                          src="/assets/mission/groupphoto.jpeg"
                          alt="EMUSKI Team"
                          className="w-full h-64 object-cover"
                        />
                      </div>

                      {/* Bottom Row - Four Small Images */}
                      <div className="grid grid-cols-4 gap-3">
                        {/* Client Image */}
                        <div className="relative rounded-lg overflow-hidden shadow-md h-24 bg-white">
                          <img
                            src="/assets/mission/client.jpeg"
                            alt="Client Meeting"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Google Meet */}
                        <div className="relative rounded-lg overflow-hidden shadow-md h-24 bg-white">
                          <img
                            src="/assets/mission/googlemeet.jpeg"
                            alt="Google Meet Session"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Office Space */}
                        <div className="relative rounded-lg overflow-hidden shadow-md h-24 bg-white opacity-90">
                          <img
                            src="/assets/mission/officepalce.jpeg"
                            alt="Office Space"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Meeting Room */}
                        <div className="relative rounded-lg overflow-hidden shadow-md h-24 bg-white opacity-90">
                          <img
                            src="/assets/mission/meeting room.jpeg"
                            alt="Meeting Room"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-emuski-teal/10 rounded-full blur-lg"></div>
                    <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-emuski-teal/5 rounded-full blur-xl"></div>
                  </div>
                </AnimatedSection>

              </div>


              <AnimatedSection animationType="fadeInUp" delay={500}>
                <div className="text-center">
                  <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-emuski-teal/5 to-transparent rounded-2xl border border-emuski-teal/20">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">Join us in our mission</span> to revolutionize manufacturing through
                      intelligent engineering, where every project becomes an opportunity to create lasting impact,
                      drive innovation, and build a more efficient, sustainable future for global manufacturing.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </AnimatedSection>

        {/* Values Section */}
        <AnimatedSection animationType="fadeInUp" delay={200}>
          <section id="values" className="py-12 px-6 sm:px-8 lg:px-12 border-t border-border bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <AnimatedSection animationType="fadeInUp" delay={100}>
                <div className="text-center mb-10 space-y-6">
                  <h2 className="text-4xl lg:text-5xl font-bold">
                    Our Core <span className="text-emuski-teal">Values</span>
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    The principles that guide our work and define our commitment to excellence in manufacturing.
                  </p>
                </div>
              </AnimatedSection>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {values.map((value, index) => (
                  <AnimatedSection key={index} animationType="scaleIn" delay={index * 100}>
                    <AnimatedCard className="p-6 border-0 bg-white/60 backdrop-blur-sm rounded-xl h-full">
                      <CardContent className="p-0 space-y-4 flex flex-col h-full">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-emuski-teal">{value.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{value.description}</p>
                        <div className="pt-2 border-t border-border/50 mt-auto">
                          <span className="text-sm font-bold text-emuski-teal">{value.metric}</span>
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  </AnimatedSection>
                ))}
              </div>

              {/* Company Stats */}
              <AnimatedSection animationType="slideInUp" delay={400}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-border/50">
                  {[
                    { number: 500, suffix: '+', label: 'Global Projects' },
                    { number: 15, suffix: '+', label: 'Years Experience' },
                    { number: 100, suffix: '+', label: 'Fortune 500 Clients' },
                    { number: 35, suffix: '%', label: 'Cost Reduction' }
                  ].map((stat, index) => (
                    <AnimatedSection key={index} animationType="fadeInUp" delay={index * 150}>
                      <div className="text-center space-y-2">
                        <CountUpAnimation
                          end={stat.number}
                          suffix={stat.suffix}
                          duration={2500 + index * 200}
                          className="text-4xl lg:text-5xl font-bold text-emuski-teal"
                        />
                        <div className="text-muted-foreground font-medium">{stat.label}</div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </section>
        </AnimatedSection>


        {/* Benefits Section */}
        <AnimatedSection animationType="fadeInUp" delay={300}>
          <section id="benefits" className="py-12 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <AnimatedSection animationType="fadeInUp" delay={100}>
                <div className="text-center mb-10 space-y-6">
                  <h2 className="text-4xl lg:text-5xl font-bold">
                    Why choose <span className="text-black">EMUSKI</span>?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    We offer an exceptional work environment where innovation meets excellence, and your career can truly flourish.
                  </p>
                </div>
              </AnimatedSection>

              <div className="grid lg:grid-cols-2 gap-12 items-start">

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <AnimatedSection key={index} animationType="rotateIn" delay={index * 150}>
                      <div className="group p-6 border border-border/50 bg-background/50 backdrop-blur-sm rounded-xl">
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-emuski-teal">
                            {benefit.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>

                {/* Media Gallery - Equal Size */}
                <AnimatedSection animationType="fadeInLeft" delay={300}>
                  <div className="lg:sticky lg:top-8">
                    <div className="space-y-6">

                      {/* Precision Animation Video - Full Width */}
                      <div className="relative rounded-xl overflow-hidden shadow-2xl">
                        <video
                          className="w-full h-full object-cover pointer-events-none"
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls={false}
                          disablePictureInPicture
                          style={{
                            minHeight: '280px',
                            maxHeight: '350px'
                          }}
                        >
                          <source src="/assets/animation/prcision-animation.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>

                      {/* Image Grid - Full Width */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Social Banner Image */}
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                          <img
                            src="/social-banner.jpg"
                            alt="EMUSKI Manufacturing"
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* New Image */}
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                          <img
                            src="/image.png"
                            alt="EMUSKI Technology"
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-emuski-teal/10 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emuski-teal/5 rounded-full blur-2xl"></div>
                    </div>
                  </div>
                </AnimatedSection>

              </div>


            </div>
          </section>
        </AnimatedSection>

        {/* Locations Section */}
        <section id="locations" className="py-12 px-6 sm:px-8 lg:px-12 bg-muted/20">
          <div className="max-w-7xl mx-auto">

            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* Left Side - Interactive Globe */}
              <div className="relative flex justify-center lg:justify-start w-full h-[350px] sm:h-[400px] md:h-[520px] order-2 lg:order-1 mt-0">
                <LocationsMap />
              </div>

              {/* Right Side - Content */}
              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-6">
                  <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                    We're building<br />
                    the future from everywhere.
                  </h2>

                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      Our home base is <span className="font-medium text-emuski-teal">Bangalore</span>, but EMUSKI is truly global.
                      You'll find our teams collaborating across <span className="font-medium text-emuski-teal">Electronic City</span>,
                      <span className="font-medium text-emuski-teal"> Hyderabad</span>, <span className="font-medium text-emuski-teal"> Hosur</span>, 
                      <span className="font-medium text-emuski-teal">Germany</span>, and the <span className="font-medium text-emuski-teal">USA</span>, 
                      serving clients worldwide across <span className="font-medium text-emuski-teal"> Europe</span>, 
                      <span className="font-medium text-emuski-teal">North America</span>, and beyond.
                    </p>

                    <p>
                      We believe the best work happens when brilliant minds come together, so our
                      in-person team members collaborate closely—creating, innovating, and pushing
                      manufacturing boundaries side by side.
                    </p>

                    <p>
                      Not sure which location works for you? No worries! Just apply to the role
                      that matches your expertise and we'll figure out the rest together.
                    </p>
                  </div>
                </div>



              </div>

            </div>
          </div>
        </section>

        {/* Hiring Process Section */}
        <section id="hiring-process" className="py-10 px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-6">
                HIRING PROCESS
              </h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Content */}
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
                  What to know when applying to EMUSKI.
                </h2>
                
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    We value hands-on contribution, diverse skill sets, and merit-based evaluation. 
                    Our interview process reflects these principles, prioritizing speed and 
                    transparency throughout your candidacy experience.
                  </p>
                  
                  <p>
                    Discover how our streamlined application and interview process works, get 
                    preparation advice, and find role-specific tips in our comprehensive Interview Guide.
                  </p>
                </div>
                
                <div className="pt-4">
                  <a 
                    href="/interview-guide" 
                    className="inline-flex items-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Interview Guide
                  </a>
                </div>
              </div>
              
              {/* Right Column - Process Steps */}
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-teal-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Application</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Submit your application and we'll review it carefully. If you're a potential fit, 
                      we'll reach out within two weeks to discuss next steps.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-teal-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Process</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Connect with our engineering team and leadership through structured interviews. 
                      Technical roles include hands-on assessments to evaluate your skills. 
                      <a href="/interview-guide" className="text-teal-600 hover:text-teal-700 underline ml-1">View our Interview Guide</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-teal-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Decision & Offer</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Receive feedback within one week of your final interview. If you're selected, 
                      we'll present a comprehensive offer package and support your transition to EMUSKI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Roles Section */}
        <OpenRoles jobOpenings={jobOpenings} />
        
        {/* Additional Information Section */}
        <section className="py-10 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section Header */}
            <div className="border-t border-gray-300 pt-8 mb-10">
              <h2 className="text-sm font-medium text-gray-600 tracking-wider uppercase mb-8">
                ADDITIONAL INFORMATION
              </h2>
              
              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Left Column */}
                <div>
                  <h3 className="text-2xl font-serif text-gray-900 mb-6">Visas and Green Cards</h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      While we're unable to provide visa sponsorship for all roles or candidates, if we decide to extend you an offer, we'll work hard to make it happen. We partner with an immigration firm to support you in the process.
                    </p>
                    <p>
                      We can sponsor green cards once you are eligible.
                    </p>
                  </div>
                </div>
                
                {/* Right Column */}
                <div>
                  <h3 className="text-2xl font-serif text-gray-900 mb-6">Reapplying</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If things don't work out this time, you're welcome to apply again after 12 months; sooner if there's a significant change in your experience or skills.
                  </p>
                </div>
              </div>
              
              {/* Privacy Policy Section */}
              <div className="mt-10">
                <h3 className="text-2xl font-serif text-gray-900 mb-6">Privacy Policy</h3>
                <div className="space-y-4 text-gray-700 leading-relaxed max-w-3xl">
                  <p>
                    We use applicant details in our legitimate interests to process your application for employment and to evaluate your candidacy. For Singapore, we use this information for evaluative purposes and for the purposes of entering into an employment relationship with you.
                  </p>
                  <p>
                    <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                      Complete privacy policy
                    </a>
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </section>
        
        {/* Join Us Call to Action Section */}
        <section className="py-12 bg-teal-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Join Us
            </h2>
            <p className="text-xl text-teal-50 mb-8 leading-relaxed max-w-2xl mx-auto">
              Ready to shape the future of manufacturing? Explore our open positions and become part of our innovative team.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="#open-roles" 
                className="inline-flex items-center px-8 py-4 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 transition-colors text-lg"
              >
                Open Roles
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="/interview-guide" 
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 rounded-full font-semibold hover:bg-teal-50 transition-colors text-lg"
              >
                Interview Guide
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </>
  )
}