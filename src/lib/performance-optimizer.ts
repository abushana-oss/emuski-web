// Performance optimization utilities for 3D CAD viewer
// Industry best practices for web performance

export class PerformanceOptimizer {
  private static readonly PERFORMANCE_MARKS = {
    CAD_LOAD_START: 'cad-load-start',
    CAD_LOAD_END: 'cad-load-end',
    RENDER_START: 'render-start',
    RENDER_END: 'render-end',
    ANALYSIS_START: 'analysis-start',
    ANALYSIS_END: 'analysis-end',
  };

  // Memory management for 3D models
  static optimizeMemoryUsage() {
    // Force garbage collection if available (dev environment)
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }
    
    // Clean up unused textures and geometries
    this.cleanupThreeJSMemory();
  }

  private static cleanupThreeJSMemory() {
    // Clear Three.js cache periodically
    if (typeof window !== 'undefined' && (window as any).THREE) {
      const THREE = (window as any).THREE;
      if (THREE.Cache) {
        THREE.Cache.clear();
      }
    }
  }

  // Lazy loading for 3D components
  static createIntersectionObserver(callback: () => void) {
    if (typeof window === 'undefined') return null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    return observer;
  }

  // Performance monitoring
  static measurePerformance(markName: string, startMark: string) {
    if (typeof window === 'undefined') return;

    try {
      performance.mark(markName);
      performance.measure(`${startMark}-duration`, startMark, markName);
      
      const measure = performance.getEntriesByName(`${startMark}-duration`)[0];
      if (measure) {
          
        // Report to analytics in production
        if (process.env.NODE_ENV === 'production') {
          this.reportToAnalytics(startMark, measure.duration);
        }
      }
    } catch (error) {
    }
  }

  private static reportToAnalytics(metric: string, duration: number) {
    // Report to Google Analytics or other analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_timing', {
        name: metric,
        value: Math.round(duration),
        metric_id: 'cad_viewer_performance',
      });
    }
  }

  // Core Web Vitals optimization
  static optimizeForCoreWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint optimization
    this.optimizeLCP();
    
    // First Input Delay optimization
    this.optimizeFID();
    
    // Cumulative Layout Shift optimization
    this.optimizeCLS();
  }

  private static optimizeLCP() {
    // Preload critical resources - only those used immediately
    const criticalResources = [
      '/assets/emuski-logo-optimized.webp',
    ];

    criticalResources.forEach((resource) => {
      // Check if already preloaded to avoid duplicates
      const existing = document.querySelector(`link[href="${resource}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.includes('.woff2') ? 'font' : 'image';
      
      if (resource.includes('.woff2')) {
        link.crossOrigin = 'anonymous';
      }
      
      // Ensure resource is used by setting up load handlers
      link.onload = () => {
        // Mark as loaded for immediate use
        if (resource.includes('logo')) {
          document.body.setAttribute('data-logo-preloaded', 'true');
        }
      };
      
      // Add error handling
      link.onerror = () => {
        // Remove failed preload to prevent console warnings
        link.remove();
      };
      
      document.head.appendChild(link);
    });
  }

  private static optimizeFID() {
    // Defer non-critical JavaScript
    const deferScripts = () => {
      requestIdleCallback(() => {
        // Load non-critical features
        import('./non-critical-features').catch(() => {
          // Graceful degradation
        });
      });
    };

    if (document.readyState === 'complete') {
      deferScripts();
    } else {
      window.addEventListener('load', deferScripts);
    }
  }

  private static optimizeCLS() {
    // Reserve space for dynamic content
    const reserveSpace = (selector: string, aspectRatio: string) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (!(element as HTMLElement).style.aspectRatio) {
          (element as HTMLElement).style.aspectRatio = aspectRatio;
        }
      });
    };

    // Reserve space for common dynamic elements
    reserveSpace('[data-cad-viewer]', '16/9');
    reserveSpace('[data-analysis-panel]', '1/1');
  }

  // Resource preloading
  static preloadCriticalResources() {
    // Note: Removing API prefetch since it requires authentication
    // and causes 401 errors without proper JWT tokens
    const resources: Array<{ href: string; as: string }> = [
      // Add other non-authenticated resources here if needed
    ];

    resources.forEach(({ href, as }) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    });
  }

  // Bundle size optimization
  static async loadComponentDynamically<T>(
    importFunction: () => Promise<{ default: T }>,
    fallback: T
  ): Promise<T> {
    try {
      const module = await importFunction();
      return module.default;
    } catch (error) {
      return fallback;
    }
  }

  // Image optimization
  static optimizeImages() {
    if (typeof window === 'undefined') return;

    // Use native lazy loading
    const images = document.querySelectorAll('img[data-lazy]');
    images.forEach((img) => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });

    // Implement progressive image loading
    this.implementProgressiveImageLoading();
  }

  private static implementProgressiveImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // Network optimization
  static optimizeNetworkRequests() {
    // Implement request deduplication
    const requestCache = new Map<string, Promise<any>>();

    return {
      fetch: async (url: string, options?: RequestInit) => {
        const cacheKey = `${url}:${JSON.stringify(options)}`;
        
        if (requestCache.has(cacheKey)) {
          return requestCache.get(cacheKey);
        }

        const request = fetch(url, options);
        requestCache.set(cacheKey, request);

        // Clean up cache after request completes
        request.finally(() => {
          setTimeout(() => {
            requestCache.delete(cacheKey);
          }, 5000);
        });

        return request;
      },
    };
  }

  // Service Worker registration
  static registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Service worker registered successfully
        })
        .catch((error) => {
          // Service worker registration failed
        });
    });
  }
}