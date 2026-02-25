// src/lib/redis/cache-helpers.ts

import { getRedisClient } from './client';
export { CacheKeys, CacheTTL } from './cache-keys';

// ✅ Smart Redis timeout wrapper
async function withRedisTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs = 3000,
  fallback: T | null = null,
  context: string = 'operation'
): Promise<T | null> {
  return Promise.race([
    fn().catch((err) => {
      console.warn(`⚠️ Redis error during ${context}: ${err.message}`);
      return fallback;
    }),
    new Promise<T | null>((resolve) =>
      setTimeout(() => {
        console.warn(`⚠️ Redis timeout (${timeoutMs}ms) during ${context} — falling back to DB`);
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

    // ✅ If Redis is not open, skip wait and hit DB instantly
    if (!redis.isOpen) {
      return fetchFn();
    }

    const cached = await withRedisTimeout(
      () => redis.get(key),
      3000,
      null,
      `get(${key})`
    );

    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    console.log(`❌ Cache MISS: ${key}`);
    const fresh = await fetchFn();

    // ✅ Fire and forget for setting cache
    if (redis.isOpen) {
      setImmediate(() => {
        redis
          .setEx(key, ttl, JSON.stringify(fresh))
          .catch((err) =>
            console.error(`⚠️ Redis setEx failed for ${key}:`, err.message)
          );
      });
    }

    return fresh;
  } catch (error) {
    return fetchFn();
  }
}

/**
 * 🎯 Batch Cache Get — pipeline/mGet
 */
export async function getBatchCachedData<T>(
  keys: string[],
  fetchFn: () => Promise<T[]>,
  ttl: number = 3600,
  getKey: (item: T) => string
): Promise<T[]> {
  try {
    const redis = await getRedisClient();

    if (!redis.isOpen) {
      return fetchFn();
    }

    // ✅ Use timeout for mGet as well
    const results = await withRedisTimeout(
      () => redis.mGet(keys),
      4000,
      null,
      'mGet'
    );

    if (!results) {
      return fetchFn();
    }

    const missing: number[] = [];
    const data: (T | null)[] = results.map((result, i) => {
      if (result) {
        return JSON.parse(result) as T;
      }
      missing.push(i);
      return null;
    });

    if (missing.length > 0) {
      const freshAll = await fetchFn();

      if (redis.isOpen) {
        setImmediate(() => {
          const pairs: [string, string][] = freshAll.map((item) => [
            getKey(item),
            JSON.stringify(item),
          ]);

          Promise.all(
            pairs.map(([k, v]) => redis.setEx(k, ttl, v))
          ).catch((err) =>
            console.error('⚠️ Batch cache set failed:', err.message)
          );
        });
      }

      return freshAll;
    }

    return data.filter((item): item is T => item !== null);
  } catch (error) {
    return fetchFn();
  }
}

/**
 * 🗑️ Delete cache by key
 */
export async function deleteCacheKey(key: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    if (redis.isOpen) {
      await redis.del(key);
      console.log(`🗑️ Cache DELETED: ${key}`);
    }
  } catch (error: any) {
    console.error(`⚠️ Redis delete error for key ${key}:`, error.message);
  }
}

/**
 * 🗑️ Delete multiple keys by pattern — SCAN
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    if (!redis.isOpen) return;

    const keysToDelete: string[] = [];
    let cursor = '0';

    do {
      const reply = await redis.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = String(reply.cursor);
      keysToDelete.push(...reply.keys);
    } while (cursor !== '0');

    if (keysToDelete.length > 0) {
      await redis.del(keysToDelete);
      console.log(
        `🗑️ Cache DELETED pattern: ${pattern} (${keysToDelete.length} keys)`
      );
    }
  } catch (error: any) {
    console.error(`⚠️ Redis pattern delete error for ${pattern}:`, error.message);
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
    if (redis.isOpen) {
      await redis.setEx(key, ttl, JSON.stringify(data));
      console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
    }
  } catch (error: any) {
    console.error(`⚠️ Redis set error for key ${key}:`, error.message);
  }
}

/**
 * 💾 Batch Set — একসাথে অনেক key set করার জন্য
 */
export async function setBatchCacheData<T>(
  items: { key: string; data: T; ttl?: number }[]
): Promise<void> {
  try {
    const redis = await getRedisClient();
    if (!redis.isOpen) return;

    await Promise.all(
      items.map(({ key, data, ttl = 3600 }) =>
        redis.setEx(key, ttl, JSON.stringify(data))
      )
    );

    console.log(`💾 Batch Cache SET: ${items.length} keys`);
  } catch (error: any) {
    console.error('⚠️ Batch cache set error:', error.message);
  }
}