// src/lib/redis/cache-keys.ts

/**
 * 🔑 Centralized Cache Key Management
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

  // Banner Keys
  BANNER: {
    ALL: 'banners:all',
    BY_POSITION: (position: string) => `banners:public:${position}`,
  },

  // Category Keys
  CATEGORY: {
    ALL: 'categories:all',
    FEATURED: 'categories:featured',
    NAVBAR: 'categories:navbar',
    BY_ID: (id: string) => `category:${id}`,
    BY_SLUG: (slug: string) => `category:slug:${slug}`,
    WITH_HIERARCHY: 'categories:hierarchy',
    PRODUCTS_BY_SLUG: (slug: string, filters: string) => `category:${slug}:products:${filters}`,
  },

  // SubCategory Keys
  SUBCATEGORY: {
    ALL: 'subcategories:all',
    FEATURED: 'subcategories:featured',
    BY_ID: (id: string) => `subcategory:${id}`,
    BY_SLUG: (slug: string) => `subcategory:slug:${slug}`,
    BY_CATEGORY: (categoryId: string) => `subcategories:by-category:${categoryId}`,
    PRODUCTS_BY_SLUG: (slug: string, filters: string) => `subcategory:${slug}:products:${filters}`,
  },

  // ChildCategory Keys
  CHILDCATEGORY: {
    ALL: 'childcategories:all',
    BY_ID: (id: string) => `childcategory:${id}`,
    BY_SLUG: (slug: string) => `childcategory:slug:${slug}`,
    BY_SUBCATEGORY: (subCategoryId: string) => `childcategories:by-subcategory:${subCategoryId}`,
    PRODUCTS_BY_SLUG: (slug: string, filters: string) => `childcategory:${slug}:products:${filters}`,
  },

  // Order Keys
  ORDER: {
    ALL: 'orders:all',
    BY_ID: (id: string) => `order:${id}`,
    BY_USER: (userId: string) => `orders:user:${userId}`,
    BY_STORE: (storeId: string) => `orders:store:${storeId}`,
    BY_STATUS: (status: string) => `orders:status:${status}`,
    RETURNED: (userId: string) => `orders:user:${userId}:returned`,
  },

  // Product Q&A Keys
  QNA: {
    ALL: 'qna:all',
    BY_ID: (id: string) => `qna:${id}`,
    BY_PRODUCT: (productId: string) => `qna:product:${productId}`,
    BY_USER: (userId: string) => `qna:user:${userId}`,
    UNANSWERED: 'qna:unanswered',
  },

  // ✅ NEW: Product Review Keys
  REVIEW: {
    ALL: 'reviews:all',
    BY_ID: (id: string) => `review:${id}`,
    BY_PRODUCT: (productId: string) => `reviews:product:${productId}`,
    BY_USER: (userId: string) => `reviews:user:${userId}`,
    STATS_BY_PRODUCT: (productId: string) => `reviews:stats:product:${productId}`,
    BY_RATING: (rating: number) => `reviews:rating:${rating}`,
  },

  // Patterns for bulk deletion
  PATTERNS: {
    USER_ALL: 'user:*',
    USERS_LIST: 'users:*',
    PRODUCTS_ALL: 'products:*',
    PRODUCT_BY_ID: 'product:*',
    BANNER_ALL: 'banners:*',
    CATEGORY_ALL: 'categories:*',
    CATEGORY_BY_ID: 'category:*',
    SUBCATEGORY_ALL: 'subcategories:*',
    SUBCATEGORY_BY_ID: 'subcategory:*',
    CHILDCATEGORY_ALL: 'childcategories:*',
    CHILDCATEGORY_BY_ID: 'childcategory:*',
    ORDER_ALL: 'orders:*',
    ORDER_BY_ID: 'order:*',
    QNA_ALL: 'qna:*',
    // ✅ NEW: Review Patterns
    REVIEW_ALL: 'reviews:*',
    REVIEW_BY_ID: 'review:*',
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
  USER_PROFILE: 30 * 60,
  USER_SESSION: 24 * 60 * 60,
  USER_PERMISSIONS: 60 * 60,

  // Product-specific TTLs
  PRODUCT_LIST: 10 * 60,
  PRODUCT_DETAIL: 30 * 60,
  PRODUCT_LANDING: 5 * 60,
  PRODUCT_OFFERS: 5 * 60,
  PRODUCT_BEST_SELLING: 15 * 60,
  PRODUCT_SEARCH: 5 * 60,

  // Banner TTL
  BANNER_PUBLIC: 60 * 60,

  // Category TTLs
  CATEGORY_LIST: 30 * 60,
  CATEGORY_FEATURED: 60 * 60,
  CATEGORY_HIERARCHY: 60 * 60,
  CATEGORY_PRODUCTS: 10 * 60,

  // SubCategory TTLs
  SUBCATEGORY_LIST: 30 * 60,
  SUBCATEGORY_FEATURED: 60 * 60,
  SUBCATEGORY_PRODUCTS: 10 * 60,

  // ChildCategory TTLs
  CHILDCATEGORY_LIST: 30 * 60,
  CHILDCATEGORY_PRODUCTS: 10 * 60,

  // Order TTLs
  ORDER_LIST: 5 * 60,
  ORDER_DETAIL: 10 * 60,
  ORDER_USER: 5 * 60,
  ORDER_REPORT: 15 * 60,

  // Q&A TTLs
  QNA_LIST: 15 * 60,
  QNA_BY_PRODUCT: 30 * 60,
  QNA_BY_USER: 10 * 60,

  // ✅ NEW: Review TTLs
  REVIEW_LIST: 15 * 60,          // 15 minutes (all reviews)
  REVIEW_BY_PRODUCT: 30 * 60,    // 30 minutes (product reviews - stable)
  REVIEW_BY_USER: 10 * 60,       // 10 minutes (user reviews)
  REVIEW_STATS: 60 * 60,         // 1 hour (statistics - very stable)
} as const;