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

  // Patterns for bulk deletion
  PATTERNS: {
    USER_ALL: 'user:*',
    USERS_LIST: 'users:*',
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
} as const;