// src/lib/redis/cache-helpers.ts
import { getRedisClient } from './client';

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
    
    // 1. Try to get from cache
    const cached = await redis.get(key);
    
    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    // 2. Cache miss - fetch fresh data
    console.log(`❌ Cache MISS: ${key}`);
    const fresh = await fetchFn();

    // 3. Store in cache
    await redis.setEx(key, ttl, JSON.stringify(fresh));
    
    return fresh;
  } catch (error) {
    // 4. Redis error - fallback to direct fetch
    console.error(`⚠️ Redis error for key ${key}:`, error);
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
      console.log(`🗑️ Cache DELETED (pattern): ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    console.error(`⚠️ Redis pattern delete error for ${pattern}:`, error);
  }
}

/**
 * ⏱️ Set cache with specific TTL
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

// ✅ Re-export CacheKeys and CacheTTL
export { CacheKeys, CacheTTL } from './cache-keys';