'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const locationsDropdown = [
  { name: "View All Locations", path: "/careers#locations", description: "See all our office locations" },
  { name: "Bangalore", path: "/careers#locations", description: "RNS Plaza, Electronic City" },
  { name: "Hyderabad", path: "/careers#locations", description: "Tech Hub, Telangana" },
  { name: "Hosur", path: "/careers#locations", description: "Production Facility, Tamil Nadu" },
  { name: "Germany", path: "/careers#locations", description: "Regional Office, Europe" },
  { name: "USA", path: "/careers#locations", description: "Operations, North America" }
]

const hiringProcessDropdown = [
  { name: "Hiring Process Overview", path: "/careers#hiring-process", description: "Our complete hiring process" },
  { name: "Interview Guide", path: "/interview-guide", description: "Tips and preparation guide" },
  { name: "Application Tips", path: "/interview-guide#application-tips", description: "How to stand out" },
  { name: "Timeline", path: "/interview-guide#hiring-timeline", description: "What to expect and when" }
]

export const CareersNavigation = () => {
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false)
  const [showHiringProcessDropdown, setShowHiringProcessDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const locationsRef = useRef<HTMLDivElement>(null)
  const hiringProcessRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationsRef.current && !locationsRef.current.contains(event.target as Node)) {
        setShowLocationsDropdown(false)
      }
      if (hiringProcessRef.current && !hiringProcessRef.current.contains(event.target as Node)) {
        setShowHiringProcessDropdown(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (showLocationsDropdown || showHiringProcessDropdown || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLocationsDropdown, showHiringProcessDropdown, isMobileMenuOpen])

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-[calc(100vw-2rem)] justify-center">
        <div className="bg-white border border-gray-200 rounded-full px-2 lg:px-4 xl:px-6 py-1.5 shadow-lg flex items-center justify-center w-fit min-w-max max-w-full overflow-hidden">
          <div className="flex items-center space-x-1">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center mr-1 lg:mr-2 hover:opacity-80 transition-opacity overflow-visible shrink-0"
            >
              <Image
                src="/logofull.svg"
                alt="EMUSKI"
                width={120}
                height={60}
                className="h-6 lg:h-8 w-auto"
              />
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1 lg:space-x-2 xl:space-x-3 flex-shrink-0">
            <a
              href="#mission"
              className="px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-all duration-200 whitespace-nowrap"
            >
              Mission
            </a>
            <a
              href="#values"
              className="px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-all duration-200 whitespace-nowrap"
            >
              Values
            </a>
            <a
              href="#benefits"
              className="px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-all duration-200 whitespace-nowrap"
            >
              Benefits
            </a>

            {/* Locations Dropdown */}
            <div
              className="relative"
              ref={locationsRef}
            >
              <button
                onClick={() => {
                  setShowHiringProcessDropdown(false)
                  setShowLocationsDropdown(!showLocationsDropdown)
                }}
                onMouseEnter={() => {
                  setShowHiringProcessDropdown(false)
                  setShowLocationsDropdown(true)
                }}
                className="px-2 lg:px-3 py-2.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
              >
                Locations
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showLocationsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLocationsDropdown && (
                <div 
                  className="absolute top-full left-0 pt-2 w-72 z-[60]"
                  onMouseEnter={() => {
                    setShowHiringProcessDropdown(false)
                    setShowLocationsDropdown(true)
                  }}
                  onMouseLeave={() => setShowLocationsDropdown(false)}
                >
                  <div
                    className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  >
                    <div className="py-2">
                      {locationsDropdown.map((location, index) => (
                        <Link
                          key={index}
                          href={location.path}
                          className="block px-4 py-3 text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          onClick={() => setShowLocationsDropdown(false)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{location.name}</span>
                            <span className="text-xs text-gray-500">{location.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hiring Process Dropdown */}
            <div
              className="relative"
              ref={hiringProcessRef}
            >
              <button
                onClick={() => {
                  setShowLocationsDropdown(false)
                  setShowHiringProcessDropdown(!showHiringProcessDropdown)
                }}
                onMouseEnter={() => {
                  setShowLocationsDropdown(false)
                  setShowHiringProcessDropdown(true)
                }}
                className="px-2 lg:px-3 py-2.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
              >
                Process
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showHiringProcessDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showHiringProcessDropdown && (
                <div 
                  className="absolute top-full left-0 pt-2 w-64 z-[60]"
                  onMouseEnter={() => {
                    setShowLocationsDropdown(false)
                    setShowHiringProcessDropdown(true)
                  }}
                  onMouseLeave={() => setShowHiringProcessDropdown(false)}
                >
                  <div
                    className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  >
                    <div className="py-2">
                      {hiringProcessDropdown.map((item, index) => (
                        <Link
                          key={index}
                          href={item.path}
                          className="block px-4 py-3 text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          onClick={() => setShowHiringProcessDropdown(false)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-xs text-gray-500">{item.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#open-roles"
              className="px-3 lg:px-4 xl:px-5 py-2.5 text-xs lg:text-sm font-medium text-foreground bg-teal-100 hover:bg-teal-200 border border-teal-200 rounded-full transition-all duration-200 whitespace-nowrap ml-1 lg:ml-2 flex-shrink-0"
            >
              Open Roles
            </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-4 left-4 right-4 z-50">
        <div className="flex items-center justify-between w-full">
          {/* Logo Container */}
          <Link
            href="/"
            className="bg-white border border-gray-200 rounded-[40px] shadow-sm p-3 hover:shadow-md transition-shadow"
          >
            <Image
              src="/logofull.svg"
              alt="EMUSKI"
              width={80}
              height={32}
              className="h-6 w-auto"
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-white border border-gray-200 rounded-[40px] shadow-sm p-3 hover:shadow-md transition-shadow focus:outline-none focus:ring-0"
            >
              <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
                <div 
                  className={`w-4 h-0.5 bg-gray-600 rounded-[10px] transition-all duration-200 ${isMobileMenuOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}
                ></div>
                <div 
                  className={`w-4 h-0.5 bg-gray-600 rounded-[10px] transition-all duration-200 ${isMobileMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}
                ></div>
              </div>
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="py-4">
                  {/* Quick Action Buttons */}
                  <div className="px-4 mb-4 flex gap-2">
                    <a
                      href="#open-roles"
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-white bg-teal-600 hover:bg-teal-700 rounded-full transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Open Roles
                    </a>
                    <a
                      href="/interview-guide"
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-full transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Interview Guide
                    </a>
                  </div>

                  <a
                    href="#mission"
                    className="block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mission
                  </a>
                  <a
                    href="#values"
                    className="block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Values
                  </a>
                  <a
                    href="#benefits"
                    className="block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Benefits
                  </a>
                  <a
                    href="#locations"
                    className="block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Locations
                  </a>
                  <a
                    href="#hiring-process"
                    className="block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hiring Process
                  </a>
                  <a
                    href="#open-roles"
                    className="block px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Open Roles
                  </a>
                  
                  <div className="px-6 py-3">
                    <a
                      href="/careers"
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>Roles by Location</span>
                      <ChevronDown className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}