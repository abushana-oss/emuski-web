'use client'

import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface Slide {
  image: string;
  mobileImage: string;
  category: string;
  title: string;
  shortTitle: string;
  description: string;
  link: string;
  ctaText: string;
}

const slides: Slide[] = [
  {
    image: "/assets/hero/manufacturing-services-hero-banner.webp",
    mobileImage: "/assets/hero-mobile/manufacturing-services-mobile-banner.webp",
    category: "Manufacturing Excellence",
    title: "You Design It, We Build It",
    shortTitle: "Manufacturing Excellence",
    description: "We help you turn product ideas into real parts at the right cost and quality, delivered from our NPD Innovation Center straight to your door.",
    link: "/manufacturing-services",
    ctaText: "Explore Manufacturing Services",
  },
  {
    image: "/assets/hero/cost-engineering-hero-banner.webp",
    mobileImage: "/assets/hero-mobile/cost-engineering-mobile-banner.webp",
    category: "Engineering Innovation",
    title: "Engineering That Reduces Your Costs",
    shortTitle: "Engineering Innovations",
    description: "We use teardown analysis, design benchmarking, and clear cost models to help you cut cost without sacrificing quality.",
    link: "/cost-engineering",
    ctaText: "Discover Engineering Solutions",
  },
  {
    image: "/assets/hero/ai-mithran-hero-banner.webp",
    mobileImage: "/assets/hero-mobile/ai-mithran-mobile-banner.webp",
    category: "Next-GenAI",
    title: "AI That Speeds Up Manufacturing",
    shortTitle: "Mithran",
    description: "Our AI tools help you estimate cost faster, choose better suppliers, and spot risks early across your product lifecycle.",
    link: "/solutions/ai",
    ctaText: "Learn About Mithran AI",
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const SLIDE_DURATION = 5000;

  useEffect(() => {
    // Defer animation to idle time to reduce main-thread blocking
    let idleCallbackId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);

      if (elapsed < SLIDE_DURATION) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Use requestIdleCallback for slide transitions (non-critical)
        if ('requestIdleCallback' in window) {
          idleCallbackId = requestIdleCallback(() => handleNext(), { timeout: 100 });
        } else {
          handleNext();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (idleCallbackId && 'cancelIdleCallback' in window) {
        cancelIdleCallback(idleCallbackId);
      }
    };
  }, [currentSlide]);

  const handleTabClick = (index: number) => {
    if (index !== currentSlide) {
      setCurrentSlide(index);
      setProgress(0);
      startTimeRef.current = undefined;
    }
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTimeRef.current = undefined;
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    startTimeRef.current = undefined;
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slides Container */}
      {slides.map((slide, index) => {
        // Only render current slide and adjacent slides for performance
        const shouldRender = index === currentSlide || index === (currentSlide + 1) % slides.length || index === (currentSlide - 1 + slides.length) % slides.length;
        if (!shouldRender && index !== 0) return null; // Always keep first slide rendered for initial load

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
          {/* Desktop Layout - Full Width with Left Text */}
          <div className="hidden lg:block h-full">
            <div className="relative h-full">
              {/* Full Width Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={`${slide.category} - EMUSKI Manufacturing Solutions`}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 75vw"
                  quality={75}
                  className="object-cover brightness-110"
                />
                {/* Lighter gradient overlay on left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>

              {/* Content positioned on left */}
              <div className="relative z-20 h-full flex items-center pb-32">
                <div className="w-full max-w-2xl pl-8 xl:pl-16 pr-8">
                  <div className="space-y-4">
                    {/* Category Badge */}
                    <div className="inline-flex items-center">
                      <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase">
                        {slide.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight">
                      {slide.title}
                    </h2>

                    {/* Description */}
                    <p className="text-base xl:text-lg text-gray-300 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <a
                        href={slide.link}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-base rounded transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50"
                      >
                        {slide.ctaText}
                        <ChevronRight className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Layout (md to lg) */}
          <div className="hidden md:block lg:hidden h-full">
            <div className="relative h-full">
              {/* Background */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={`${slide.category}`}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="(max-width: 1023px) 100vw, 0px"
                  quality={75}
                  className="object-cover brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
              </div>

              {/* Content */}
              <div className="relative z-20 h-full flex items-center px-10">
                <div className="max-w-2xl space-y-5">
                  <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
                    {slide.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {slide.description}
                  </p>
                  <a
                    href={slide.link}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-base rounded transition-all duration-300 transform hover:scale-105"
                  >
                    {slide.ctaText}
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden h-full">
            <div className="relative h-full">
              {/* Background Image - Full Screen */}
              <div className="absolute inset-0">
                <Image
                  src={slide.mobileImage}
                  alt={`${slide.category}`}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="(max-width: 767px) 100vw, 0px"
                  quality={75}
                  className="object-cover object-center brightness-110"
                />
              </div>

              {/* Gradient Overlays - Top dark, bottom visible */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

              {/* Content - Overlay on Top */}
              <div className="relative z-20 h-full flex flex-col pt-20 px-6 pb-32">
                <div className="space-y-3 pb-8">
                  <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase">
                    {slide.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-sm text-gray-200 leading-relaxed drop-shadow-md">
                    {slide.description}
                  </p>
                  <div className="pt-2">
                    <a
                      href={slide.link}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded transition-all duration-300 transform active:scale-95 shadow-lg"
                    >
                      {slide.ctaText}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Spacer to push content to top and leave space for image visibility */}
                <div className="flex-1" />
              </div>
            </div>
          </div>
        </div>
        );
      })}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-sm border-t border-white/10">
        {/* Progress Bar */}
        <div className="relative h-1 bg-white/20 overflow-hidden">
          <div className="absolute inset-0 flex">
            {slides.map((_, i) => (
              <div key={i} className="flex-1 h-full bg-white/10" style={{ borderRight: i < slides.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }} />
            ))}
          </div>
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-lg shadow-cyan-500/50"
            style={{ 
              width: `${(currentSlide / slides.length * 100) + (progress / slides.length)}%`,
              transition: 'none'
            }}
          />
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-0">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`relative py-5 px-4 text-left transition-all duration-300 group ${
                index === currentSlide ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div className="space-y-1">
                <div className={`text-xs uppercase tracking-wider transition-colors ${
                  index === currentSlide ? "text-cyan-400" : "text-gray-400 group-hover:text-gray-300"
                }`}>
                  {slide.category}
                </div>
                <div className={`text-sm font-semibold transition-colors hidden sm:block ${
                  index === currentSlide ? "text-white" : "text-gray-300 group-hover:text-white"
                }`}>
                  {slide.shortTitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};