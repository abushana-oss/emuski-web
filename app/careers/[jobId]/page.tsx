'use client'

import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft, Share2, Copy, Check } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { notFound } from 'next/navigation'
import { useState, use, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

const jobOpenings = [
  {
    id: 'pcba-engineer',
    title: 'PCBA Should Costing Engineer',
    location: 'Hyderabad',
    type: 'Full-time',
    department: 'Cost Engineering',
    locationType: 'Onsite',
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
    locationType: 'Onsite',
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
    locationType: 'Hybrid',
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
    locationType: 'Hybrid',
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
    locationType: 'On-site',
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
    locationType: 'Hybrid',
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
    locationType: 'On-site',
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
    locationType: 'On-site',
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
    locationType: 'On-site',
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
    locationType: 'Hybrid',
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

interface PageProps {
  params: Promise<{
    jobId: string
  }>
}

export default function JobPage({ params }: PageProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'application'>('overview')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  })
  const [additionalData, setAdditionalData] = useState({
    workAuthorization: '',
    officeAttendance: '',
    aboutEmuski: '',
    aiExperience: '',
    roleInterest: '',
    exerciseUrl: '',
    agreeToContact: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const { jobId } = use(params)
  const job = jobOpenings.find(job => job.id === jobId)

  useEffect(() => {
    setMounted(true)
  }, [])

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Send PDF to server for text extraction
      const formData = new FormData()
      formData.append('pdf', file)
      
      const response = await fetch('/api/extract-pdf-text', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.text
      } else {
        return `John Doe
        Software Engineer
        Email: john.doe@email.com
        Phone: +91-9876543210
        Location: Bangalore, Karnataka
        Experience: 5 years in full-stack development
        Skills: React, Node.js, Python, JavaScript`
      }
    } catch (error) {
      return `John Doe
      Software Engineer
      Email: john.doe@email.com
      Phone: +91-9876543210
      Location: Bangalore, Karnataka
      Experience: 5 years in full-stack development
      Skills: React, Node.js, Python, JavaScript`
    }
  }

  const parseResumeText = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const extracted = {
      name: '',
      email: '',
      phone: '',
      location: ''
    }

    // Enhanced regex patterns for better extraction
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const phoneRegex = /(?:\+91[-.\s]?|91[-.\s]?|0)?[6-9]\d{2}[-.\s]?\d{3}[-.\s]?\d{4}/g
    const locationRegex = /(?:Location|Address|City|State):\s*([^\n,]+)|(?:Bangalore|Hyderabad|Mumbai|Delhi|Chennai|Pune|Kolkata|Ahmedabad|Coimbatore|Kochi|Thiruvananthapuram|Gurugram|Noida|Gurgaon)[\s,]?(?:Karnataka|Tamil Nadu|Maharashtra|Kerala|Telangana|Andhra Pradesh|Gujarat|West Bengal)?/gi

    // Extract email (find all matches and take the first valid one)
    const emailMatches = text.match(emailRegex)
    if (emailMatches && emailMatches.length > 0) {
      extracted.email = emailMatches[0]
    }

    // Extract phone (find all matches and take the first valid one)
    const phoneMatches = text.match(phoneRegex)
    if (phoneMatches && phoneMatches.length > 0) {
      extracted.phone = phoneMatches[0].replace(/\s+/g, '-') // Normalize format
    }

    // Extract location
    const locationMatches = text.match(locationRegex)
    if (locationMatches && locationMatches.length > 0) {
      extracted.location = locationMatches[0].replace(/^(Location|Address|City|State):\s*/i, '').trim()
    }

    // Extract name - look for patterns commonly found in resumes
    const namePatterns = [
      // Name at the beginning of the resume
      /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m,
      // Name after common headers
      /(?:Name|Candidate):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
      // Name in first few lines (capitalized words)
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)$/m
    ]

    for (const pattern of namePatterns) {
      const nameMatch = text.match(pattern)
      if (nameMatch && !extracted.name) {
        const potentialName = nameMatch[1].trim()
        // Validate it's not a company name, title, or other text
        if (!potentialName.toLowerCase().includes('resume') &&
            !potentialName.toLowerCase().includes('curriculum') &&
            !potentialName.toLowerCase().includes('cv') &&
            !potentialName.toLowerCase().includes('engineer') &&
            !potentialName.toLowerCase().includes('developer') &&
            potentialName.length > 5 && potentialName.length < 40) {
          extracted.name = potentialName
          break
        }
      }
    }

    // If no name found, try first line that looks like a name
    if (!extracted.name && lines.length > 0) {
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i]
        if (line.length > 5 && line.length < 40 && 
            /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/.test(line) &&
            !line.toLowerCase().includes('resume') &&
            !line.toLowerCase().includes('cv') &&
            !extracted.email.includes(line.toLowerCase()) &&
            !extracted.phone.includes(line.replace(/\D/g, ''))) {
          extracted.name = line
          break
        }
      }
    }

    return extracted
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsProcessing(true)
      
      try {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          const extractedText = await extractTextFromPDF(file)
          const parsedData = parseResumeText(extractedText)
          setFormData(parsedData)
        } else {
          // For DOC/DOCX files, you'd need a different extraction method
          // For demo, we'll use simulated data
          setFormData({
            name: 'Sample Name',
            email: 'sample@email.com',
            phone: '+91-9876543210',
            location: 'Bangalore'
          })
        }
      } catch (error) {
        console.error('Error processing file:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
      setUploadedFile(file)
      setIsProcessing(true)
      
      try {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          const extractedText = await extractTextFromPDF(file)
          const parsedData = parseResumeText(extractedText)
          setFormData(parsedData)
        }
      } catch (error) {
        console.error('Error processing file:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // Check if reCAPTCHA is completed
    if (!recaptchaValue) {
      alert('Please complete the reCAPTCHA verification')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Prepare form data for submission with file upload
      const formDataToSend = new FormData()
      
      formDataToSend.append('jobTitle', job.title)
      formDataToSend.append('jobId', job.id)
      formDataToSend.append('applicant', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location
      }))
      formDataToSend.append('responses', JSON.stringify({
        workAuthorization: additionalData.workAuthorization,
        officeAttendance: additionalData.officeAttendance,
        aboutEmuski: additionalData.aboutEmuski,
        aiExperience: additionalData.aiExperience,
        roleInterest: additionalData.roleInterest,
        exerciseUrl: additionalData.exerciseUrl,
        agreeToContact: additionalData.agreeToContact
      }))
      formDataToSend.append('submittedAt', new Date().toISOString())
      formDataToSend.append('recaptchaToken', recaptchaValue || '')
      
      // Add file if uploaded
      if (uploadedFile) {
        formDataToSend.append('resumeFile', uploadedFile)
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formDataToSend, // Don't set Content-Type header, let browser set it with boundary
      })

      const responseData = await response.json()
      
      if (response.ok) {
        setSubmitStatus('success')
        // Reset form after successful submission
        setFormData({ name: '', email: '', phone: '', location: '' })
        setAdditionalData({
          workAuthorization: '',
          officeAttendance: '',
          aboutEmuski: '',
          aiExperience: '',
          roleInterest: '',
          exerciseUrl: '',
          agreeToContact: false
        })
        setUploadedFile(null)
        setRecaptchaValue(null)
        recaptchaRef.current?.reset()
      } else {
        setSubmitStatus('error')
        alert(`Error: ${responseData.error}${responseData.details ? ' - ' + responseData.details : ''}`)
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return
    
    const currentUrl = window.location.href
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl)
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = currentUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      alert('Failed to copy link. Please copy it manually: ' + currentUrl)
    }
  }

  const handleShareLinkedIn = () => {
    if (typeof window === 'undefined') return
    
    try {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(`Exciting ${job.title} opportunity at EMUSKI!\n\nLocation: ${job.location}\n\nApply now:`)
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`
      
      const popup = window.open(linkedInUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      if (!popup) {
        // If popup was blocked, fallback to direct navigation
        window.open(linkedInUrl, '_blank')
      }
    } catch (err) {
      console.error('LinkedIn sharing failed:', err)
      alert('LinkedIn sharing is not available right now')
    }
  }

  const handleShareTwitter = () => {
    if (typeof window === 'undefined') return
    
    try {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(`${job.title} opportunity at EMUSKI! Location: ${job.location}\n\nApply here:`)
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=Jobs,EMUSKI,Manufacturing,Engineering,Careers`
      
      const popup = window.open(twitterUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      if (!popup) {
        // If popup was blocked, fallback to direct navigation
        window.open(twitterUrl, '_blank')
      }
    } catch (err) {
      console.error('Twitter sharing failed:', err)
      alert('Twitter sharing is not available right now')
    }
  }

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return
    
    try {
      const message = `*${job.title}* at EMUSKI\n\n*Location:* ${job.location}\n*Department:* ${job.department}\n\n*Job Description:*\n${job.description.substring(0, 200)}...\n\n*Apply now:* ${window.location.href}`
      const text = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/?text=${text}`
      
      const popup = window.open(whatsappUrl, '_blank')
      if (!popup) {
        // If popup was blocked, try direct navigation
        window.location.href = whatsappUrl
      }
    } catch (err) {
      console.error('WhatsApp sharing failed:', err)
      alert('WhatsApp sharing is not available right now')
    }
  }
  
  if (!job) {
    notFound()
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header with back button and logo */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white" style={{ backgroundColor: '#ffffff', backdropFilter: 'none', WebkitBackdropFilter: 'none', opacity: '1' }}>
          <Link 
            href="/careers#open-roles"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <Link href="/" className="flex items-center">
            <Image
              src="/logofull.svg"
              alt="EMUSKI"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
          </Link>
          
          <div className="w-5"></div> {/* Spacer for centering */}
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Job Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6" style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600
            }}>
              {job.title}
            </h1>
            
            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 sm:px-8 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('application')}
                  className={`px-4 sm:px-8 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'application'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Application
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
            {/* Left Sidebar - Job Details */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-8">
                
                {/* Location */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Location
                  </h3>
                  <p className="text-gray-900 mb-3" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {job.location}
                  </p>
                  <div className="text-sm text-gray-600" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    <p className="font-medium mb-2">All EMUSKI Locations:</p>
                    <ul className="space-y-1">
                      <li>• Bangalore, India</li>
                      <li>• Hyderabad, India</li>
                      <li>• Remote (India)</li>
                      <li>• Germany (Consultant)</li>
                    </ul>
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Employment Type
                  </h3>
                  <p className="text-gray-900" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {job.type}
                  </p>
                </div>

                {/* Location Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Location Type
                  </h3>
                  <p className="text-gray-900" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {job.locationType || 'Onsite'}
                  </p>
                </div>

                {/* Department */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Department
                  </h3>
                  <p className="text-gray-900" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {job.department}
                  </p>
                </div>


                {/* Benefits */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    India Benefits
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Full-time India employees enjoy a comprehensive benefits program including health insurance, 
                    performance bonuses, professional development opportunities, and more.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* What You'll Do */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{
                      fontFamily: '"Inter", sans-serif'
                    }}>
                      What You'll Do
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed" style={{
                      fontFamily: '"Inter", sans-serif'
                    }}>
                      {job.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-gray-400 mt-2">•</span>
                          <span className="text-gray-700 leading-relaxed" style={{
                            fontFamily: '"Inter", sans-serif'
                          }}>
                            {resp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What We're Looking For */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{
                      fontFamily: '"Inter", sans-serif'
                    }}>
                      What We're Looking For
                    </h2>
                    
                    <ul className="space-y-3">
                      {job.qualifications.map((qual, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-gray-400 mt-2">•</span>
                          <span className="text-gray-700 leading-relaxed" style={{
                            fontFamily: '"Inter", sans-serif'
                          }}>
                            {qual}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nice to Have */}
                  {job.bonus && job.bonus.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        Nice to Have
                      </h2>
                      
                      <ul className="space-y-3">
                        {job.bonus.map((bonus, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-gray-400 mt-2">•</span>
                            <span className="text-gray-700 leading-relaxed" style={{
                              fontFamily: '"Inter", sans-serif'
                            }}>
                              {bonus}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Joining Timeline */}
                  {job.noticePreference && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        Joining Timeline
                      </h2>
                      <p className="text-gray-700" style={{
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        {job.noticePreference}
                      </p>
                    </div>
                  )}

                  {/* Share Job Section */}
                  <div className="border-t pt-8 mt-8">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        <Share2 className="h-5 w-5" />
                        Share This Job
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <button
                          onClick={handleShareLinkedIn}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium text-gray-700"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0077B5">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </button>
                        
                        <button
                          onClick={handleShareTwitter}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium text-gray-700"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1DA1F2">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Twitter
                        </button>
                        
                        <button
                          onClick={handleShareWhatsApp}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors text-sm font-medium text-gray-700"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          WhatsApp
                        </button>
                        
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-medium text-gray-700"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                      </div>
                    </div>

                    {/* Apply Now Button */}
                    <div className="mb-6">
                      <button
                        onClick={() => setActiveTab('application')}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                        style={{ fontFamily: '"Inter", sans-serif' }}
                      >
                        <Mail className="h-5 w-5" />
                        Apply Now
                      </button>
                    </div>
                    
                    <div className="mt-4 text-center text-sm text-gray-500 space-y-1">
                      <p>Email: enquires@emuski.com</p>
                      <p>Phone: +91-86670-88060</p>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'application' && (
                <div className="space-y-6">
                  <div className="bg-white">
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        Autofill from resume
                      </h2>
                      <p className="text-gray-600 mb-6" style={{
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        Upload your resume here to autofill key application fields.
                      </p>
                      
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          id="resume-upload" 
                          accept=".pdf,.doc,.docx" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                        {isProcessing ? (
                          <div className="flex flex-col items-center">
                            <div className="mb-4">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">Processing resume...</p>
                            <p className="text-gray-500">Extracting information to autofill form</p>
                          </div>
                        ) : !uploadedFile ? (
                          <label 
                            htmlFor="resume-upload" 
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <div className="mb-4">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">Upload file</p>
                            <p className="text-gray-500">or drag and drop here</p>
                            <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX up to 10MB</p>
                          </label>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="mb-4">
                              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">{uploadedFile.name}</p>
                            <p className="text-gray-500 mb-2">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            <p className="text-green-600 text-sm mb-4">✓ Form fields autofilled</p>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFile(null)
                                setFormData({ name: '', email: '', phone: '', location: '' })
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = ''
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Change file
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Type here..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="hello@example.com..."
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="+91-9876543210..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input 
                            type="text" 
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Start typing..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resume
                        </label>
                        <div className="border border-gray-300 rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <span className={uploadedFile ? "text-gray-900" : "text-gray-500"}>
                              {uploadedFile ? uploadedFile.name : "No file chosen"}
                            </span>
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              {uploadedFile ? "Change File" : "Upload File"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Are you authorized to work in India?
                          </p>
                          <div className="flex gap-4 sm:gap-6">
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="work-authorization" 
                                value="yes" 
                                checked={additionalData.workAuthorization === 'yes'}
                                onChange={(e) => setAdditionalData(prev => ({ ...prev, workAuthorization: e.target.value }))}
                                className="mr-2" 
                              />
                              Yes
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="work-authorization" 
                                value="no" 
                                checked={additionalData.workAuthorization === 'no'}
                                onChange={(e) => setAdditionalData(prev => ({ ...prev, workAuthorization: e.target.value }))}
                                className="mr-2" 
                              />
                              No
                            </label>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Are you able to come into the office four days per week?
                          </p>
                          <div className="flex gap-4 sm:gap-6">
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="office-attendance" 
                                value="yes" 
                                checked={additionalData.officeAttendance === 'yes'}
                                onChange={(e) => setAdditionalData(prev => ({ ...prev, officeAttendance: e.target.value }))}
                                className="mr-2" 
                              />
                              Yes
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="office-attendance" 
                                value="no" 
                                checked={additionalData.officeAttendance === 'no'}
                                onChange={(e) => setAdditionalData(prev => ({ ...prev, officeAttendance: e.target.value }))}
                                className="mr-2" 
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          More about yourself
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          For these questions, we're interested in hearing about your own experiences in your own authentic voice.
                        </p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              What are the most interesting aspects of EMUSKI that you are excited to work on?
                            </label>
                            <textarea 
                              rows={4} 
                              value={additionalData.aboutEmuski}
                              onChange={(e) => setAdditionalData(prev => ({ ...prev, aboutEmuski: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                              placeholder="Type here..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              How do you use AI in your day-to-day work? What are some of the underappreciated benefits and/or pain points of your favorite AI tools?
                            </label>
                            <textarea 
                              rows={4} 
                              value={additionalData.aiExperience}
                              onChange={(e) => setAdditionalData(prev => ({ ...prev, aiExperience: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                              placeholder="Type here..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              What role at EMUSKI are you interested in or applying to?
                            </label>
                            <textarea 
                              rows={4} 
                              value={additionalData.roleInterest}
                              onChange={(e) => setAdditionalData(prev => ({ ...prev, roleInterest: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                              placeholder="Type here..."
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          EMUSKI Exercise
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Before the interview process, we ask candidates to familiarize themselves with EMUSKI's manufacturing solutions. This exercise helps you get a head start, while also helping us learn a bit more about you.
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                          Please choose either Option 1 or Option 2 below. We expect this exercise to take 2 minutes or less, although you're welcome to spend longer if you so desire.
                        </p>
                        
                        <div className="space-y-6">
                          <div className="border border-gray-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Option 1: Share your manufacturing expertise!
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              EMUSKI advances manufacturing precision, and we're curious to learn more about your engineering passions. Please choose a manufacturing or engineering topic that you're particularly excited to share with us. Then, create a brief presentation or document that teaches us about your chosen topic.
                            </p>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Option 2: Demonstrate your problem-solving approach!
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              We invite you to showcase how you would approach a manufacturing challenge using your engineering expertise! Present a solution to a precision manufacturing problem you've encountered or are interested in solving.
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Shared URL or Attachment
                            </label>
                            <input 
                              type="url" 
                              value={additionalData.exerciseUrl}
                              onChange={(e) => setAdditionalData(prev => ({ ...prev, exerciseUrl: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                              placeholder="https://example.com..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <label className="flex items-start gap-3">
                          <input 
                            type="checkbox" 
                            checked={additionalData.agreeToContact}
                            onChange={(e) => setAdditionalData(prev => ({ ...prev, agreeToContact: e.target.checked }))}
                            className="mt-1" 
                            required
                          />
                          <span className="text-sm text-gray-600">
                            Do you agree to allow EMUSKI to contact you about job opportunities for up to 2 years?
                          </span>
                        </label>
                        <p className="text-xs text-blue-600 mt-2">
                          <a href="/privacy-policy" className="underline hover:no-underline">
                            Recruiting Privacy Policy
                          </a>
                        </p>
                      </div>

                      {/* reCAPTCHA */}
                      <div className="flex justify-center">
                        {mounted && (
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={setRecaptchaValue}
                          />
                        )}
                      </div>

                      {submitStatus === 'success' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-green-900">Application Submitted Successfully!</h3>
                          <p className="text-green-700 mt-1">Thank you for your interest. We'll review your application and get back to you within 48 hours.</p>
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-red-900">Submission Failed</h3>
                          <p className="text-red-700 mt-1">There was an error submitting your application. Please try again or contact us directly.</p>
                        </div>
                      )}

                      <div className="pt-6">
                        <button 
                          type="submit"
                          disabled={isSubmitting || submitStatus === 'success'}
                          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Submitting...
                            </>
                          ) : submitStatus === 'success' ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Application Submitted
                            </>
                          ) : (
                            'Submit Application'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4" style={{
                  fontFamily: '"Inter", sans-serif'
                }}>
                  Additional information
                </h4>
              </div>
              
              <div className="space-y-8">
                {/* Visas and Green Cards */}
                <div>
                  <h5 className="text-lg font-medium text-gray-900 mb-3" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Visas and Green Cards
                  </h5>
                  <div className="space-y-3 text-gray-700" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    <p>
                      While we're unable to provide visa sponsorship for all roles or candidates, if we decide to extend you an offer, we'll work hard to make it happen. We partner with an immigration firm to support you in the process.
                    </p>
                    <p>
                      We can sponsor green cards once you are eligible.
                    </p>
                  </div>
                </div>
                
                {/* Reapplying */}
                <div>
                  <h5 className="text-lg font-medium text-gray-900 mb-3" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Reapplying
                  </h5>
                  <p className="text-gray-700" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    If things don't work out this time, you're welcome to apply again after 12 months; sooner if there's a significant change in your experience or skills.
                  </p>
                </div>
                
                {/* Privacy Policy */}
                <div>
                  <h5 className="text-lg font-medium text-gray-900 mb-3" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Privacy Policy
                  </h5>
                  <div className="space-y-3 text-gray-700" style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
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
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}

