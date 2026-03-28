'use client'

import { useState } from 'react'
import Image from 'next/image'

// Star icon component
const StarIcon = () => (
  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// Trophy/award icon for "Real Impact"
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" className="w-6 h-6 text-white">
    <path d="M33.605 14.636l-.054 1.971a1.943 1.943 0 0 0 2.59 1.882l1.858-.661 1.858.661a1.95 1.95 0 0 0 1.792-.259c.518-.376.815-.983.798-1.622l-.054-1.972 1.203-1.564a1.938 1.938 0 0 0-.989-3.043l-1.893-.558-1.115-1.627a1.939 1.939 0 0 0-3.202-.001L35.282 9.47l-1.892.558a1.94 1.94 0 0 0-.99 3.044l1.203 1.563zm2.586-3.348a1 1 0 0 0 .542-.394l1.217-1.92 1.316 1.92c.131.189.321.329.542.394l2.203.565-1.42 1.845c-.14.182-.213.407-.207.637l.144 2.27-2.193-.78a1 1 0 0 0-.67 0l-2.113.838.063-2.328a1.002 1.002 0 0 0-.207-.637l-1.45-1.751z" fill="currentColor" />
  </svg>
)

interface Testimonial {
  id: number
  name: string
  location: string
  industry: string
  quote: string
  avatar: string
  rating: number
}

const manufacturingTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Chennai",
    industry: "Automotive Manufacturing",
    quote: "EMUSKI delivered exceptional precision parts with quick turnaround. Their quality standards exceed expectations.",
    avatar: "/assets/testmonials/boy.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Chen",
    location: "Singapore",
    industry: "Medical Device Manufacturing",
    quote: "Outstanding manufacturing partner. EMUSKI's attention to detail and quality control is impressive.",
    avatar: "/assets/testmonials/girl.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Michael Johnson",
    location: "USA",
    industry: "Defense Manufacturing",
    quote: "Reliable manufacturing partner with consistent quality. EMUSKI understands complex requirements perfectly.",
    avatar: "/assets/testmonials/boy3.jpg",
    rating: 5
  },
  {
    id: 4,
    name: "James Thompson",
    location: "UK",
    industry: "Energy Manufacturing",
    quote: "Professional team with deep technical knowledge. EMUSKI delivers on promises consistently.",
    avatar: "/assets/testmonials/boy4.jpg",
    rating: 5
  }
]

const engineeringTestimonials: Testimonial[] = [
  {
    id: 5,
    name: "David Williams",
    location: "Germany",
    industry: "Aerospace Engineering",
    quote: "EMUSKI's cost engineering services helped us reduce manufacturing costs by 35% without compromising quality.",
    avatar: "/assets/testmonials/boy2.jpg",
    rating: 5
  },
  {
    id: 6,
    name: "Priya Sharma",
    location: "Mumbai",
    industry: "Electronics Engineering",
    quote: "From concept to production, EMUSKI made our product development journey smooth and efficient.",
    avatar: "/assets/testmonials/girl2.jpg",
    rating: 5
  },
  {
    id: 7,
    name: "Anita Patel",
    location: "Bangalore",
    industry: "Process Engineering",
    quote: "EMUSKI's engineering expertise and innovation capabilities are world-class. Highly recommended.",
    avatar: "/assets/testmonials/girl3.jpg",
    rating: 5
  },
  {
    id: 8,
    name: "Vikram Reddy",
    location: "Hyderabad",
    industry: "Robotics Engineering",
    quote: "EMUSKI's precision engineering and innovative solutions helped us meet critical project deadlines.",
    avatar: "/assets/testmonials/nonexistent.jpg",
    rating: 5
  }
]

