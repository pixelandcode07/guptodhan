// src/lib/redis/cache-keys.ts

/**
 * 🔑 Centralized Cache Key Management
 * এক জায়গায় সব cache keys maintain করলে:
 * - Typo হবে না
 * - Invalidation সহজ
 * - Pattern-based deletion possible
 */

export const CacheKeys = {
  // User-related keys
  USER: {
    PROFILE: (userId: string) => `user:profile:${userId}`,
    BY_EMAIL: (email: string) => `user:email:${email}`,
    BY_PHONE: (phone: string) => `user:phone:${phone}`,
    ALL_USERS: 'users:all',
    ADMIN_LIST: (page: number) => `users:admin:page:${page}`,
  },

  // Session keys
  SESSION: {
    USER: (userId: string) => `session:user:${userId}`,
    PERMISSIONS: (userId: string) => `permissions:${userId}`,
  },

  // Product-related keys
  PRODUCT: {
    ALL: (page: number) => `products:all:page:${page}`,
    ACTIVE: (page: number) => `products:active:page:${page}`,
    BY_ID: (id: string) => `product:${id}`,
    BY_CATEGORY: (categoryId: string, page: number) => `products:category:${categoryId}:page:${page}`,
    BY_SUBCATEGORY: (subCategoryId: string, page: number) => `products:subcategory:${subCategoryId}:page:${page}`,
    BY_BRAND: (brandId: string, page: number) => `products:brand:${brandId}:page:${page}`,
    BY_VENDOR: (vendorId: string, page: number) => `products:vendor:${vendorId}:page:${page}`,
    LANDING_PAGE: 'products:landing-page',
    OFFERS: 'products:offers',
    BEST_SELLING: 'products:best-selling',
    FOR_YOU: 'products:for-you',
    SEARCH: (term: string) => `products:search:${term}`,
  },

  // ✅ NEW: Banner Keys (Banner Optimization)
  BANNER: {
    ALL: 'banners:all', // For Admin Dashboard
    BY_POSITION: (position: string) => `banners:public:${position}`, // For Home/Shop Page
  },

  // Patterns for bulk deletion (Cache Invalidation)
  PATTERNS: {
    USER_ALL: 'user:*',
    USERS_LIST: 'users:*',
    PRODUCTS_ALL: 'products:*',
    PRODUCT_BY_ID: 'product:*',
    
    // ✅ NEW: Banner Pattern (Delete all banners on update)
    BANNER_ALL: 'banners:*', 
  },
} as const;

/**
 * ⏱️ TTL Configuration (in seconds)
 */
export const CacheTTL = {
  // Short-lived (5 minutes)
  SHORT: 5 * 60,

  // Medium (30 minutes)
  MEDIUM: 30 * 60,

  // Long (1 hour)
  LONG: 60 * 60,

  // Very long (24 hours)
  VERY_LONG: 24 * 60 * 60,

  // User-specific TTLs
  USER_PROFILE: 30 * 60, // 30 minutes
  USER_SESSION: 24 * 60 * 60, // 24 hours
  USER_PERMISSIONS: 60 * 60, // 1 hour

  // Product-specific TTLs
  PRODUCT_LIST: 10 * 60,        // 10 minutes
  PRODUCT_DETAIL: 30 * 60,      // 30 minutes
  PRODUCT_LANDING: 5 * 60,      // 5 minutes (home page - frequently updated)
  PRODUCT_OFFERS: 5 * 60,       // 5 minutes (time-sensitive)
  PRODUCT_BEST_SELLING: 15 * 60, // 15 minutes
  PRODUCT_SEARCH: 5 * 60,       // 5 minutes

  // ✅ NEW: Banner TTL
  // ব্যানার খুব একটা চেঞ্জ হয় না, তাই ১ ঘণ্টা ক্যাশ রাখা সেফ
  BANNER_PUBLIC: 60 * 60, // 1 hour 
} as const;