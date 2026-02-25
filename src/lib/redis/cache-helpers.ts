// src/lib/redis/cache-helpers.ts

import { getRedisClient } from './client';
export { CacheKeys, CacheTTL } from './cache-keys';

// ✅ Redis operation এ timeout — ২ সেকেন্ডের বেশি wait করব না
async function withRedisTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs = 2000,
  fallback: T | null = null
): Promise<T | null> {
  return Promise.race([
    fn(),
    new Promise<T | null>((resolve) =>
      setTimeout(() => {
        console.warn('⚠️ Redis timeout — falling back to DB');
        resolve(fallback);
      }, timeoutMs)
    ),
  ]);
}

/**
 * 🎯 Generic Cache Get/Set Helper
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  try {
    const redis = await getRedisClient();

    // ✅ Cache get with timeout
    const cached = await withRedisTimeout(
      () => redis.get(key),
      2000,
      null
    );

    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    // ✅ Cache miss — DB থেকে আনো
    console.log(`❌ Cache MISS: ${key}`);
    const fresh = await fetchFn();

    // ✅ Fire and forget — response দেরি করবে না
    redis
      .setEx(key, ttl, JSON.stringify(fresh))
      .catch((err) =>
        console.error(`⚠️ Redis setEx failed for ${key}:`, err)
      );

    return fresh;
  } catch (error) {
    // ✅ Redis down থাকলে সরাসরি DB থেকে আনো
    console.error(
      `⚠️ Redis unavailable for key ${key}, using DB directly`
    );
    return fetchFn();
  }
}

/**
 * 🗑️ Delete cache by key
 */
export async function deleteCacheKey(key: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    await redis.del(key);
    console.log(`🗑️ Cache DELETED: ${key}`);
  } catch (error) {
    console.error(`⚠️ Redis delete error for key ${key}:`, error);
  }
}

/**
 * 🗑️ Delete multiple cache keys by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(keys);
      console.log(
        `🗑️ Cache DELETED pattern: ${pattern} (${keys.length} keys)`
      );
    }
  } catch (error) {
    console.error(
      `⚠️ Redis pattern delete error for ${pattern}:`,
      error
    );
  }
}

/**
 * 💾 Set cache with specific TTL
 */
export async function setCacheData<T>(
  key: string,
  data: T,
  ttl: number = 3600
): Promise<void> {
  try {
    const redis = await getRedisClient();
    await redis.setEx(key, ttl, JSON.stringify(data));
    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    console.error(`⚠️ Redis set error for key ${key}:`, error);
  }
}