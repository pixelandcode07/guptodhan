// src/lib/redis/cache-helpers.ts

import { getRedisClient } from './client';
export { CacheKeys, CacheTTL } from './cache-keys';

// ✅ Redis timeout wrapper
async function withRedisTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs = 3000,
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

    const cached = await withRedisTimeout(
      () => redis.get(key),
      3000,
      null
    );

    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    console.log(`❌ Cache MISS: ${key}`);
    const fresh = await fetchFn();

    setImmediate(() => {
      redis
        .setEx(key, ttl, JSON.stringify(fresh))
        .catch((err) =>
          console.error(`⚠️ Redis setEx failed for ${key}:`, err)
        );
    });

    return fresh;
  } catch (error) {
    console.error(`⚠️ Redis unavailable for key ${key}, using DB directly`);
    return fetchFn();
  }
}

/**
 * 🎯 Batch Cache Get — pipeline ব্যবহার করে
 */
export async function getBatchCachedData<T>(
  keys: string[],
  fetchFn: () => Promise<T[]>,
  ttl: number = 3600,
  getKey: (item: T) => string
): Promise<T[]> {
  try {
    const redis = await getRedisClient();

    // ✅ mGet দিয়ে একসাথে সব key আনো — pipeline এর চেয়ে সহজ এবং type-safe
    const results = await redis.mGet(keys);

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

      setImmediate(() => {
        // ✅ mSet এর জন্য array of [key, value] pairs
        const pairs: [string, string][] = freshAll.map((item) => [
          getKey(item),
          JSON.stringify(item),
        ]);

        // ✅ একসাথে সব set করো তারপর TTL set করো
        Promise.all(
          pairs.map(([k, v]) => redis.setEx(k, ttl, v))
        ).catch((err) =>
          console.error('⚠️ Batch cache set failed:', err)
        );
      });

      return freshAll;
    }

    return data.filter((item): item is T => item !== null);
  } catch (error) {
    console.error('⚠️ Batch cache failed, using DB directly');
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
 * 🗑️ Delete multiple keys by pattern — SCAN ব্যবহার করে
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const redis = await getRedisClient();

    const keysToDelete: string[] = [];
    // ✅ cursor type string হওয়া উচিত Redis v4 এ
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
      // ✅ batch এ delete করো
      await redis.del(keysToDelete);
      console.log(
        `🗑️ Cache DELETED pattern: ${pattern} (${keysToDelete.length} keys)`
      );
    }
  } catch (error) {
    console.error(`⚠️ Redis pattern delete error for ${pattern}:`, error);
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

/**
 * 💾 Batch Set — একসাথে অনেক key set করার জন্য
 */
export async function setBatchCacheData<T>(
  items: { key: string; data: T; ttl?: number }[]
): Promise<void> {
  try {
    const redis = await getRedisClient();

    // ✅ Promise.all দিয়ে সব একসাথে set করো
    await Promise.all(
      items.map(({ key, data, ttl = 3600 }) =>
        redis.setEx(key, ttl, JSON.stringify(data))
      )
    );

    console.log(`💾 Batch Cache SET: ${items.length} keys`);
  } catch (error) {
    console.error('⚠️ Batch cache set error:', error);
  }
}