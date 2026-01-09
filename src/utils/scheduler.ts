/**
 * Task Scheduler utility to break up long-running tasks
 * and reduce main-thread blocking
 */

/**
 * Yields control back to the browser's event loop
 * Prevents blocking the main thread during heavy computation
 */
export function yieldToMain(): Promise<void> {
  return new Promise(resolve => {
    if ('scheduler' in window && 'yield' in (window as any).scheduler) {
      // Use Scheduler API if available (Chrome 94+)
      (window as any).scheduler.yield().then(resolve);
    } else if ('requestIdleCallback' in window) {
      // Fall back to requestIdleCallback
      requestIdleCallback(() => resolve(), { timeout: 50 });
    } else {
      // Fall back to setTimeout
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Break up a large array operation into smaller chunks
 * to avoid blocking the main thread
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize: number = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    // Process chunk
    for (const item of chunk) {
      results.push(processor(item));
    }

    // Yield to main thread if not the last chunk
    if (i + chunkSize < items.length) {
      await yieldToMain();
    }
  }

  return results;
}

/**
 * Debounce function to limit execution frequency
 * Reduces unnecessary re-renders and computations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function to limit execution rate
 * Prevents excessive function calls during scroll/resize
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
