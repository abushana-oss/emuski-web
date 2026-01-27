'use client'

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { useSuccessStoriesPosts } from "../hooks/useSuccessStoriesBlogger";

// Include all partner logos - 6 priority partners + 16 manufacturing partners
const clientLogos = [
  { name: "EtherealX", logo: "/assets/partners/etherealx-partner-logo-1.svg" },
  { name: "Tata Motors", logo: "/assets/partners/TATA-motors-logo-3.svg" },
  { name: "Polarix Partner", logo: "/assets/partners/polarixpartner_logo.svg" },
  { name: "Pixxel", logo: "/assets/partners/pixxel-partner-logo-4.svg" },
  { name: "Roland Berger", logo: "/assets/partners/rorland-berger-company.logo.svg" },
  { name: "CynLr", logo: "/assets/partners/cynLr-partner-logo-2.svg" },
  ...Array.from({ length: 16 }, (_, i) => ({
    name: `Partner ${i + 1}`,
    logo: `/assets/partners/manufacturing-partner-logo-${i + 1}.svg`
  }))
];

export const NewsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch success stories from Blogger
  const { posts: successStories, loading, error } = useSuccessStoriesPosts(10);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -containerRef.current.offsetWidth : containerRef.current.offsetWidth;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <>

      {/* Trusted by Clients Section */}
      <section className="py-8 border-b border-border/30 relative overflow-hidden" style={{ backgroundColor: '#121A21' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(to right, #4fd3d4 1px, transparent 1px), linear-gradient(to bottom, #4fd3d4 1px, transparent 1px)',
              backgroundSize: '4rem 4rem'
            }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-white/80 mb-4">Trusted by Industry Leaders</h2>
          </div>

          <div className="relative overflow-x-auto md:overflow-hidden w-full scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex animate-scroll-mobile sm:animate-scroll space-x-8 sm:space-x-12 md:space-x-14 items-center">
              {/* Quadruple the list for maximum smoothness - 88 total logos */}
              {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                <div key={index} className="flex-shrink-0 grayscale opacity-70 h-16 sm:h-20 md:h-24 lg:h-28 w-28 sm:w-32 md:w-36 lg:w-40">
                  <img
                    src={client.logo}
                    alt={`${client.name} - Partner Logo`}
                    className="w-full h-full object-contain filter brightness-0 invert"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          /* Hide scrollbar for Chrome, Safari and Opera */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for IE, Edge and Firefox */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          @keyframes scroll-mobile {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-25%);
            }
          }
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-25%);
            }
          }
          .animate-scroll-mobile {
            animation: scroll-mobile 15s linear infinite;
          }
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
          @media (min-width: 640px) {
            .animate-scroll-mobile {
              animation: scroll 20s linear infinite;
            }
          }
          @media (min-width: 1024px) {
            .animate-scroll {
              animation: scroll 25s linear infinite;
            }
          }
          `
        }} />
      </section>

      {/* Only show success stories section if we have data */}
      {!loading && successStories && successStories.length > 0 && (
        <section className="py-12 border-b border-border relative overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: 'linear-gradient(to right, #4fd3d4 1px, transparent 1px), linear-gradient(to bottom, #4fd3d4 1px, transparent 1px)',
                backgroundSize: '4rem 4rem'
              }}
            ></div>
          </div>

          <div className="w-full px-4 sm:px-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Success Stories</h2>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll("left")}
                  className="border-emuski-teal-darker bg-emuski-teal-darker text-white hover:bg-emuski-teal-darker/80"
                  aria-label="Scroll success stories left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll("right")}
                  className="border-emuski-teal-darker bg-emuski-teal-darker text-white hover:bg-emuski-teal-darker/80"
                  aria-label="Scroll success stories right"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div
              ref={containerRef}
              className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-hide"
            >
              {successStories.map((story, index) => (
                <Card
                  key={story.id}
                  className="flex-shrink-0 w-80 sm:w-96 group bg-white border-gray-200 hover:border-emuski-teal/50 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <Link
                    href={`/blog/${story.slug}`}
                    className="block h-full hover:no-underline"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={story.image}
                        alt={`${story.title} - Success Story`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        quality={75}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80';
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">{story.category || 'Success Story'}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">{story.readTime}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                        {story.title}
                      </h3>

                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {story.excerpt}
                      </p>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading state */}
      {loading && (
        <section className="py-12 border-b border-border bg-white">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emuski-teal-dark" />
            <span className="ml-3 text-gray-600">Loading success stories...</span>
          </div>
        </section>
      )}
    </>
  );
};
