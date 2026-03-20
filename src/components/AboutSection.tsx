'use client'

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Linkedin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const growthStories = [
  {
    value: "SINGARAVELAN SRINIVASAN",
    label: "Founder & CEO @EMUSKI",
    category: "Leadership",
    description: "\"Striving for Value-Driven Empowerment \"",
    image: "/assets/team/emuski-founder-ceo.jpg",
    linkedinUrl: "https://www.linkedin.com/in/singaravelan-srinivasan-emuski/",
    isFounder: true,
    location: "Bengaluru, Karnataka, India",
  },
  {
    value: "4000+",
    label: "Components Manufactured",
    sublabel: "In Manufacturing Excellence",
    category: "Our Production",
    description: "High-precision components manufactured to demanding specifications across diverse industrial applications.",
    image: "/assets/industry-components/automotive-component-manufacturing/automotive-component-2.svg",
  },
  {
    value: "150+",
    label: "Individual Projects Handled",
    sublabel: "In Engineering Innovation",
    category: "Our Expertise",
    description: "Complex engineering projects delivered from concept to completion with precision and cost optimization.",
    image: "/assets/engineering/cost-breakdown-engineering.png",
  }
];

const achievementsData = [
    {
        value: "15+",
        number: 15,
        label: "Industries",
        category: "Our Reach"
    },
    {
        value: "75+",
        number: 75,
        label: "Clients",
        category: "Strategic Partnerships"
    },
    {
        value: "150+",
        number: 150,
        label: "Individual Projects",
        sublabel: "In Engineering Innovation",
        category: "Our Expertise"
    },
    {
        value: "4000+",
        number: 4000,
        label: "Unique Components",
        sublabel: "In Manufacturing Excellence",
        category: "Our Production"
    }
];

const AboutSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);
    const [maxIndex, setMaxIndex] = useState(0);
    const [animatedValues, setAnimatedValues] = useState<{ [key: number]: number }>({});
    const [hasAnimated, setHasAnimated] = useState(false);
    const achievementsRef = useRef<HTMLDivElement>(null);
    const [showLeftGradient, setShowLeftGradient] = useState(false);
    const [showRightGradient, setShowRightGradient] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Handle responsive itemsPerView and maxIndex calculation
    useEffect(() => {
        const handleResize = () => {
            const items = window.innerWidth < 1024 ? 1 : 3;
            setItemsPerView(items);
            setMaxIndex(Math.max(0, growthStories.length - items));
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getNumberFromValue = (achievement: any): number => {
        return achievement.number || 0;
    };

    const animateNumber = (finalValue: number, index: number, duration: number = 2000) => {
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);

            setAnimatedValues(prev => ({ ...prev, [index]: currentValue }));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        achievementsData.forEach((achievement, index) => {
                            const finalNumber = getNumberFromValue(achievement);
                            setTimeout(() => {
                                animateNumber(finalNumber, index, 2000 + index * 200);
                            }, index * 100);
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );

        const currentRef = achievementsRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasAnimated]);

    useEffect(() => {
        handleScroll();
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const handleScroll = () => {
        const container = carouselRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setShowLeftGradient(scrollLeft > 10);
            setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    return (
        <section className="py-16 relative overflow-hidden" style={{backgroundColor: '#121A21'}}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            </div>
            
            <div className="w-full px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-3xl font-bold text-white">
                            About EMUSKI
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            One stop solution for OEM Manufacturing - We deliver precision engineering and manufacturing excellence for OEMs across industries.
                        </p>
                        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-emuski-teal/20">
                            <h3 className="text-lg font-semibold text-emuski-teal mb-3">Technology-Driven Engineering, Manufacturing & Digital Excellence</h3>
                            <p className="text-sm text-gray-300 italic mb-3">"Empowering OEMs with intelligence, agility, and precision across the product lifecycle"</p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                At EMUSKI, we combine engineering expertise, manufacturing mastery, and AI-driven digital innovation to support OEMs at every stage of their manufacturing lifecycle. Our services includes from design engineering to end-to-end value, cost efficiency, and speed to market.
                            </p>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-emuski-teal font-medium">"At EMUSKI, where cost and quality meets profitability in manufacturing"</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="hidden lg:flex justify-end mb-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentIndex === 0}
                                    className="h-10 w-10 bg-emuski-teal-darker hover:shadow-lg text-white disabled:opacity-50 inline-flex items-center justify-center rounded-md transition-all duration-300"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    disabled={currentIndex === maxIndex}
                                    className="h-10 w-10 bg-emuski-teal-darker hover:shadow-lg text-white disabled:opacity-50 inline-flex items-center justify-center rounded-md transition-all duration-300"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-emuski-teal via-emuski-teal-dark to-transparent pointer-events-none z-10 transition-opacity duration-500 ${showLeftGradient ? 'opacity-30' : 'opacity-0'}`}
                                style={{
                                    maskImage: 'linear-gradient(to right, black, transparent)',
                                    WebkitMaskImage: 'linear-gradient(to right, black, transparent)'
                                }}
                            ></div>

                            <div
                                className={`absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emuski-teal via-emuski-teal-dark to-transparent pointer-events-none z-10 transition-opacity duration-500 ${showRightGradient ? 'opacity-30' : 'opacity-0'}`}
                                style={{
                                    maskImage: 'linear-gradient(to left, black, transparent)',
                                    WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
                                }}
                            ></div>

                            <div
                                ref={carouselRef}
                                onScroll={handleScroll}
                                className="overflow-x-auto scrollbar-hide scroll-smooth"
                                style={{ scrollbarWidth: 'none' }}
                            >
                                <div
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                                >
                                    {growthStories.map((story, index) => (
                                        <div key={index} className="w-full lg:w-1/3 flex-shrink-0 px-2">
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-emuski-teal/50 transition-all duration-300 h-full group overflow-hidden cursor-pointer">
                                                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
<Image
                                                        src={story.image}
                                                        alt={`${story.label} - ${story.category}`}
                                                        width={600}
                                                        height={400}
                                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                                        quality={40}
                                                        loading="lazy"
                                                    />
                                                    {story.category === 'Our Expertise' && (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                                                    )}
                                                    {story.category === 'Our Production' && (
                                                        <Link href="/gallery">
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                                                                <div className="bg-emuski-teal-darker text-white px-6 py-3 rounded-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                                                                    <span className="font-semibold text-sm">View Gallery</span>
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )}
                                                </div>
                                                
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1">
                                                            {story.isFounder ? (
                                                                <>
                                                                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">
                                                                        {story.value}
                                                                    </h3>
                                                                    <p className="text-sm font-semibold text-emuski-teal-darker mb-1">
                                                                        {story.label}
                                                                    </p>
                                                                    {story.location && (
                                                                        <p className="text-xs text-gray-500 mb-2">
                                                                            {story.location}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                                    {story.value} {story.label}
                                                                </h3>
                                                            )}
                                                        </div>
                                                        {story.linkedinUrl && (
                                                            <a 
                                                                href={story.linkedinUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors ml-2 flex-shrink-0"
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="View LinkedIn Profile"
                                                            >
                                                                <Linkedin className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    
                                                    {story.description && (
                                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                            {story.isFounder ? (
                                                                <span className="relative">
                                                                    <span className="text-xl text-gray-600 opacity-70 mr-1">"</span>
                                                                    <span className="italic">Striving for Value-Driven Empowerment</span>
                                                                    <span className="text-xl text-gray-600 opacity-70 ml-1">"</span>
                                                                </span>
                                                            ) : (
                                                                story.description
                                                            )}
                                                        </p>
                                                    )}

                                                    {story.category === 'Our Production' && (
                                                        <Link href="/gallery" className="inline-flex items-center gap-2 text-emuski-teal-darker font-semibold text-sm hover:gap-3 transition-all group-hover:text-emuski-teal">
                                                            <span>View Gallery</span>
                                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden flex justify-center mt-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentIndex === 0}
                                    className="h-10 w-10 bg-emuski-teal-darker hover:shadow-lg text-white disabled:opacity-50 inline-flex items-center justify-center rounded-md transition-all duration-300"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    disabled={currentIndex === maxIndex}
                                    className="h-10 w-10 bg-emuski-teal-darker hover:shadow-lg text-white disabled:opacity-50 inline-flex items-center justify-center rounded-md transition-all duration-300"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 lg:mt-12" ref={achievementsRef}>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 text-center">Our Achievements</h3>
                    
                    <div className="hidden lg:grid lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {achievementsData.map((story, index) => {
                            const animatedValue = animatedValues[index] || 0;
                            const suffix = story.value.includes('+') ? '+' : '';
                            return (
                                <div key={index} className="text-center bg-gray-800/30 p-6 rounded-lg border border-emuski-teal/20 hover:bg-gray-800/50 transition-all duration-300">
                                    <div className="text-3xl xl:text-4xl font-bold text-emuski-teal mb-2">
                                        {animatedValue}{suffix}
                                    </div>
                                    <div className="text-sm font-medium text-gray-300 mb-1">{story.label}</div>
                                    {story.sublabel && (
                                        <div className="text-xs text-gray-400">{story.sublabel}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="lg:hidden grid grid-cols-2 gap-4">
                        {achievementsData.map((story, index) => {
                            const animatedValue = animatedValues[index] || 0;
                            const suffix = story.value.includes('+') ? '+' : '';
                            return (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-emuski-teal/20 text-center">
                                    <span className="text-xl sm:text-2xl font-bold text-emuski-teal block">
                                        {animatedValue}{suffix}
                                    </span>
                                    <p className="text-xs sm:text-sm text-gray-300">{story.label}</p>
                                    {story.sublabel && (
                                        <p className="text-xs text-gray-400">{story.sublabel}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export { AboutSection };
export default AboutSection;