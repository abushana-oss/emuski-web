'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

interface JobOpening {
  id: string
  title: string
  location: string
  type: string
  department: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  bonus: string[]
  noticePreference?: string
  urgent: boolean
}

interface OpenRolesProps {
  jobOpenings: JobOpening[]
}

export function OpenRoles({ jobOpenings }: OpenRolesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())

  const toggleCategory = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleJobDetails = (jobId: string) => {
    const newExpandedJobs = new Set(expandedJobs)
    if (newExpandedJobs.has(jobId)) {
      newExpandedJobs.delete(jobId)
    } else {
      newExpandedJobs.add(jobId)
    }
    setExpandedJobs(newExpandedJobs)
  }

  return (
    <section id="open-roles" className="py-24 px-6 sm:px-8 lg:px-12" style={{backgroundColor: '#F4F3EA'}}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="font-black text-center tracking-tight leading-none capitalize" style={{
            fontFamily: '"GT Canon VF Variable L Black", sans-serif',
            fontWeight: 900,
            fontSize: '112px',
            lineHeight: '95%',
            color: '#0A2F34',
            textTransform: 'capitalize'
          }}>
            open roles
          </h1>
        </div>

        {/* Engineering Category Section */}
        <div className="border border-stone-300 rounded-lg" style={{backgroundColor: '#F4F3EA'}}>
          {/* Category Header - Clickable */}
          <div 
            className="flex items-center justify-between p-6 border-t cursor-pointer group" 
            style={{borderColor: 'rgba(96, 88, 77, 0.2)'}}
            onClick={toggleCategory}
          >
            <div className="flex-1">
              <p className="font-black group-hover:text-emuski-teal transition-colors" style={{
                fontFamily: '"GT Canon VF Variable L Black", sans-serif',
                fontWeight: 900,
                fontSize: '22px',
                lineHeight: '120%',
                color: '#133437'
              }}>
                Engineering
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-normal" style={{
                fontFamily: '"GT Standard M Regular", sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                color: 'rgba(19, 52, 59, 0.72)',
                textAlign: 'right'
              }}>
                {jobOpenings.length} Roles
              </div>
              <div className={`flex items-center justify-center w-6 h-6 transition-transform duration-200 text-emuski-teal ${isExpanded ? 'rotate-45' : ''}`}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Job Listings - Expandable */}
          {isExpanded && (
            <div>
              {jobOpenings.map((job) => (
                <div key={job.id} className="border-t" style={{borderColor: 'rgba(96, 88, 77, 0.1)'}}>
                  <div className="group">
                    {/* Job Row - Clickable */}
                    <div 
                      className="p-6 flex items-center justify-between hover:bg-stone-50/30 transition-colors cursor-pointer"
                      onClick={() => toggleJobDetails(job.id)}
                    >
                      <div className="flex-1 space-y-3">
                        <h3 className="font-normal" style={{
                          fontFamily: '"FK Grotesk Neue Regular", sans-serif',
                          fontSize: '20px',
                          lineHeight: '110%',
                          color: '#133437',
                          fontFeatureSettings: "'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on"
                        }}>
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm">
                          <span style={{
                            fontFamily: '"FK Grotesk Neue Regular", sans-serif',
                            fontSize: '15px',
                            lineHeight: '100%',
                            color: 'rgba(19, 52, 59, 0.6)',
                            fontFeatureSettings: "'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on"
                          }}>
                            {job.location}
                          </span>
                          {job.department && (
                            <>
                              <svg width="2" height="12" viewBox="0 0 2 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 0V12" stroke="currentColor" strokeWidth="1"/>
                              </svg>
                              <span style={{
                                fontFamily: '"FK Grotesk Neue Regular", sans-serif',
                                fontSize: '15px',
                                lineHeight: '100%',
                                color: 'rgba(19, 52, 59, 0.6)',
                                fontFeatureSettings: "'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on"
                              }}>
                                {job.type}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:careers@emuski.com?subject=Application for ${encodeURIComponent(job.title)}`;
                          }}
                          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-normal rounded-full transition-all duration-200 hover:shadow-md"
                          style={{
                            backgroundColor: 'rgba(32, 128, 141, 0.2)',
                            color: 'rgba(19, 52, 59, 0.9)',
                            borderRadius: '22px',
                            fontFamily: '"FK Grotesk Neue Regular", sans-serif',
                            fontSize: '15px',
                            letterSpacing: '0.01em',
                            border: 'none'
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Job Details - Expandable */}
                    {expandedJobs.has(job.id) && (
                      <div className="border-t bg-white/60 backdrop-blur-sm" style={{borderColor: 'rgba(96, 88, 77, 0.1)'}}>
                        <div className="p-8 space-y-8">
                          {/* Job Description */}
                          <div className="space-y-4">
                            <p className="text-lg leading-relaxed" style={{
                              color: '#133437',
                              fontFamily: '"FK Grotesk Neue Regular", sans-serif'
                            }}>
                              {job.description}
                            </p>
                          </div>

                          {/* Job Details Grid */}
                          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t" style={{borderColor: 'rgba(96, 88, 77, 0.1)'}}>
                            {/* Responsibilities */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-emuski-teal">Key Responsibilities</h4>
                              <ul className="space-y-3">
                                {job.responsibilities.map((resp, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <span className="text-emuski-teal mt-2 h-2 w-2 rounded-full bg-current flex-shrink-0"></span>
                                    <span className="leading-relaxed" style={{
                                      color: 'rgba(19, 52, 59, 0.8)',
                                      fontFamily: '"FK Grotesk Neue Regular", sans-serif'
                                    }}>
                                      {resp}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Qualifications */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-emuski-teal">Requirements</h4>
                              <ul className="space-y-3">
                                {job.qualifications.map((qual, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <span className="text-emuski-teal mt-2 h-2 w-2 rounded-full bg-current flex-shrink-0"></span>
                                    <span className="leading-relaxed" style={{
                                      color: 'rgba(19, 52, 59, 0.8)',
                                      fontFamily: '"FK Grotesk Neue Regular", sans-serif'
                                    }}>
                                      {qual}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              
                              {/* Bonus Points */}
                              {job.bonus && job.bonus.length > 0 && (
                                <div className="pt-4 space-y-3">
                                  <h5 className="font-semibold text-emuski-teal">Nice to have:</h5>
                                  <ul className="space-y-2">
                                    {job.bonus.map((bonus, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-emuski-teal">+</span>
                                        <span className="text-sm" style={{
                                          color: 'rgba(19, 52, 59, 0.8)',
                                          fontFamily: '"FK Grotesk Neue Regular", sans-serif'
                                        }}>
                                          {bonus}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Notice Preference */}
                              {job.noticePreference && (
                                <div className="pt-4 space-y-2">
                                  <h5 className="font-semibold text-emuski-teal">Joining Timeline:</h5>
                                  <p className="text-sm" style={{
                                    color: 'rgba(19, 52, 59, 0.8)',
                                    fontFamily: '"FK Grotesk Neue Regular", sans-serif'
                                  }}>
                                    {job.noticePreference}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Apply CTA */}
                          <div className="pt-8 border-t text-center" style={{borderColor: 'rgba(96, 88, 77, 0.1)'}}>
                            <div className="space-y-4">
                              <p className="text-lg font-medium text-emuski-teal">Ready to apply?</p>
                              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button 
                                  size="lg" 
                                  className="bg-emuski-teal hover:bg-emuski-teal-dark text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                  asChild
                                >
                                  <a href={`mailto:careers@emuski.com?subject=Application for ${encodeURIComponent(job.title)}`}>
                                    <Mail className="mr-2 h-5 w-5" />
                                    Send Application
                                  </a>
                                </Button>
                              </div>
                              <div className="text-sm" style={{color: 'rgba(19, 52, 59, 0.6)'}}>
                                <p>Email: careers@emuski.com | Phone: +91-86670-88060</p>
                                <p className="mt-1">126 RNS Plaza, Electronic City Phase 2, Bangalore 560100</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}