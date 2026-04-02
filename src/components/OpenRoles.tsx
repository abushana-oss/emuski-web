'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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
  const [mounted, setMounted] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Cost Engineering']))

  useEffect(() => {
    setMounted(true)
  }, [])

  // Group jobs by department/category
  const jobsByCategory = jobOpenings.reduce((acc, job) => {
    const category = job.department
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(job)
    return acc
  }, {} as Record<string, JobOpening[]>)

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <section id="open-roles" className="py-24 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold text-dark-text mb-4" style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color: '#1a365d'
          }}>
            Open Roles
          </h1>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {Object.entries(jobsByCategory).map(([category, jobs]) => (
            <div key={category} className="border-b border-gray-200">
              {/* Category Header - Clickable */}
              <button 
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700" style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '18px',
                    fontWeight: 500
                  }}>
                    {category}
                  </h3>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-500" style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '14px'
                    }}>
                      {jobs.length} Role{jobs.length !== 1 ? 's' : ''}
                    </span>
                    
                    <div className={`transition-transform duration-200 text-gray-400 ${mounted && expandedCategories.has(category) ? 'rotate-45' : ''}`}>
                      <Plus className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Job List */}
              {mounted && expandedCategories.has(category) && (
                <div className="pb-6 space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="ml-6 pl-6 border-l border-gray-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900" style={{
                              fontFamily: '"Inter", sans-serif',
                              fontSize: '16px',
                              fontWeight: 500
                            }}>
                              {job.title}
                            </h4>
                            {job.urgent && (
                              <span className="px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                                Urgent
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                          </div>
                          
                          <p className="text-sm text-gray-700 leading-relaxed mb-4" style={{
                            fontFamily: '"Inter", sans-serif'
                          }}>
                            {job.description}
                          </p>
                        </div>
                        
                        <Link
                          href={`/careers/${job.id}`}
                          className="flex-shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors"
                          style={{
                            fontFamily: '"Inter", sans-serif'
                          }}
                        >
                          View Role
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}