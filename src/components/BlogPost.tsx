'use client'

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin, Facebook, Mail, Menu, Share2, Bookmark, Clock, Calendar, ChevronRight } from "lucide-react";
import { BlogPost } from "@/lib/api/blogger";
import "../styles/blog-content.css";

interface BlogPostComponentProps {
  post: BlogPost;
  allPosts: BlogPost[];
}

export const BlogPostComponent = ({ post, allPosts }: BlogPostComponentProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const tocNavRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get next 3 manufacturing-related blog posts to feature
  const nextPosts = useMemo(() => {
    if (!post) return [];

    // Filter for manufacturing-related categories
    const manufacturingCategories = ['Manufacturing', 'Engineering', 'Lean Manufacturing', 'Quality Control', 'Production', 'Industrial'];

    return allPosts
      .filter(p => {
        // Exclude current post
        if (p.id === post.id) return false;

        // Include if category matches manufacturing-related categories
        return manufacturingCategories.some(cat =>
          p.category.toLowerCase().includes(cat.toLowerCase())
        );
      })
      .slice(0, 3); // Get first 3 manufacturing posts
  }, [allPosts, post]);

  // Generate TOC from actual rendered DOM after content is mounted
  const [tableOfContents, setTableOfContents] = useState<{ id: string; text: string; level: number }[]>([]);

  // Scroll progress tracking - optimized to prevent scroll conflicts
  useEffect(() => {
    let ticking = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (documentHeight > 0) {
        const scrollPercent = (scrollTop / documentHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
      ticking = false;
    };

    // Use requestAnimationFrame for smooth, performant scroll tracking
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
      ticking = false;
    };
  }, []);

  // Improved section detection using IntersectionObserver - NO DEBOUNCE to prevent scroll loop
  useEffect(() => {
    if (!contentRef.current || !isMounted) return;

    const headings = contentRef.current.querySelectorAll('h2[id], h3[id]');
    if (headings.length === 0) return;

    // Simplified configuration to prevent scroll conflicts and looping
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -80% 0px', // Conservative: only highlight when near top of viewport
      threshold: 0 // Single threshold to minimize callback frequency
    };

    // Direct callback WITHOUT debouncing - debouncing was causing the scroll loop
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Only process if we're not currently programmatically scrolling
      if ((window as any).__isScrollingProgrammatically) return;

      // Find the first intersecting entry (topmost visible heading)
      const intersecting = entries.filter(entry => entry.isIntersecting);
      if (intersecting.length > 0) {
        // Use the first one (topmost)
        setActiveSection(intersecting[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      observer.disconnect();
    };
  }, [isMounted, post]);

  // REMOVED: Client-side metadata manipulation
  // Metadata is now handled server-side via generateMetadata in page.tsx
  // This prevents canonical tags from appearing outside <head> and improves SEO

  useEffect(() => {
    if (post && contentRef.current && isMounted) {
      // Use requestAnimationFrame to prevent blocking scroll
      requestAnimationFrame(() => {
        if (!contentRef.current) return;

        // Only assign IDs to h2 and h3 (matching TOC), and only to non-empty ones
        const headingElements = contentRef.current.querySelectorAll('h2, h3');
        let validIndex = 0;
        const tocItems: { id: string; text: string; level: number }[] = [];

        headingElements.forEach((heading) => {
          const text = (heading.textContent || '').trim();

          // Only assign ID to headings with actual text content
          if (text && !heading.id) {
            heading.id = `heading-${validIndex}`;
            validIndex++;
          }

          // Add to TOC if it has text and ID
          if (text && heading.id) {
            const level = parseInt(heading.tagName.substring(1));
            tocItems.push({ id: heading.id, text, level });
          }

          // Make FAQ questions extra bold - ONLY if it's an actual question with "?"
          const lowerText = text.toLowerCase();

          // Only apply extra bold if:
          // 1. Contains a question mark AND starts with question words, OR
          // 2. Explicitly mentions "FAQ" or "Frequently Asked"
          const isQuestion = text.includes('?') && (
            lowerText.startsWith('what ') ||
            lowerText.startsWith('how ') ||
            lowerText.startsWith('why ') ||
            lowerText.startsWith('when ') ||
            lowerText.startsWith('where ') ||
            lowerText.startsWith('who ') ||
            lowerText.startsWith('can ') ||
            lowerText.startsWith('is ') ||
            lowerText.startsWith('are ') ||
            lowerText.startsWith('does ') ||
            lowerText.startsWith('do ')
          );

          const isFAQSection = lowerText.includes('faq') || lowerText.includes('frequently asked');

          if (isQuestion || isFAQSection) {
            (heading as HTMLElement).style.fontWeight = '900';
            (heading as HTMLElement).style.color = '#171A22';
            heading.classList.add('faq-question');

            // Ensure inner content is bold
            const allElements = heading.querySelectorAll('*');
            allElements.forEach(element => {
              (element as HTMLElement).style.fontWeight = '900';
            });

            // If there's no strong tag, wrap the content
            if (!heading.querySelector('strong')) {
              const innerHTML = heading.innerHTML;
              heading.innerHTML = `<strong>${innerHTML}</strong>`;
            }
          }
        });

        // Update TOC after all IDs are assigned
        setTableOfContents(tocItems);
      });
    }
  }, [post, isMounted]);

  // Disabled auto-scroll for TOC to prevent scroll conflicts
  // The TOC will still highlight active sections without interfering with page scroll

  // REMOVED: Body scroll lock that was causing scroll jumping
  // The TOC overlay now handles scroll behavior better without interfering with body scroll

  // Generate comprehensive structured data for MAXIMUM SEO
  const wordCount = post.fullContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute

  // Extract FAQ questions from content for FAQ schema
  const extractFAQs = () => {
    if (typeof document === 'undefined' || !isMounted) return [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.fullContent;
    const faqQuestions: Array<{question: string, answer: string}> = [];

    // Find headings that look like questions
    const headings = tempDiv.querySelectorAll('h2, h3, h4');
    headings.forEach((heading) => {
      const text = heading.textContent || '';
      if (text.includes('?')) {
        let answer = '';
        let nextEl = heading.nextElementSibling;
        while (nextEl && !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextEl.tagName)) {
          answer += nextEl.textContent + ' ';
          nextEl = nextEl.nextElementSibling;
        }
        if (answer.trim()) {
          faqQuestions.push({
            question: text.trim(),
            answer: answer.trim().substring(0, 500)
          });
        }
      }
    });
    return faqQuestions;
  };

  const faqs = useMemo(() => extractFAQs(), [post, isMounted]);

  // ENHANCED Article Schema with ALL SEO fields
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://www.emuski.com/blog/${post.slug}#article`,
    "headline": post.title,
    "alternativeHeadline": post.excerpt,
    "description": post.metaDescription || post.excerpt,
    "image": {
      "@type": "ImageObject",
      "@id": `https://www.emuski.com/blog/${post.slug}#primaryimage`,
      "url": post.image,
      "width": 1200,
      "height": 630,
      "caption": post.title
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Person",
      "@id": "https://www.emuski.com/#author",
      "name": post.author,
      "url": "https://www.emuski.com/about",
      "image": {
        "@type": "ImageObject",
        "url": post.authorImage || "https://www.emuski.com/assets/authors/default.jpg",
        "caption": post.author
      },
      "jobTitle": "Manufacturing Expert",
      "worksFor": {
        "@type": "Organization",
        "name": "EMUSKI"
      }
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://www.emuski.com/#organization",
      "name": "EMUSKI",
      "url": "https://www.emuski.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.emuski.com/logo.webp",
        "width": 250,
        "height": 60
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-86670-88060",
        "contactType": "Customer Service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.emuski.com/blog/${post.slug}`
    },
    "keywords": post.tags?.join(", "),
    "articleSection": post.category,
    "articleBody": post.fullContent.replace(/<[^>]*>/g, '').substring(0, 1000),
    "wordCount": wordCount,
    "timeRequired": `PT${readingTimeMinutes}M`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "url": `https://www.emuski.com/blog/${post.slug}`,
    "about": {
      "@type": "Thing",
      "name": post.category
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".article-content"]
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.emuski.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.emuski.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category,
        "item": `https://www.emuski.com/blog?category=${encodeURIComponent(post.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `https://www.emuski.com/blog/${post.slug}`
      }
    ]
  };

  // FAQ Schema
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://www.emuski.com/blog/${post.slug}`,
    "url": `https://www.emuski.com/blog/${post.slug}`,
    "name": post.title,
    "description": post.metaDescription || post.excerpt,
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.emuski.com/#website",
      "url": "https://www.emuski.com",
      "name": "EMUSKI Manufacturing Solutions"
    },
    "primaryImageOfPage": {
      "@id": `https://www.emuski.com/blog/${post.slug}#primaryimage`
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "ReadAction",
      "target": [`https://www.emuski.com/blog/${post.slug}`]
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const scrollToSection = (id: string) => {
    // Close TOC on mobile after clicking a section
    setTocOpen(false);

    // Set flag to prevent IntersectionObserver from interfering during programmatic scroll
    (window as any).__isScrollingProgrammatically = true;

    // Use a slight delay to ensure TOC closes smoothly before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 120; // Offset to prevent overlap with sticky navbar
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const targetPosition = elementPosition - offset;

        // Temporarily disable CSS smooth scroll to prevent conflicts
        const htmlElement = document.documentElement;
        const originalScrollBehavior = htmlElement.style.scrollBehavior;
        htmlElement.style.scrollBehavior = 'auto';

        // Instant scroll for precision
        window.scrollTo({
          top: targetPosition,
          behavior: 'auto' // Use instant scroll to prevent loop
        });

        // Restore original scroll behavior
        htmlElement.style.scrollBehavior = originalScrollBehavior;

        // Clear the programmatic scroll flag after a short delay
        setTimeout(() => {
          (window as any).__isScrollingProgrammatically = false;
        }, 150);
      } else {
        (window as any).__isScrollingProgrammatically = false;
      }
    }, 50);
  };

  // Prevent body scroll when TOC is open on mobile - IMPROVED
  useEffect(() => {
    if (tocOpen) {
      // Store current scroll position before locking
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position when unlocking
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [tocOpen]);

  return (
    <article ref={articleRef} className="min-h-screen bg-white" itemScope itemType="https://schema.org/Article">
      {/* Article Schema - PRIMARY SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb Schema - Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* FAQ Schema - If FAQs exist */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* WebPage Schema - Additional Context */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Meta tags for social sharing */}
      <meta itemProp="name" content={post.title} />
      <meta itemProp="description" content={post.metaDescription || post.excerpt} />
      <meta itemProp="image" content={post.image} />
      <meta itemProp="datePublished" content={post.publishDate} />
      <meta itemProp="author" content={post.author} />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 transition-all duration-150 ease-out shadow-sm"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 md:right-8 bottom-32 z-[100] flex flex-col gap-3">
        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-teal-600 transition-all hover:scale-110"
            aria-label="Share article"
          >
            <Share2 className="h-5 w-5" />
          </button>
          
          {showShareMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 min-w-[200px] animate-in fade-in slide-in-from-bottom-4 duration-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Share Article</p>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="text-sm font-medium">LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-500 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="text-sm font-medium">Twitter</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleShare('email')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl border transition-all hover:scale-110 flex items-center justify-center ${
            isBookmarked 
              ? 'bg-teal-600 text-white border-teal-600' 
              : 'bg-white text-gray-700 hover:text-teal-600 border-gray-200'
          }`}
          aria-label="Bookmark article"
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-teal-600 transition-all hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowLeft className="h-5 w-5 rotate-90" />
        </button>
      </div>

      {/* Mobile TOC Toggle - Enhanced for better visibility */}
      <button
        onClick={() => setTocOpen(!tocOpen)}
        className="lg:hidden fixed left-4 bottom-32 z-[100] flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 border border-teal-500"
        aria-label="Open table of contents"
      >
        <Menu className="h-5 w-5" />
        <span className="text-sm font-semibold">Contents</span>
      </button>

      {/* Header */}
      <section className="bg-white pt-24 pb-6 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 max-w-[1440px]">
          <div className="max-w-[885px] mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-teal-600 transition-colors">Home</Link></li>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li><Link href="/blog" className="hover:text-teal-600 transition-colors">Blog</Link></li>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li className="text-gray-900 font-medium line-clamp-1">{post.title}</li>
              </ol>
            </nav>

            {/* Category Badge */}
            <div className="mb-4 sm:mb-5">
              <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 text-sm font-semibold rounded-full border border-teal-200">
                {post.category}
              </span>
            </div>

            {/* Title - SEO Optimized */}
            <h1
              className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-black leading-[1.15] mb-5 sm:mb-6 text-[#171A22] tracking-tight"
              itemProp="headline"
            >
              {post.title}
            </h1>

            {/* Excerpt - SEO Description */}
            {post.excerpt && (
              <p
                className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 font-normal"
                itemProp="description"
              >
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta Info - SEO Optimized */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
                <img
                  src={post.authorImage || '/assets/authors/default.jpg'}
                  alt={post.author}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-teal-100"
                  loading="lazy"
                  itemProp="image"
                />
                <div>
                  <p className="font-bold text-[#171A22] text-base sm:text-lg" itemProp="name">{post.author}</p>
                  <p className="text-xs sm:text-sm text-gray-600" itemProp="jobTitle">Manufacturing Expert</p>
                </div>
              </div>

              <div className="h-10 w-px bg-gray-300 hidden sm:block"></div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  <time dateTime={post.publishDate} className="font-medium" itemProp="datePublished">
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <meta itemProp="dateModified" content={post.publishDate} />
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span className="font-medium">{post.readTime}</span>
                  <meta itemProp="timeRequired" content={`PT${readingTimeMinutes}M`} />
                </div>
              </div>
            </div>

            {/* Featured Image - SEO Optimized */}
            <div className="mb-0 relative group" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover rounded-xl shadow-lg border border-gray-200 transition-transform duration-300 group-hover:scale-[1.01]"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                loading="eager"
                fetchPriority="high"
                itemProp="url contentUrl"
              />
              <meta itemProp="width" content="1200" />
              <meta itemProp="height" content="630" />
              <meta itemProp="caption" content={post.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="relative bg-white">
        <section className="pt-4 sm:pt-6 md:pt-8 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-16 max-w-[1440px]">
            <div className="lg:grid lg:grid-cols-[885px_1fr] lg:gap-12 xl:gap-16">
              {/* Main Content */}
              <div ref={mainContentRef} className="article-main-content w-full">
                <div className="bg-white pt-0">
                  {/* Article Content - SEO Optimized */}
                  <div
                    ref={contentRef}
                    itemProp="articleBody"
                    className="article-content prose prose-base sm:prose-lg max-w-none
                      prose-headings:font-extrabold prose-headings:text-[#171A22] prose-headings:scroll-mt-24
                      prose-h1:text-[28px] sm:prose-h1:text-[36px] lg:prose-h1:text-[42px] prose-h1:leading-[1.2] prose-h1:mt-8 sm:prose-h1:mt-12 prose-h1:mb-4 sm:prose-h1:mb-6 prose-h1:font-black
                      prose-h2:text-[24px] sm:prose-h2:text-[28px] lg:prose-h2:text-[32px] prose-h2:leading-[1.3] prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-5 prose-h2:font-extrabold prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 sm:prose-h2:pb-3
                      prose-h3:text-[20px] sm:prose-h3:text-[22px] lg:prose-h3:text-[24px] prose-h3:leading-[1.4] prose-h3:mt-6 sm:prose-h3:mt-10 prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:font-extrabold
                      prose-h4:text-[18px] sm:prose-h4:text-[20px] prose-h4:leading-[1.4] prose-h4:mt-6 sm:prose-h4:mt-8 prose-h4:mb-2 sm:prose-h4:mb-3 prose-h4:font-extrabold
                      prose-h5:text-[16px] sm:prose-h5:text-[18px] prose-h5:leading-[1.5] prose-h5:mt-5 sm:prose-h5:mt-6 prose-h5:mb-2 prose-h5:font-bold
                      prose-h6:text-[15px] sm:prose-h6:text-[16px] prose-h6:leading-[1.5] prose-h6:mt-4 sm:prose-h6:mt-6 prose-h6:mb-2 prose-h6:font-bold
                      prose-p:text-[#171A22] prose-p:leading-[1.6] sm:prose-p:leading-[1.7] prose-p:mb-4 sm:prose-p:mb-5 prose-p:text-[15px] sm:prose-p:text-base
                      prose-a:text-teal-600 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-dotted hover:prose-a:text-teal-700 hover:prose-a:no-underline
                      prose-strong:text-[#171A22] prose-strong:font-black
                      prose-em:text-[#171A22] prose-em:italic
                      prose-ul:my-4 sm:prose-ul:my-5 prose-ul:space-y-2 prose-ul:list-disc prose-ul:pl-5 sm:prose-ul:pl-6
                      prose-ol:my-4 sm:prose-ol:my-5 prose-ol:space-y-2 prose-ol:list-decimal prose-ol:pl-5 sm:prose-ol:pl-6
                      prose-li:text-[#171A22] prose-li:leading-[1.6] sm:prose-li:leading-[1.7] prose-li:text-[15px] sm:prose-li:text-base prose-li:mb-1.5 sm:prose-li:mb-2
                      prose-blockquote:border-l-4 prose-blockquote:border-teal-600 prose-blockquote:bg-[#FFE5CB] prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:pr-4 sm:prose-blockquote:pr-6 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:my-4 sm:prose-blockquote:my-6 prose-blockquote:not-italic prose-blockquote:text-[#171A22] prose-blockquote:rounded-lg
                      prose-code:bg-[#F6F7F8] prose-code:text-teal-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-[#171A22] prose-pre:text-white prose-pre:p-4 sm:prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-4 sm:prose-pre:my-6
                      prose-img:rounded-lg prose-img:border prose-img:border-gray-200 prose-img:my-6 sm:prose-img:my-8 prose-img:w-full prose-img:h-auto
                      prose-table:w-full prose-table:border-collapse prose-table:my-4 sm:prose-table:my-6 prose-table:text-sm sm:prose-table:text-base
                      prose-th:bg-gray-100 prose-th:p-2 sm:prose-th:p-3 prose-th:border prose-th:border-gray-300 prose-th:font-bold prose-th:text-left prose-th:text-xs sm:prose-th:text-sm
                      prose-td:p-2 sm:prose-td:p-3 prose-td:border prose-td:border-gray-300 prose-td:text-xs sm:prose-td:text-sm"
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        let html = post.fullContent;

                        // STEP 1: Preserve bold formatting - Convert all bold indicators to <strong>
                        // This must happen BEFORE we remove inline styles
                        // Handle font-weight in spans, divs, and paragraphs
                        html = html.replace(/<(span|div|p)([^>]*)\s*style="([^"]*font-weight:\s*(?:bold|700|800|900)[^"]*)"([^>]*)>([\s\S]*?)<\/\1>/gi,
                          (_match, tag, before, _style, after, content) => {
                            // If content is not already wrapped in strong/b, wrap it
                            if (!content.includes('<strong>') && !content.includes('<b>')) {
                              return `<${tag}${before}${after}><strong>${content}</strong></${tag}>`;
                            }
                            return `<${tag}${before}${after}>${content}</${tag}>`;
                          });

                        // Convert <b> tags to <strong> FIRST before any other processing
                        html = html.replace(/<b(\s[^>]*)?>/gi, '<strong>');
                        html = html.replace(/<\/b>/gi, '</strong>');

                        // Clean up inline styles but preserve text content
                        html = html.replace(/\sstyle="[^"]*"/gi, '');

                        // HARDENING: strip any stray <title>, <head>, or canonical tags that
                        // might have been copied into the Blogger HTML. These belong in
                        // the document <head>, not inside the article body, and some SEO
                        // crawlers will flag them as "outside <head>" if they appear here.
                        html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '');
                        html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '');
                        html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
                        html = html.replace(/<html[^>]*>|<\/html>|<body[^>]*>|<\/body>/gi, '');

                        // Remove ONLY Google Docs specific attributes (keep other attributes)
                        html = html.replace(/\sface="[^"]*"/gi, '');
                        html = html.replace(/\sdir="ltr"/gi, ''); // Only remove dir="ltr", keep others
                        html = html.replace(/\sid="docs-internal-guid-[^"]*"/gi, '');

                        // EXTRA HARDENING: strip any <meta> tags that may have been
                        // pasted into the article HTML (including meta description
                        // and OG tags). Meta tags belong in <head>; keeping them in
                        // the article body can trigger SEO tools that check for
                        // "meta description outside <head>".
                        html = html.replace(/<meta[^>]*>/gi, '');

                        // First, extract images from anchor tags (Blogger often wraps images in links)
                        html = html.replace(/<a[^>]*>\s*(<img[^>]*>)\s*<\/a>/gi, '$1');

                        // Remove the first image (featured image) to avoid duplication
                        let firstImageRemoved = false;
                        html = html.replace(/<img([^>]*)>/i, (_match, _attrs) => {
                          if (!firstImageRemoved) {
                            firstImageRemoved = true;
                            return ''; // Remove the first image
                          }
                          return _match; // Keep subsequent images
                        });

                        // Clean up images - keep them but remove inline styles and fix attributes
                        html = html.replace(/<img([^>]*)>/gi, (_match, attrs) => {
                          // Extract src attribute - handle both single and double quotes
                          const srcMatch = attrs.match(/src\s*=\s*["']([^"']+)["']/i) ||
                                          attrs.match(/src\s*=\s*([^\s>]+)/i);
                          const altMatch = attrs.match(/alt\s*=\s*["']([^"']+)["']/i);
                          const titleMatch = attrs.match(/title\s*=\s*["']([^"']+)["']/i);

                          if (srcMatch) {
                            let src = srcMatch[1];

                            // Fix Blogger image URLs if needed
                            if (src.includes('blogger.googleusercontent.com') ||
                                src.includes('blogspot.com') ||
                                src.includes('bp.blogspot.com')) {
                              // Remove any size restrictions from Blogger URLs
                              src = src.replace(/\/s\d+(-c)?\//, '/s1600/');
                            }

                            const alt = altMatch ? altMatch[1] : (titleMatch ? titleMatch[1] : '');

                            // Return clean img tag with proper classes
                            return `<img src="${src}" alt="${alt}" class="w-full h-auto rounded-lg border border-gray-200 my-8 object-cover" loading="lazy" onerror="this.style.display='none'" />`;
                          }
                          return '';
                        });

                        // Unwrap separator divs - remove the div but keep all content inside
                        html = html.replace(/<div([^>]*class=["'][^"']*separator[^"']*["'][^>]*)>([\s\S]*?)<\/div>/gi, '$2');

                        // Convert <i> tags to <em> for better semantic HTML
                        html = html.replace(/<i(\s[^>]*)?>([\s\S]+?)<\/i>/gi, '<em>$2</em>');

                        // Ensure FAQ questions have strong tags wrapped
                        // Only wrap if it's a question (contains ?) AND starts with question words
                        html = html.replace(/<(h[2-6])([^>]*)>([\s\S]*?)\?([^<]*)<\/h[2-6]>/gi,
                          (_match, tag, attrs, content, afterQuestion) => {
                            const fullContent = content + '?' + afterQuestion;
                            const lowerContent = fullContent.toLowerCase();

                            // Check if it starts with question words
                            const isQuestion = lowerContent.match(/^\s*(?:what|how|why|when|where|who|can|is|does|are|do)\s/i);
                            const isFAQ = lowerContent.includes('faq') || lowerContent.includes('frequently asked');

                            if (isQuestion || isFAQ) {
                              // If not already wrapped in strong, wrap it
                              if (!fullContent.includes('<strong>')) {
                                return `<${tag}${attrs}><strong>${fullContent}</strong></${tag}>`;
                              }
                            }
                            return _match;
                          });

                        // Clean up span tags - unwrap but preserve content inside
                        html = html.replace(/<span[^>]*>(.*?)<\/span>/gi, (_match, content) => {
                          // Remove the span wrapper but keep all content inside
                          return content;
                        });

                        // IMPORTANT: Do NOT remove divs with classes or content
                        // Only remove divs that are completely empty with no attributes
                        html = html.replace(/<div>\s*<\/div>/gi, '');

                        // Convert divs without classes to semantic elements where appropriate
                        // But preserve all divs with classes as they may be needed for styling

                        // CRITICAL: Only remove paragraphs that are COMPLETELY empty
                        // Do NOT remove paragraphs with any text content, even if they have special characters
                        // This regex only matches <p> tags with absolutely nothing inside, or only whitespace
                        html = html.replace(/<p[^>]*>[\s]*<\/p>/gi, '');
                        html = html.replace(/<p[^>]*>&nbsp;<\/p>/gi, '');
                        html = html.replace(/<p[^>]*><br\s*\/?><\/p>/gi, '');
                        html = html.replace(/<p[^>]*><br\s*\/?>\s*<br\s*\/?><\/p>/gi, '');

                        // Fix list items - unwrap nested p tags
                        html = html.replace(/<li([^>]*)>\s*<p[^>]*>(.*?)<\/p>\s*<\/li>/gi, '<li$1>$2</li>');

                         // Remove unwanted "Pasted text" artifacts from Google Docs
                        html = html.replace(/\[Pasted text #?\d*\s*\+?\d*\s*lines?\]/gi, '');
                        html = html.replace(/\[Pasted text[^\]]*\]/gi, '');

                         // IMPORTANT: Do NOT remove content with specific classes
                        // Only remove schema.org markup that's duplicate
                        // Remove ONLY the schema wrapper divs, but preserve the content inside
                        html = html.replace(/<div[^>]*itemprop="acceptedAnswer"[^>]*itemscope[^>]*itemtype="https:\/\/schema\.org\/Answer"[^>]*>([\s\S]*?)<\/div>/gi, '$1');

                        // Clean nbsp entities and unicode spaces
                        html = html.replace(/&nbsp;/g, ' ');
                        html = html.replace(/\u00a0/g, ' ');

                        // Remove excessive line breaks
                        html = html.replace(/(<br\s*\/?>){3,}/gi, '<br /><br />');

                         // No additional cleanup needed - targeted removal above should handle duplicates

                        // Normalize multiple spaces
                        html = html.replace(/\s{2,}/g, ' ');

                        // Remove internal links with no anchor text (e.g. <a href="/..."></a>)
                        // This helps avoid "internal outlinks with no anchor text" SEO warnings from imported Blogger HTML
                        html = html.replace(/<a([^>]*)>\s*<\/a>/gi, '');

                        // Remove ONLY truly empty heading and list tags (no content at all)
                        // Be conservative - only remove if there's truly nothing inside
                        html = html.replace(/<(h[1-6])[^>]*>[\s\n\r]*<\/\1>/gi, '');
                        html = html.replace(/<li[^>]*>[\s\n\r]*<\/li>/gi, '');

                        // Trim whitespace between tags but keep single space
                        html = html.replace(/>\s+</g, '> <');


                        return html;
                      })()
                    }}
                  />

                  {/* Tags - SEO Keywords */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Related Topics</h3>
                      <div className="flex flex-wrap gap-2" itemProp="keywords">
                        {post.tags.map((tag, index) => (
                          <a
                            key={index}
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded hover:bg-teal-100 transition-colors"
                            rel="tag"
                          >
                            {tag}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Author Bio Section - SEO Enhanced */}
                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <div className="flex items-start gap-4 p-6 bg-[#F6F7F8] rounded-lg" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <img
                        src={post.authorImage || '/assets/authors/default.jpg'}
                        alt={post.author}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        loading="lazy"
                        itemProp="image"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-[#171A22] mb-2">About the Author</h4>
                        <p className="font-semibold text-[#171A22] mb-1" itemProp="name">{post.author}</p>
                        <p className="text-sm text-gray-600 leading-relaxed" itemProp="description">
                          Expert in manufacturing excellence and precision engineering with over 10 years of industry experience.
                        </p>
                        <meta itemProp="jobTitle" content="Manufacturing Expert" />
                        <meta itemProp="url" content="https://www.emuski.com/about" />
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <div className="bg-teal-600 rounded-lg p-8 text-center text-white">
                      <h3 className="text-2xl font-bold mb-3">
                        Ready to Start Your Project?
                      </h3>
                      <p className="text-teal-50 mb-6 leading-relaxed">
                        Get expert precision engineering and manufacturing solutions for your business needs.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/contact">
                          <button className="bg-white text-teal-700 px-6 py-3 rounded font-bold hover:bg-gray-50 transition-colors">
                            Contact Us Today
                          </button>
                        </Link>
                        {/* Use an existing, SEO-optimized services page instead of a non-existent /services route */}
                        <Link href="/manufacturing-services">
                          <button className="bg-teal-700 text-white px-6 py-3 rounded font-bold hover:bg-teal-800 transition-colors border border-teal-500">
                            View Our Services
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Sticky TOC & CTA */}
              <aside
                className={`${
                  tocOpen
                    ? 'fixed inset-0 bg-black/50 z-50 lg:relative lg:bg-transparent'
                    : 'hidden'
                } lg:block`}
                onClick={(e) => {
                  // Close TOC when clicking overlay (mobile)
                  if (e.target === e.currentTarget) {
                    setTocOpen(false);
                  }
                }}
              >
                {/* Sticky Container - Remains fixed while scrolling */}
                <div
                  className={`${
                    tocOpen
                      ? 'fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto p-6 overscroll-contain'
                      : 'lg:sticky lg:top-20 lg:self-start'
                  }`}
                  style={{ maxHeight: 'calc(100vh - 5rem)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Mobile Close Button */}
                  {tocOpen && (
                    <button
                      onClick={() => setTocOpen(false)}
                      className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold hover:bg-gray-200 transition-colors z-10"
                      aria-label="Close table of contents"
                    >
                      ×
                    </button>
                  )}

                  {/* Scrollable Inner Container */}
                  <div className="lg:space-y-4">

                    {/* Table of Contents - Scrollable */}
                    <div className="bg-white lg:border lg:border-gray-200 lg:rounded-lg lg:p-5 lg:max-h-[calc(100vh-28rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <h3 className="text-sm font-bold text-[#171A22] uppercase tracking-wider mb-4 sticky top-0 bg-white pb-2 border-b border-gray-200 z-10">
                        Table of Contents
                      </h3>
                      {isMounted && tableOfContents.length > 0 ? (
                        <nav ref={tocNavRef} className="space-y-0.5">
                          {tableOfContents.map((item, index) => {
                            const isActive = activeSection === item.id;
                            return (
                              <button
                                key={index}
                                data-section={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`block w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200 ${
                                  item.level === 3 ? 'pl-6 text-xs' : 'pl-3'
                                } ${
                                  isActive
                                    ? 'text-teal-700 font-semibold bg-teal-50 border-l-2 border-teal-600'
                                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 border-l-2 border-transparent'
                                }`}
                                aria-current={isActive ? 'true' : 'false'}
                              >
                                <span className="line-clamp-2 leading-snug">{item.text}</span>
                              </button>
                            );
                          })}
                        </nav>
                      ) : (
                        // Loading skeleton
                        <nav className="space-y-2" aria-label="Loading table of contents">
                          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                        </nav>
                      )}
                    </div>

                    {/* Call to Action - Fixed Position */}
                    <div className="hidden lg:block bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg p-5 shadow-xl border border-teal-500">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                          Need Expert Help?
                        </h3>
                        <p className="text-teal-50 text-xs mb-4 leading-relaxed">
                          Get professional manufacturing solutions tailored to your business needs
                        </p>
                        <div className="space-y-2">
                          <a
                            href="/contact"
                            className="block w-full bg-white text-teal-700 px-4 py-2.5 rounded-lg font-bold hover:bg-teal-50 hover:shadow-lg active:scale-95 transition-all text-sm"
                            aria-label="Contact EMUSKI for manufacturing solutions"
                          >
                            Contact Us Now
                          </a>
                          <a
                            href="tel:+918667088060"
                            className="block w-full bg-teal-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-teal-900 hover:shadow-lg active:scale-95 transition-all text-sm border border-teal-600"
                            aria-label="Call EMUSKI at +91-86670-88060"
                          >
                            +91-86670-88060
                          </a>
                        </div>
                        <div className="text-teal-100 text-xs mt-3 space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 bg-teal-300 rounded-full"></span>
                            <span>Free Consultation</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 bg-teal-300 rounded-full"></span>
                            <span>15+ Years Experience</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 bg-teal-300 rounded-full"></span>
                            <span>ISO Certified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {/* Continue Reading - Manufacturing Blogs Section */}
      {nextPosts.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-emuski-teal/5 to-blue-50 border-t border-gray-200">
          <div className="container mx-auto px-6 lg:px-16 max-w-[1440px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Continue Reading - Manufacturing Insights</h2>
              <span className="text-sm text-gray-500">{nextPosts.length} Featured Articles</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nextPosts.map((nextPost) => (
                <Link
                  key={nextPost.id}
                  href={`/blog/${nextPost.slug}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group"
                >
                  <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={nextPost.image}
                        alt={nextPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-2.5 py-1 bg-emuski-teal text-white text-xs font-semibold uppercase tracking-wider rounded">
                          {nextPost.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emuski-teal-dark transition-colors line-clamp-2 leading-tight">
                        {nextPost.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3 leading-relaxed">
                        {nextPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(nextPost.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{nextPost.readTime}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-emuski-teal group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


    </article>
  );
};