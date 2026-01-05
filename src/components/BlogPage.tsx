'use client'

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Filter, Calendar, User, Clock, ChevronRight } from "lucide-react";
import { BlogPost } from "@/lib/api/blogger";
import { EmailSubscription } from "./EmailSubscription";
import { SuccessStoriesSection } from "./SuccessStoriesSection";

const getFirstSentence = (text: string): string => {
  if (!text) return '';
  const match = text.match(/^[^.!?]*[.!?]/);
  return match ? match[0].trim() : text.split('\n')[0].trim().slice(0, 150) + '...';
};

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  manufacturingPosts: BlogPost[];
  engineeringPosts: BlogPost[];
}

export const BlogPage = ({ manufacturingPosts, engineeringPosts }: BlogPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Primary blog posts (manufacturing-focused)
  const allPosts = useMemo(() => [...manufacturingPosts], [manufacturingPosts]);

  const categories = useMemo(() => {
    const cats = new Set<string>(['All']);
    allPosts.forEach(post => post.category && cats.add(post.category));
    return Array.from(cats);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return allPosts;
    return allPosts.filter(post => post.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Smooth scroll to articles on pagination
  const scrollToArticles = useCallback(() => {
    const element = document.getElementById('latest-articles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      scrollToArticles();
    }
  }, [currentPage, scrollToArticles]);

  const featuredPost = filteredPosts[0];
  const regularPostsAll = filteredPosts.slice(1);
  const totalPages = Math.ceil(regularPostsAll.length / POSTS_PER_PAGE);
  const paginatedPosts = regularPostsAll.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const hasPosts = allPosts.length > 0;

  if (!hasPosts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-white py-24">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No Articles Yet</h1>
            <p className="text-lg text-gray-600">Check back soon for expert insights on manufacturing and engineering.</p>
          </div>
        </section>
        {engineeringPosts.length > 0 && <EngineeringSection posts={engineeringPosts} />}
        <SuccessStoriesSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden" style={{ backgroundColor: 'rgb(18, 26, 33)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-emuski-teal text-sm font-semibold uppercase tracking-wider">Engineering Blog</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Expert Insights for Modern Manufacturing and Engineering
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              Practical strategies to reduce costs, improve quality, and implement intelligent manufacturing solutions.
            </p>
            <a
              href="#latest-articles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emuski-teal-darker hover:bg-emuski-teal-dark text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Explore Articles
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Category Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-5">
            <h2 className="text-2xl font-bold text-gray-900">Manufacturing Blog</h2>

            {/* Desktop Categories */}
            <div className="hidden md:flex items-center gap-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative text-sm font-medium transition-colors pb-1 ${
                    selectedCategory === category
                      ? 'text-emuski-teal-dark after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emuski-teal-dark'
                      : 'text-gray-600 hover:text-emuski-teal-dark'
                  }`}
                  aria-current={selectedCategory === category ? 'page' : undefined}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Filter by category"
              aria-expanded={mobileMenuOpen}
            >
              <Filter className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-emuski-teal/10 text-emuski-teal-dark'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Featured Post */}
      {featuredPost && (
        <section className="bg-white py-12 lg:py-16">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 rounded-2xl overflow-hidden bg-gradient-to-br from-emuski-teal/5 to-blue-50 hover:shadow-2xl transition-shadow">
                <div className="relative h-64 lg:h-96 overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <span className="absolute top-4 left-4 px-4 py-1.5 bg-emuski-teal text-white text-xs font-bold uppercase rounded-full">
                    Featured
                  </span>
                </div>

                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="inline-block px-4 py-1.5 bg-emuski-teal/10 text-emuski-teal-dark text-xs font-bold uppercase rounded mb-4">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 group-hover:text-emuski-teal-dark transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">{getFirstSentence(featuredPost.excerpt)}</p>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={featuredPost.publishDate}>
                        {new Date(featuredPost.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center text-emuski-teal-dark font-semibold group-hover:translate-x-1 transition-transform">
                    Read Article <ChevronRight className="h-5 w-5 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section id="latest-articles" className="bg-gray-50 py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
            {regularPostsAll.length > 0 && (
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * POSTS_PER_PAGE + 1}–{Math.min(currentPage * POSTS_PER_PAGE, regularPostsAll.length)} of {regularPostsAll.length}
              </p>
            )}
          </div>

          {paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emuski-teal/30 transition-all duration-300 flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded">
                        {post.category}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col">
                    <Link href={`/blog/${post.slug}`} className="block flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-emuski-teal-dark transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                        {getFirstSentence(post.excerpt)}
                      </p>
                    </Link>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700">{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <time dateTime={post.publishDate}>
                        {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-6">No articles found in this category.</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-6 py-3 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white font-semibold rounded-lg transition-colors"
              >
                Show All Articles
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-16 flex justify-center items-center gap-3" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-emuski-teal text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* Related/Recommended Articles Section */}
      {allPosts.length > 6 && (
        <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-16 border-t border-gray-200">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">You May Also Like</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore more insights on manufacturing excellence, cost optimization, and engineering innovations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allPosts.slice(Math.min(6, allPosts.length - 4), Math.min(10, allPosts.length)).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emuski-teal/30 transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-emuski-teal-dark transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed">
                        {getFirstSentence(post.excerpt)}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <span className="font-medium text-gray-700">{post.author}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Topics + Newsletter */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Topics</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-emuski-teal-dark mb-3">Manufacturing</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Precision Engineering', 'CNC Machining', 'Quality Control', 'Smart Factory'].map(topic => (
                    <li key={topic} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-emuski-teal rounded-full" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-emuski-teal-dark mb-3">Engineering</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Cost Optimization', 'DFM/DFA', 'Supply Chain', 'AI Integration'].map(topic => (
                    <li key={topic} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-emuski-teal rounded-full" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emuski-teal to-emuski-teal-dark rounded-2xl p-8 text-white">
            <EmailSubscription variant="compact" />
          </div>
        </div>
      </section>

      {/* Independent Engineering Articles Section */}
      {engineeringPosts.length > 0 && <EngineeringSection posts={engineeringPosts} />}

      <SuccessStoriesSection />
    </div>
  );
};

// Independent Engineering Section (no state dependency)
const EngineeringSection = ({ posts }: { posts: BlogPost[] }) => (
  <section className="bg-gray-50 py-16">
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-emuski-teal-dark rounded" />
          <h2 className="text-3xl font-bold text-gray-900">Engineering Articles</h2>
        </div>
        <span className="text-sm text-gray-600">{posts.length} articles</span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(0, 6).map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  loading="lazy" 
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-emuski-teal text-white text-xs font-bold rounded">
                  Engineering
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emuski-teal-dark line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                  {getFirstSentence(post.excerpt)}
                </p>
                <div className="flex justify-between text-xs text-gray-500 pt-4 border-t">
                  <span className="font-medium text-gray-700">{post.author}</span>
                  <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length > 6 && (
        <div className="text-center mt-12">
          <Link
            href="/blog?category=Engineering" // You can handle this query param in BlogPage if needed
            className="inline-flex items-center gap-2 px-8 py-4 bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white font-bold rounded-lg transition-colors"
          >
            View All Engineering Articles
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  </section>
);