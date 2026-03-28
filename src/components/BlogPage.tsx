'use client'

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, Calendar, User, Clock, ChevronRight, X } from "lucide-react";
import { BlogPost } from "@/lib/api/blogger";
import { EmailSubscription } from "./EmailSubscription";
import { SuccessStoriesSection } from "./SuccessStoriesSection";
import { tagMatchesSlug, slugToTag } from "@/lib/utils/tags";

const getFirstSentence = (text: string): string => {
  if (!text) return '';
  const match = text.match(/^[^.!?]*[.!?]/);
  return match ? match[0].trim() : text.split('\n')[0].trim().slice(0, 150) + '...';
};

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  manufacturingPosts: BlogPost[];
  engineeringPosts: BlogPost[];
  selectedTag?: string | null;
}

export const BlogPage = ({ manufacturingPosts, engineeringPosts, selectedTag }: BlogPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'pagination' | 'loadmore'>('pagination');
  const [loadedCount, setLoadedCount] = useState(POSTS_PER_PAGE);

  // Primary blog posts (manufacturing-focused)
  const allPosts = useMemo(() => [...manufacturingPosts], [manufacturingPosts]);

  const categories = useMemo(() => {
    const cats = new Set<string>(['All']);
    allPosts.forEach(post => post.category && cats.add(post.category));
    return Array.from(cats);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    // Apply category filter
    if (selectedCategory !== "All") {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    // Apply tag filter if selectedTag is provided
    if (selectedTag) {
      posts = posts.filter(post =>
        post.tags && post.tags.some(tag => tagMatchesSlug(tag, selectedTag))
      );
    }

    return posts;
  }, [allPosts, selectedCategory, selectedTag]);

  const featuredPost = filteredPosts[0];
  const regularPostsAll = filteredPosts.slice(1);
  const totalPages = Math.ceil(regularPostsAll.length / POSTS_PER_PAGE);

  // Posts to display based on view mode
  const displayPosts = viewMode === 'pagination'
    ? regularPostsAll.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
    : regularPostsAll.slice(0, loadedCount);

  const hasMoreToLoad = loadedCount < regularPostsAll.length;

  // Reset page/loaded count when category changes
  useEffect(() => {
    setCurrentPage(1);
    setLoadedCount(POSTS_PER_PAGE);
  }, [selectedCategory]);

  // Smooth scroll to articles on pagination
  const scrollToArticles = useCallback(() => {
    const element = document.getElementById('latest-articles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  // Load more posts handler
  const handleLoadMore = useCallback(() => {
    setLoadedCount(prev => Math.min(prev + POSTS_PER_PAGE, regularPostsAll.length));
    setTimeout(() => scrollToArticles(), 100);
  }, [regularPostsAll.length, scrollToArticles]);

  useEffect(() => {
    if (currentPage > 1) {
      scrollToArticles();
    }
  }, [currentPage, scrollToArticles]);

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
      {/* Hero Header - Following EMUSKI Brand Guidelines */}
      <section className="relative py-16 lg:py-24 overflow-hidden" style={{ backgroundColor: 'rgb(26, 34, 45)' }}>
        {/* Grid Pattern Overlay - Brand Style */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#17B8BA_1px,transparent_1px),linear-gradient(to_bottom,#17B8BA_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-emuski-teal-light text-sm font-semibold uppercase tracking-wider">Manufacturing & Engineering Blog</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Expert Insights for Modern Manufacturing and Engineering
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Practical strategies to reduce costs, improve quality, and implement intelligent manufacturing solutions.
            </p>
            <a
              href="#latest-articles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emuski-teal-darker hover:bg-emuski-teal-dark text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Articles
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Category Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Tag Filter Badge */}
          {selectedTag && (
            <div className="pt-4 pb-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                <span className="text-sm font-medium text-teal-900">
                  Filtered by tag: <strong>{slugToTag(selectedTag)}</strong>
                </span>
                <Link
                  href="/blog"
                  className="p-1 hover:bg-teal-100 rounded transition-colors"
                  aria-label="Clear tag filter"
                >
                  <X className="h-4 w-4 text-teal-700" />
                </Link>
              </div>
            </div>
          )}

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
        <section className="bg-white py-8 lg:py-12">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 rounded-2xl overflow-hidden bg-gradient-to-br from-emuski-teal/5 to-emuski-teal/10 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="relative h-64 lg:h-96 overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                    quality={85}
                  />
                  <span className="absolute top-4 left-4 px-4 py-1.5 bg-emuski-teal text-white text-xs font-bold uppercase rounded-full shadow-lg">
                    Featured
                  </span>
                </div>

                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <span className="inline-block px-4 py-1.5 bg-emuski-teal/10 text-emuski-teal-dark text-xs font-bold uppercase rounded mb-4 w-fit">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-emuski-teal-dark transition-colors leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {getFirstSentence(featuredPost.excerpt)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-emuski-teal-dark" />
                      <span className="font-medium">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emuski-teal-dark" />
                      <time dateTime={featuredPost.publishDate}>
                        {new Date(featuredPost.publishDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emuski-teal-dark" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center text-emuski-teal-dark font-bold group-hover:translate-x-2 transition-transform">
                    Read Article
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </span>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section id="latest-articles" className="bg-gray-50 py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

          {displayPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emuski-teal/30 transition-all duration-300 flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        quality={75}
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

          {/* Load More Button */}
          {viewMode === 'loadmore' && hasMoreToLoad && (
            <div className="mt-16 text-center">
              <button
                onClick={handleLoadMore}
                className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emuski-teal to-emuski-teal-dark hover:from-emuski-teal-dark hover:to-emuski-teal text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>Load More Articles</span>
                <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <p className="mt-4 text-sm text-gray-600">
                Showing <span className="font-bold text-emuski-teal-dark">{displayPosts.length}</span> of <span className="font-bold">{regularPostsAll.length}</span> articles
                {' '}• <span className="font-bold text-emuski-teal-dark">{regularPostsAll.length - displayPosts.length}</span> more to load
              </p>
            </div>
          )}

          {/* Enhanced Pagination with Smart Page Numbers */}
          {viewMode === 'pagination' && totalPages > 1 && (
            <nav className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6" aria-label="Pagination">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-emuski-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                ← Previous
              </button>

              {/* Page Numbers - Smart Display */}
              <div className="flex items-center gap-2">
                {(() => {
                  const pages: (number | string)[] = [];
                  const showEllipsis = totalPages > 7;

                  if (!showEllipsis) {
                    // Show all pages if 7 or fewer
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Smart pagination: Always show first, last, current, and nearby pages
                    // Pattern: 1 ... 4 5 [6] 7 8 ... 20

                    // Always show first page
                    pages.push(1);

                    if (currentPage > 3) {
                      pages.push('ellipsis-start');
                    }

                    // Show pages around current page
                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 2) {
                      pages.push('ellipsis-end');
                    }

                    // Always show last page
                    if (totalPages > 1) {
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => {
                    if (typeof page === 'string') {
                      // Ellipsis
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

                    // Page number button
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
      </section>


      {/* Independent Engineering Articles Section */}
      {engineeringPosts.length > 0 && <EngineeringSection posts={engineeringPosts} />}

      <SuccessStoriesSection />

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
    </div>
  );
};

// Independent Engineering Section with Featured Post and Pagination
const EngineeringSection = ({ posts }: { posts: BlogPost[] }) => {
  const [currentEngineeringPage, setCurrentEngineeringPage] = useState(1);
  const ENGINEERING_POSTS_PER_PAGE = 6;

  if (posts.length === 0) return null;

  const featuredEngineeringPost = posts[0];
  const allRegularEngineeringPosts = posts.slice(1);
  const totalEngineeringPages = Math.ceil(allRegularEngineeringPosts.length / ENGINEERING_POSTS_PER_PAGE);
  
  const regularEngineeringPosts = allRegularEngineeringPosts.slice(
    (currentEngineeringPage - 1) * ENGINEERING_POSTS_PER_PAGE, 
    currentEngineeringPage * ENGINEERING_POSTS_PER_PAGE
  );

  return (
    <section className="bg-gray-50 py-16 border-t border-gray-200" aria-labelledby="cost-engineering-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Navigation Header */}
        <div className="flex items-center justify-between py-5 border-b border-gray-200 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Precision Engineering Blogs</h2>
            <p className="text-gray-600 mt-2">Expert insights on cost optimization, VAVE, and engineering excellence</p>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button className="relative text-sm font-medium transition-colors pb-1 text-emuski-teal-dark after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emuski-teal-dark" aria-current="page">
              All
            </button>
            <button className="relative text-sm font-medium transition-colors pb-1 text-gray-600 hover:text-emuski-teal-dark">
              Cost Optimization
            </button>
            <button className="relative text-sm font-medium transition-colors pb-1 text-gray-600 hover:text-emuski-teal-dark">
              VAVE
            </button>
            <button className="relative text-sm font-medium transition-colors pb-1 text-gray-600 hover:text-emuski-teal-dark">
              DFM/DFA
            </button>
            <button className="relative text-sm font-medium transition-colors pb-1 text-gray-600 hover:text-emuski-teal-dark">
              Supply Chain
            </button>
            <button className="relative text-sm font-medium transition-colors pb-1 text-gray-600 hover:text-emuski-teal-dark">
              AI Integration
            </button>
            <button className="relative text-sm font-medium transition-colors pb-1 text-gray-600 hover:text-emuski-teal-dark">
              Engineering Excellence
            </button>
          </div>
          <button className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Filter by category" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter h-5 w-5 text-gray-700">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>

        {/* Featured Engineering Post */}
        <div className="mb-12">
          <Link href={`/blog/${featuredEngineeringPost.slug}`} className="block group">
            <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 rounded-2xl overflow-hidden bg-gradient-to-br from-emuski-teal/5 to-emuski-teal/10 hover:shadow-2xl transition-all duration-300 border border-gray-200">
              <div className="relative h-64 lg:h-96 overflow-hidden">
                <Image
                  src={featuredEngineeringPost.image}
                  alt={featuredEngineeringPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  quality={85}
                />
                <span className="absolute top-4 left-4 px-4 py-1.5 bg-emuski-teal-darker text-white text-xs font-bold uppercase rounded-full shadow-lg">
                  Featured Engineering
                </span>
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block px-4 py-1.5 bg-emuski-teal/10 text-emuski-teal-dark text-xs font-bold uppercase rounded mb-4 w-fit">
                  {featuredEngineeringPost.category || 'Engineering'}
                </span>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 group-hover:text-emuski-teal-dark transition-colors leading-tight">
                  {featuredEngineeringPost.title}
                </h3>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {getFirstSentence(featuredEngineeringPost.excerpt)}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emuski-teal-dark" />
                    <span className="font-medium">{featuredEngineeringPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emuski-teal-dark" />
                    <time dateTime={featuredEngineeringPost.publishDate}>
                      {new Date(featuredEngineeringPost.publishDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emuski-teal-dark" />
                    <span>{featuredEngineeringPost.readTime}</span>
                  </div>
                </div>

                <span className="inline-flex items-center text-emuski-teal-dark font-bold text-lg group-hover:translate-x-2 transition-transform">
                  Read Engineering Insights
                  <ChevronRight className="h-6 w-6 ml-2" />
                </span>
              </div>
            </article>
          </Link>
        </div>

        {/* Regular Engineering Posts Grid */}
        {regularEngineeringPosts.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">More Precision Engineering Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularEngineeringPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emuski-teal/30 transition-all h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        quality={75}
                      />
                      <span className="absolute top-4 left-4 px-3 py-1.5 bg-emuski-teal-darker text-white text-xs font-bold rounded shadow-md">
                        Engineering
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emuski-teal-dark transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                        {getFirstSentence(post.excerpt)}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">{post.author}</span>
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <time dateTime={post.publishDate} className="text-gray-500">
                          {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </time>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Engineering Pagination */}
        {totalEngineeringPages > 1 && (
          <nav className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6" aria-label="Engineering Pagination">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentEngineeringPage(p => Math.max(1, p - 1))}
              disabled={currentEngineeringPage === 1}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-emuski-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {(() => {
                const pages: (number | string)[] = [];
                const showEllipsis = totalEngineeringPages > 7;

                if (!showEllipsis) {
                  // Show all pages if 7 or fewer
                  for (let i = 1; i <= totalEngineeringPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Smart pagination logic
                  pages.push(1);

                  if (currentEngineeringPage > 3) {
                    pages.push('ellipsis-start');
                  }

                  const startPage = Math.max(2, currentEngineeringPage - 1);
                  const endPage = Math.min(totalEngineeringPages - 1, currentEngineeringPage + 1);

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }

                  if (currentEngineeringPage < totalEngineeringPages - 2) {
                    pages.push('ellipsis-end');
                  }

                  if (totalEngineeringPages > 1) {
                    pages.push(totalEngineeringPages);
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
                      onClick={() => setCurrentEngineeringPage(page)}
                      className={`relative w-12 h-12 rounded-lg font-bold transition-all ${
                        currentEngineeringPage === page
                          ? 'bg-gradient-to-br from-emuski-teal to-emuski-teal-dark text-white shadow-lg scale-110'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-emuski-teal hover:text-emuski-teal-dark hover:scale-105'
                      }`}
                      aria-current={currentEngineeringPage === page ? 'page' : undefined}
                      aria-label={`Page ${page}`}
                    >
                      {page}
                      {currentEngineeringPage === page && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full opacity-80" />
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentEngineeringPage(p => Math.min(totalEngineeringPages, p + 1))}
              disabled={currentEngineeringPage === totalEngineeringPages}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-emuski-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              Next →
            </button>
          </nav>
        )}

      </div>
    </section>
  );
};