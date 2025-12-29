/**
 * Performance utilities for optimizing the portfolio application
 */

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution to once per time period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;
        const src = image.dataset.src;
        if (src) {
          image.src = src;
          image.classList.remove('lazy');
          observer.unobserve(image);
        }
      }
    });
  });

  observer.observe(img);
}

/**
 * Prefetch resources with priority hints
 */
export function prefetchResource(url: string, type: 'script' | 'style' | 'image' | 'fetch' = 'fetch') {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, type: 'script' | 'style' | 'image' | 'font' = 'script') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = type;
  link.href = url;
  if (type === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection information for adaptive loading
 */
export function getConnectionInfo() {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    return {
      effectiveType: conn?.effectiveType || 'unknown',
      saveData: conn?.saveData || false,
      downlink: conn?.downlink || 0,
      rtt: conn?.rtt || 0,
    };
  }
  return {
    effectiveType: 'unknown',
    saveData: false,
    downlink: 0,
    rtt: 0,
  };
}

/**
 * Adaptive loading based on network conditions
 */
export function shouldLoadHeavyContent(): boolean {
  const connection = getConnectionInfo();

  // Don't load heavy content if user has data saver enabled
  if (connection.saveData) return false;

  // Don't load heavy content on slow connections
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return false;
  }

  return true;
}

/**
 * Request Idle Callback polyfill for older browsers
 */
export function requestIdleCallback(callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void, options?: { timeout?: number }): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback as any, options);
  }

  // Fallback for browsers without requestIdleCallback
  return setTimeout(() => {
    const start = Date.now();
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1) as unknown as number;
}

/**
 * Cancel Idle Callback
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Batch DOM reads and writes for better performance
 */
export class DOMBatcher {
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];
  private scheduled = false;

  read(fn: () => void) {
    this.readQueue.push(fn);
    this.schedule();
  }

  write(fn: () => void) {
    this.writeQueue.push(fn);
    this.schedule();
  }

  private schedule() {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      // Execute all reads first
      this.readQueue.forEach(fn => fn());
      this.readQueue = [];

      // Then execute all writes
      this.writeQueue.forEach(fn => fn());
      this.writeQueue = [];

      this.scheduled = false;
    });
  }
}
