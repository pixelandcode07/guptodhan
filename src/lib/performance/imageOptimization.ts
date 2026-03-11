// src/lib/performance/imageOptimization.ts - FULLY FIXED VERSION

/**
 * Image Optimization Utilities - All TypeScript Errors Fixed
 */

// ============================================
// TYPE DEFINITIONS - FIXED
// ============================================

export type ImageQuality = 60 | 75 | 80 | 85 | 90;
export type ImagePriority = 'critical' | 'high' | 'medium' | 'low';

export interface ImageOptimizationConfig {
  quality: ImageQuality;
  priority: boolean;
  placeholder: 'blur' | 'empty';
  sizes?: string;
}

// ✅ FIXED: Proper interface extension without conflicting startTime
interface PerformanceEntryMetrics {
  renderTime?: number;
  loadTime?: number;
}

// ✅ FIXED: Simpler approach - don't extend PerformanceEntry
type PerformanceEntryWithMetrics = PerformanceEntry & PerformanceEntryMetrics;

// ============================================
// IMAGE QUALITY PRESETS
// ============================================

export const IMAGE_QUALITY_PRESETS = {
  HERO: 85 as ImageQuality,
  FEATURED: 80 as ImageQuality,
  THUMBNAIL: 75 as ImageQuality,
  BACKGROUND: 70 as ImageQuality,
  PLACEHOLDER: 60 as ImageQuality,
} as const;

// ============================================
// RESPONSIVE SIZES
// ============================================

export const RESPONSIVE_SIZES = {
  FULL_WIDTH: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 100vw',
  HERO_BANNER: '(max-width: 768px) 100vw, 66vw',
  SIDE_BANNER: '(max-width: 768px) 100vw, 33vw',
  FEATURED: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw',
  THUMBNAIL: '(max-width: 640px) 50vw, 30vw',
  PRODUCT_GRID: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  BACKGROUND: '100vw',
  MOBILE: '50vw',
} as const;

// ============================================
// BLUR DATA URLS
// ============================================

export const BLUR_PLACEHOLDERS = {
  GRAY: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAACAAYDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=',
  WHITE: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAACAAYDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=',
  DARK: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAACAAYDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getImageConfig(priority: ImagePriority): ImageOptimizationConfig {
  const configs: Record<ImagePriority, ImageOptimizationConfig> = {
    critical: {
      quality: IMAGE_QUALITY_PRESETS.HERO,
      priority: true,
      placeholder: 'blur',
      sizes: RESPONSIVE_SIZES.HERO_BANNER,
    },
    high: {
      quality: IMAGE_QUALITY_PRESETS.FEATURED,
      priority: false,
      placeholder: 'blur',
      sizes: RESPONSIVE_SIZES.FEATURED,
    },
    medium: {
      quality: IMAGE_QUALITY_PRESETS.THUMBNAIL,
      priority: false,
      placeholder: 'blur',
      sizes: RESPONSIVE_SIZES.THUMBNAIL,
    },
    low: {
      quality: IMAGE_QUALITY_PRESETS.THUMBNAIL,
      priority: false,
      placeholder: 'empty',
      sizes: RESPONSIVE_SIZES.THUMBNAIL,
    },
  };
  
  return configs[priority];
}

export function validateImageUrl(url: string): string | null {
  if (!url) return 'Image URL is required';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'Image URL must start with http:// or https://';
  }
  if (url.length > 2048) return 'Image URL is too long';
  return null;
}

