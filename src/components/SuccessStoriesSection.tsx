'use client'

import Link from "next/link";
import { Clock, User, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { useSuccessStoriesPosts } from "../hooks/useBlogData";

export function SuccessStoriesSection() {
  // Fetch success stories from dedicated Blogger blog (emuski-stories.blogspot.com)
  const { posts: displayPosts, loading: isLoading, error } = useSuccessStoriesPosts({ maxResults: 6 });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
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

  if (error || !displayPosts || displayPosts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-1 w-12 bg-emuski-teal-dark rounded"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Success Stories</h2>
            </div>
            <div className="text-center py-20">
              <p className="text-gray-600">
                {error ? 'Unable to load success stories. Please try again later.' : 'No success stories available. Please add posts to emuski-stories.blogspot.com'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-1 w-12 bg-emuski-teal-dark rounded"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {displayPosts.map((story, index) => (
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
                        (e.target as HTMLImageElement).src = '/api/image-proxy?url=' + encodeURIComponent('https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80');
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

          {displayPosts && displayPosts.length >= 6 && (
            <div className="text-center mt-10">
              <Link href="/blog?category=case-study">
                <button className="bg-emuski-teal-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-emuski-teal-darker transition-colors">
                  View All Success Stories
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
