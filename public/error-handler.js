/**
 * Production Error Handler - CSP Compliant
 * Handles chunk loading failures and connection errors
 * Designed to work with Content Security Policy nonces
 */

(function() {
  'use strict';
  
  // Track retry attempts to prevent infinite loops
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  // Handle chunk loading failures
  window.addEventListener('error', function(event) {
    const isChunkError = 
      event.message?.includes('Loading chunk') ||
      event.message?.includes('Loading CSS chunk') ||
      event.filename?.includes('.js') && event.message?.includes('Unexpected token') ||
      event.message?.includes('Connection closed');
    
    if (isChunkError && retryCount < MAX_RETRIES) {
      console.warn('Chunk loading error detected, attempting recovery...', event.message);
      retryCount++;
      
      // Clear any cached modules that might be corrupted
      if ('caches' in window) {
        caches.keys().then(function(names) {
          return Promise.all(
            names.map(function(name) {
              return caches.delete(name);
            })
          );
        }).then(function() {
          // Reload after clearing cache
          setTimeout(function() {
            window.location.reload();
          }, 1000);
        }).catch(function() {
          // Fallback reload
          setTimeout(function() {
            window.location.reload();
          }, 1000);
        });
      } else {
        // Fallback reload
        setTimeout(function() {
          window.location.reload();
        }, 1000);
      }
    }
  });
  
  // Handle unhandled promise rejections (connection errors)
  window.addEventListener('unhandledrejection', function(event) {
    const isConnectionError = 
      event.reason?.message?.includes('Connection closed') ||
      event.reason?.message?.includes('Loading chunk') ||
      event.reason?.message?.includes('NetworkError') ||
      event.reason?.message?.includes('Failed to fetch');
    
    if (isConnectionError && retryCount < MAX_RETRIES) {
      console.warn('Connection error detected, attempting recovery...', event.reason);
      event.preventDefault(); // Prevent default error handling
      retryCount++;
      
      setTimeout(function() {
        window.location.reload();
      }, 2000);
    }
  });
  
  // Enhanced module loading error handler for Next.js
  const originalFetch = window.fetch;
  window.fetch = function() {
    return originalFetch.apply(this, arguments).catch(function(error) {
      const isNetworkError = 
        error.message?.includes('NetworkError') ||
        error.message?.includes('Failed to fetch') ||
        error.name === 'TypeError' && error.message?.includes('fetch');
      
      if (isNetworkError && retryCount < MAX_RETRIES) {
        console.warn('Network error during fetch, retrying...', error);
        retryCount++;
        
        // Retry the fetch once more
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            originalFetch.apply(window, arguments)
              .then(resolve)
              .catch(function(retryError) {
                // If retry also fails, reload the page
                console.error('Fetch retry failed, reloading page...', retryError);
                window.location.reload();
                reject(retryError);
              });
          }, 1000);
        });
      }
      
      throw error;
    });
  };
  
  // Handle dynamic import failures (common in Next.js)
  if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
    const originalImport = window.__nextDynamicImport;
    if (originalImport) {
      window.__nextDynamicImport = function() {
        return originalImport.apply(this, arguments).catch(function(error) {
          console.warn('Dynamic import failed, attempting recovery...', error);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(function() {
              window.location.reload();
            }, 1000);
          }
          throw error;
        });
      };
    }
  }
  
  // Reset retry count after successful page load
  window.addEventListener('load', function() {
    setTimeout(function() {
      retryCount = 0;
    }, 5000);
  });
  
})();