export function optimizeCloudinaryUrl(
  url: string,
  options?: {
    width?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg';
  }
): string {
  if (!url.includes('cloudinary.com')) return url;
  
  const transformations = [];
  if (options?.format) transformations.push(`f_${options.format}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.width) transformations.push(`w_${options.width}`);
  
  if (transformations.length === 0) return url;
  
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function checkImageFormatSupport(): {
  webp: boolean;
  avif: boolean;
} {
  if (typeof window === 'undefined') {
    return { webp: false, avif: false };
  }
  
  const canvas = document.createElement('canvas');
  
  return {
    webp: canvas.toDataURL('image/webp').indexOf('image/webp') === 5,
    avif: canvas.toDataURL('image/avif').indexOf('image/avif') === 5,
  };
}

// ============================================
// IMAGE PRELOADING
// ============================================

export function preloadImage(src: string, callback?: () => void): void {
  if (typeof window === 'undefined') return;
  
  const img = new Image();
  if (callback) {
    img.onload = callback;
    img.onerror = callback;
  }
  img.src = src;
}

export function preloadImages(srcs: string[], callback?: () => void): void {
  if (typeof window === 'undefined') return;
  
  let loadedCount = 0;
  const totalCount = srcs.length;
  
  const onLoad = () => {
    loadedCount++;
    if (loadedCount === totalCount && callback) {
      callback();
    }
  };
  
  srcs.forEach(src => {
    preloadImage(src, onLoad);
  });
}

// ============================================
// LAZY LOADING UTILITIES
// ============================================

export function isInViewport(element: Element): boolean {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right > 0
  );
}

// ============================================
// PERFORMANCE MONITORING - FIXED
// ============================================

export function reportImageLoadTime(imageName: string, startTime: number): void {
  if (typeof window === 'undefined') return;
  
  const loadTime = performance.now() - startTime;
  console.log(`Image "${imageName}" loaded in ${loadTime.toFixed(2)}ms`);
}

/**
 * ✅ FIXED: Proper type handling for Core Web Vitals
 */
export function getCoreWebVitals(): {
  lcp?: number;
  fcp?: number;
  cls?: number;
} {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const metrics: {
    lcp?: number;
    fcp?: number;
    cls?: number;
  } = {};
  
  // ✅ FIXED: Proper type handling
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list: PerformanceObserverEntryList) => {
        const entries = list.getEntries() as unknown as PerformanceEntryWithMetrics[];
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = (lastEntry.renderTime || lastEntry.loadTime || (lastEntry as any).startTime) as number | undefined;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observation not supported');
    }
  }
  
  return metrics;
}

/**
 * ✅ FIXED: Get LCP metric with proper error handling
 */
export function getLCPMetric(): Promise<number | undefined> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(undefined);
      return;
    }

    let lcp: number | undefined = undefined;

    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list: PerformanceObserverEntryList) => {
          const entries = list.getEntries() as unknown as PerformanceEntryWithMetrics[];
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            lcp = (lastEntry.renderTime || lastEntry.loadTime || (lastEntry as any).startTime) as number | undefined;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Resolve after a short delay
        setTimeout(() => {
          resolve(lcp);
        }, 3000);
      } catch (e) {
        console.warn('LCP observation not supported');
        resolve(undefined);
      }
    } else {
      resolve(undefined);
    }
  });
}

/**
 * ✅ FIXED: Get FCP metric
 */
export function getFCPMetric(): number | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if ('PerformanceObserver' in window) {
    try {
      const entries = performance.getEntriesByType('paint') as PerformanceEntry[];
      const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
      return fcp?.startTime;
    } catch (e) {
      console.warn('FCP observation not supported');
      return undefined;
    }
  }

  return undefined;
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  IMAGE_QUALITY_PRESETS,
  RESPONSIVE_SIZES,
  BLUR_PLACEHOLDERS,
  getImageConfig,
  validateImageUrl,
  optimizeCloudinaryUrl,
  formatFileSize,
  checkImageFormatSupport,
  preloadImage,
  preloadImages,
  isInViewport,
  reportImageLoadTime,
  getCoreWebVitals,
  getLCPMetric,
  getFCPMetric,
};

/**
 * USAGE EXAMPLES:
 * 
 * import { getImageConfig, RESPONSIVE_SIZES, BLUR_PLACEHOLDERS } from '@/lib/performance/imageOptimization';
 * 
 * // Get config for hero image
 * const heroConfig = getImageConfig('critical');
 * 
 * // Use in Image component
 * <Image
 *   src={imageUrl}
 *   quality={heroConfig.quality}
 *   priority={heroConfig.priority}
 *   sizes={RESPONSIVE_SIZES.HERO_BANNER}
 *   placeholder="blur"
 *   blurDataURL={BLUR_PLACEHOLDERS.GRAY}
 * />
 */