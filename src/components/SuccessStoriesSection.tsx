'use client'

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Clock, User, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { allBlogPosts } from "../data/blogData";

const POSTS_PER_PAGE = 6;

// Minimal shape this component actually reads — satisfied by both the hook's
// BlogPost and the server-side BlogPost from @/lib/api/blogger.
type StoryPost = {
  id: string;
  slug: string;
  image: string;
  title: string;
  readTime: string;
  category: string;
  excerpt: string;
  author: string;
};

interface SuccessStoriesSectionProps {
  initialPosts?: StoryPost[];
}

export function SuccessStoriesSection({ initialPosts }: SuccessStoriesSectionProps = {}) {
  const hasInitialData = initialPosts !== undefined && initialPosts.length > 0;

  // Hook must always be called (Rules of Hooks). Its result is only used when
  // no server-side data was passed in — i.e. as a client-side fallback.
  const localPosts = allBlogPosts
    .filter(p => p.category === 'Case Study')
    .map(p => ({ ...p, id: String(p.id) })) as StoryPost[];

  const allPosts: StoryPost[] = hasInitialData ? initialPosts : localPosts;
  const isLoading = false;
  const error = null;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const displayPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const scrollToSection = useCallback(() => {
    const element = document.getElementById('success-stories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      scrollToSection();
    }
  }, [currentPage, scrollToSection]);

  if (isLoading) {
    return (
      <section id="success-stories-section" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-1 w-12 bg-emuski-teal-dark rounded"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Success Stories</h2>
            </div>
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-emuski-teal-dark" />
              <span className="ml-3 text-gray-600">Loading success stories...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !allPosts || allPosts.length === 0) {
    return (
      <section id="success-stories-section" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-1 w-12 bg-emuski-teal-dark rounded"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Success Stories</h2>
            </div>
            <div className="text-center py-20">
              <p className="text-gray-600">
                {error
                  ? 'Unable to load success stories. Please try again later.'
                  : 'No success stories available. Please add posts to emuski-stories.blogspot.com'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="success-stories-section" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-1 w-12 bg-emuski-teal-dark rounded"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {displayPosts.map((story) => (
              <Link
                key={story.id}
                href={`/blog/${story.slug}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Card className="group overflow-hidden bg-white border-gray-200 hover:border-emuski-teal/50 transition-all duration-300 h-full shadow-sm hover:shadow-md cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{story.readTime}</span>
                      </div>
                      {story.category && (
                        <span className="text-xs font-medium text-emuski-teal-dark bg-teal-50 px-2 py-1 rounded">
                          {story.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emuski-teal-dark transition-colors line-clamp-2">
                      {story.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{story.author || 'EMUSKI Team'}</span>
                      </div>

                      <div className="flex items-center text-emuski-teal-darker font-medium text-sm">
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1">
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination — identical logic to BlogPage */}
          {totalPages > 1 && (
            <nav
              className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6"
              aria-label="Success Stories Pagination"
            >
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-emuski-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                ← Previous
              </button>

              {/* Page Numbers — Smart Display */}
              <div className="flex items-center gap-2">
                {(() => {
                  const pages: (number | string)[] = [];
                  const showEllipsis = totalPages > 7;

                  if (!showEllipsis) {
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    pages.push(1);

                    if (currentPage > 3) {
                      pages.push('ellipsis-start');
                    }

                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 2) {
                      pages.push('ellipsis-end');
                    }

                    if (totalPages > 1) {
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => {
                    if (typeof page === 'string') {
                      return (
                        <span
                          key={`${page}-${index}`}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 font-medium"
                          aria-hidden="true"
                        >
                          •••
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative w-12 h-12 rounded-lg font-bold transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-br from-emuski-teal to-emuski-teal-dark text-white shadow-lg scale-110'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-emuski-teal hover:text-emuski-teal-dark hover:scale-105'
                        }`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                        {currentPage === page && (
                          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full opacity-80" />
                        )}
                      </button>
                    );
                  });
                })()}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-emuski-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