export const TestimonialsSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-emuski-teal/10 to-emuski-teal-darker/15">
      {/* Left Side - Fixed Header Section */}
      <div className="flex flex-col lg:flex-row min-h-[50vh]">
        {/* Header Section - Sticky Left */}
        <div className="w-full lg:w-1/3 text-white p-4 sm:p-6 lg:p-8 lg:sticky lg:top-0 lg:h-[50vh] flex flex-col justify-center relative overflow-hidden" style={{backgroundColor: 'rgb(18, 26, 33)'}}>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'linear-gradient(to right, rgb(79, 211, 212) 1px, transparent 1px), linear-gradient(rgb(79, 211, 212) 1px, transparent 1px)', backgroundSize: '4rem 4rem'}}></div>
          </div>
          <div className="relative z-10">
          <div className="max-w-xs mx-auto lg:mx-0">
            <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
              <TrophyIcon />
              <span className="text-xs sm:text-sm font-semibold">Proven Results</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-xl font-bold mb-3 text-center lg:text-left">
              Manufacturing Excellence<br />
              Engineering Innovation
            </h2>

            <p className="text-white/90 text-sm sm:text-base lg:text-xs leading-relaxed mb-4 text-center lg:text-left">
              Discover how industry leaders transform their operations through our precision manufacturing and innovative engineering solutions.
            </p>

            <div className="flex justify-center lg:justify-start">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-emuski-teal-darker font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-gray-50 text-sm sm:text-base"
              >
                Get an Instant Quote
              </a>
            </div>
          </div>
          </div>
        </div>

        {/* Right Side - Scrolling Testimonials */}
        <div className="w-full lg:w-2/3 bg-gradient-to-br from-emuski-teal/15 to-emuski-teal-darker/20 overflow-hidden relative min-h-[50vh]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 right-5 w-16 h-16 sm:w-24 sm:h-24 bg-emuski-teal-darker rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-5 w-20 h-20 sm:w-32 sm:h-32 bg-emuski-teal rounded-full blur-2xl"></div>
          </div>

          {/* Dual Column Testimonials */}
          <div className="grid grid-cols-2 h-[50vh] relative z-10">

            {/* Left Column - Manufacturing Excellence */}
            <div className="relative overflow-hidden px-1 sm:px-2 py-1">
              <div className="mb-2 text-center">
                <h3 className="text-xs font-semibold text-emuski-teal-darker bg-white/80 px-2 py-1 rounded-full inline-block">Manufacturing Excellence</h3>
              </div>
              <div className="testimonial-scroll-up space-y-1 sm:space-y-2">
                {[...manufacturingTestimonials, ...manufacturingTestimonials, ...manufacturingTestimonials].map((testimonial, index) => (
                  <div
                    key={`up-${index}`}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      marginTop: '10px',
                      marginLeft: index % 2 === 0 ? '0' : '0.25rem',
                      marginRight: index % 2 === 0 ? '0.25rem' : '0',
                    }}
                  >
                    <div className="uc_quote_info">
                      <div className="uc_author flex items-start gap-2 mb-2">
                        <div className="ue-image">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-md relative">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-emuski-teal-darker to-emuski-teal flex items-center justify-center absolute inset-0 hidden">
                              <span className="text-white font-semibold text-[10px] sm:text-xs">
                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ue-image-spacing w-1"></div>
                        <div className="uc_author_info flex-1 min-w-0">
                          <div className="ue_title font-semibold text-gray-900 text-[10px] sm:text-xs mb-1 truncate">{testimonial.name}</div>
                          <div className="ue_subtitle text-[8px] sm:text-[10px] text-emuski-teal-darker font-medium line-clamp-2">{testimonial.industry}</div>
                        </div>
                      </div>

                      <div className="ue-text mb-2">
                        <p className="text-gray-700 text-[9px] sm:text-[10px] leading-relaxed line-clamp-3 sm:line-clamp-4">"{testimonial.quote}"</p>
                      </div>

                      <div className="uc_stars flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <div key={i} className="ue_rate">
                            <StarIcon />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Engineering Innovation */}
            <div className="relative overflow-hidden px-1 sm:px-2 py-1">
              <div className="mb-2 text-center">
                <h3 className="text-xs font-semibold text-emuski-teal-darker bg-white/80 px-2 py-1 rounded-full inline-block">Engineering Innovation</h3>
              </div>
              <div className="testimonial-scroll-down space-y-1 sm:space-y-2">
                {[...engineeringTestimonials, ...engineeringTestimonials, ...engineeringTestimonials].map((testimonial, index) => (
                  <div
                    key={`down-${index}`}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      marginTop: '10px',
                      marginLeft: index % 2 === 0 ? '0.25rem' : '0',
                      marginRight: index % 2 === 0 ? '0' : '0.25rem',
                    }}
                  >
                    <div className="uc_quote_info">
                      <div className="uc_author flex items-start gap-2 mb-2">
                        <div className="ue-image">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-md relative">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-emuski-teal-darker to-emuski-teal flex items-center justify-center absolute inset-0 hidden">
                              <span className="text-white font-semibold text-[10px] sm:text-xs">
                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ue-image-spacing w-1"></div>
                        <div className="uc_author_info flex-1 min-w-0">
                          <div className="ue_title font-semibold text-gray-900 text-[10px] sm:text-xs mb-1 truncate">{testimonial.name}</div>
                          <div className="ue_subtitle text-[8px] sm:text-[10px] text-emuski-teal-darker font-medium line-clamp-2">{testimonial.industry}</div>
                        </div>
                      </div>

                      <div className="ue-text mb-2">
                        <p className="text-gray-700 text-[9px] sm:text-[10px] leading-relaxed line-clamp-3 sm:line-clamp-4">"{testimonial.quote}"</p>
                      </div>

                      <div className="uc_stars flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <div key={i} className="ue_rate">
                            <StarIcon />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .testimonial-scroll-up {
          animation: scrollUp 40s linear infinite;
        }

        .testimonial-scroll-down {
          animation: scrollDown 40s linear infinite;
        }

        .testimonial-scroll-up:hover,
        .testimonial-scroll-down:hover {
          animation-play-state: paused;
        }

        /* Line clamp utility for text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive animation speed */
        @media (max-width: 640px) {
          .testimonial-scroll-up {
            animation: scrollUp 60s linear infinite;
          }
          
          .testimonial-scroll-down {
            animation: scrollDown 60s linear infinite;
          }
        }
      `}</style>
    </section>
  )
}