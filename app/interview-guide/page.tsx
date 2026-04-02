import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Users, Target, Lightbulb, CheckCircle, FileText, Calendar, ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Interview Guide - EMUSKI Manufacturing',
  description: 'Learn about EMUSKI\'s interview process, our philosophy, timeline, and tips to help you succeed in your application.',
  keywords: ['interview guide', 'hiring process', 'EMUSKI careers', 'job application', 'manufacturing careers'],
  openGraph: {
    title: 'Interview Guide - EMUSKI Manufacturing',
    description: 'Learn about EMUSKI\'s interview process, our philosophy, timeline, and tips to help you succeed.',
    images: ['/assets/emuski-logo-optimized.webp'],
  },
}

export default function InterviewGuidePage() {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header with back button and logo */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white" style={{ backgroundColor: '#ffffff', backdropFilter: 'none', WebkitBackdropFilter: 'none', opacity: '1' }}>
          <Link 
            href="/careers"
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

        {/* Hero Section */}
        <section className="pt-12 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              EMUSKI Interview Guide
            </h1>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a 
                href="#philosophy" 
                className="inline-flex items-center px-6 py-3 bg-teal-50 hover:bg-teal-800 text-teal-700 hover:text-teal-100 rounded-full transition-all duration-200 border border-teal-200 hover:border-teal-800"
              >
                <span className="text-sm font-medium">Philosophy</span>
              </a>
              <a 
                href="#hiring-timeline" 
                className="inline-flex items-center px-6 py-3 bg-teal-50 hover:bg-teal-800 text-teal-700 hover:text-teal-100 rounded-full transition-all duration-200 border border-teal-200 hover:border-teal-800"
              >
                <span className="text-sm font-medium">Hiring Timeline</span>
              </a>
              <a 
                href="#application-tips" 
                className="inline-flex items-center px-6 py-3 bg-teal-50 hover:bg-teal-800 text-teal-700 hover:text-teal-100 rounded-full transition-all duration-200 border border-teal-200 hover:border-teal-800"
              >
                <span className="text-sm font-medium">Application Tips</span>
              </a>
            </div>
            <div className="w-full">
              <Image
                src="/assets/engineeringservices/engineering-service-value-analysis.svg"
                alt="Engineering Service Value Analysis"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          
          {/* Philosophy Section */}
          <section id="philosophy" className="mb-16">
            <div className="border-t border-gray-300 pt-12 mb-12">
              <h2 className="text-sm font-medium text-gray-600 tracking-wider uppercase mb-8">
                PHILOSOPHY
              </h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif text-gray-900 mb-6">Our Approach to Hiring</h3>
                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p>
                    At EMUSKI, we believe that exceptional manufacturing solutions come from exceptional people. Our interview process is designed to understand not just your technical skills, but how you think, solve problems, and collaborate with others.
                  </p>
                  <p>
                    We're looking for curious minds who are passionate about precision engineering, cost optimization, and pushing the boundaries of manufacturing technology. Whether you're a seasoned professional or early in your career, we value diverse perspectives and innovative thinking.
                  </p>
                  <p>
                    Our interviews are conversational rather than interrogational. We want you to succeed and show your best self, so we'll provide a supportive environment where you can demonstrate your abilities and learn about us too.
                  </p>
                </div>
              </div>

              <div className="bg-teal-50 p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-teal-600" />
                  <h4 className="text-lg font-semibold text-gray-900">What We Value</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Technical Excellence:</strong> Deep knowledge and continuous learning in your field</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Problem-Solving:</strong> Creative approaches to complex manufacturing challenges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Collaboration:</strong> Working effectively across teams and disciplines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Growth Mindset:</strong> Adaptability and eagerness to learn new technologies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Impact Orientation:</strong> Focus on delivering measurable results for our clients</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Hiring Timeline Section */}
          <section id="hiring-timeline" className="mb-16">
            <div className="border-t border-gray-300 pt-12 mb-12">
              <h2 className="text-sm font-medium text-gray-600 tracking-wider uppercase mb-8">
                HIRING TIMELINE
              </h2>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-2xl font-serif text-gray-900 mb-8">Our Interview Process</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Timeline Steps */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Application Review</h4>
                      <p className="text-gray-600 text-sm">We carefully review your application, resume, and any portfolio work you've shared.</p>
                      <p className="text-teal-600 text-xs font-medium mt-1">Timeline: 2-3 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Initial Screening</h4>
                      <p className="text-gray-600 text-sm">A brief phone or video call to discuss your background, interests, and the role.</p>
                      <p className="text-teal-600 text-xs font-medium mt-1">Timeline: 30 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Technical Interview</h4>
                      <p className="text-gray-600 text-sm">In-depth discussion of your technical skills, past projects, and problem-solving approach.</p>
                      <p className="text-teal-600 text-xs font-medium mt-1">Timeline: 60-90 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Team Interview</h4>
                      <p className="text-gray-600 text-sm">Meet with potential team members to assess cultural fit and collaboration style.</p>
                      <p className="text-teal-600 text-xs font-medium mt-1">Timeline: 45-60 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-700 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Final Decision</h4>
                      <p className="text-gray-600 text-sm">We'll make our decision and reach out with next steps within 2-3 business days.</p>
                      <p className="text-teal-700 text-xs font-medium mt-1">Timeline: 2-3 business days</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="space-y-6">
                  <div className="bg-teal-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="h-5 w-5 text-teal-600" />
                      <h4 className="font-semibold text-gray-900">Total Timeline</h4>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Our complete interview process typically takes 1-2 weeks from application to final decision.
                    </p>
                    <p className="text-sm text-gray-600">
                      We move quickly while ensuring thorough evaluation. If you need to adjust timing for any reason, just let us know!
                    </p>
                  </div>
                  
                  <div className="bg-teal-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-5 w-5 text-teal-600" />
                      <h4 className="font-semibold text-gray-900">Interview Format</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Most interviews conducted via video call</li>
                      <li>• On-site options available for local candidates</li>
                      <li>• Technical exercises done collaboratively</li>
                      <li>• Portfolio reviews for design/engineering roles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Application Tips Section */}
          <section id="application-tips" className="mb-16">
            <div className="border-t border-gray-300 pt-12 mb-12">
              <h2 className="text-sm font-medium text-gray-600 tracking-wider uppercase mb-8">
                APPLICATION TIPS
              </h2>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-2xl font-serif text-gray-900 mb-8">How to Stand Out</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Before You Apply */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Before You Apply
                  </h4>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Research EMUSKI:</strong> Understand our services, recent projects, and company values.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Tailor Your Resume:</strong> Highlight relevant manufacturing, engineering, or cost optimization experience.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Prepare Examples:</strong> Think of specific projects that demonstrate your problem-solving skills.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Complete the Exercise:</strong> If applicable, thoughtfully complete any pre-interview exercises.
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* During Interviews */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-teal-600" />
                    During Interviews
                  </h4>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Ask Questions:</strong> Show curiosity about the role, team, and technical challenges.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Be Specific:</strong> Use concrete examples and metrics when discussing your experience.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Think Aloud:</strong> Walk us through your thought process when solving technical problems.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Be Yourself:</strong> We want to understand how you naturally approach challenges and collaboration.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Common Questions */}
              <div className="bg-teal-50 p-8 rounded-2xl mt-12">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Questions You Might Encounter</h4>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Technical Questions</h5>
                    <ul className="space-y-2">
                      <li>• Walk me through a challenging project you've worked on</li>
                      <li>• How do you approach cost optimization in manufacturing?</li>
                      <li>• Describe your experience with CAD/CAM systems</li>
                      <li>• How do you ensure quality in precision manufacturing?</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Behavioral Questions</h5>
                    <ul className="space-y-2">
                      <li>• Tell me about a time you had to learn something new quickly</li>
                      <li>• How do you handle conflicting priorities or deadlines?</li>
                      <li>• Describe a situation where you improved a process</li>
                      <li>• How do you collaborate with remote team members?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Join Us Call to Action */}
        <section className="py-20 bg-teal-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
              Ready to Join Us?
            </h2>
            <p className="text-xl text-teal-50 mb-12 leading-relaxed max-w-2xl mx-auto">
              Browse our open positions and start your journey with EMUSKI today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/careers#open-roles" 
                className="inline-flex items-center px-8 py-4 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 transition-colors text-lg"
              >
                View Open Roles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/careers" 
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 rounded-full font-semibold hover:bg-teal-50 transition-colors text-lg"
              >
                Learn About Our Team
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}