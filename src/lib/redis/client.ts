// src/lib/redis/client.ts

import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;

/* eslint-disable @typescript-eslint/no-explicit-any */
let redisClient: RedisClient | null = (global as any).__redisClient || null;
let connectingPromise: Promise<RedisClient> | null =
  (global as any).__redisConnecting || null;

export const getRedisClient = async (): Promise<RedisClient> => {
  // ✅ Already connected — সরাসরি return
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  if (process.env.ENABLE_REDIS_CACHE !== 'true') {
    throw new Error('Redis caching is disabled');
  }

  // ✅ Connection in progress — duplicate connection তৈরি হবে না
  if (connectingPromise) {
    return connectingPromise;
  }

  connectingPromise = (async () => {
    console.log('🔗 Connecting to Redis...');

    const socketOptions = {
      connectTimeout: 5000,
      reconnectStrategy: (retries: number) => {
        if (retries > 3) {
          console.error('❌ Redis: Max reconnection attempts reached');
          return new Error('Redis connection failed');
        }
        return Math.min(retries * 500, 2000);
      },
    };

    let client: RedisClient;

    if (process.env.REDIS_URL) {
      const url = process.env.REDIS_URL;
      client = createClient({
        url,
        socket: {
          ...socketOptions,
          tls: url.startsWith('rediss://'),
          rejectUnauthorized: false,
        },
      } as any);
    } else if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
      client = createClient({
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          ...socketOptions,
          tls: false,
        },
      } as any);
    } else {
      throw new Error('Redis configuration missing!');
    }

    client.on('error', (err) =>
      console.error('❌ Redis Error:', err.message)
    );
    client.on('ready', () => console.log('✅ Redis: Ready!'));
    client.on('end', () => {
      console.log('👋 Redis: Connection closed');
      redisClient = null;
      (global as any).__redisClient = null;
    });

    await client.connect();

    redisClient = client;
    (global as any).__redisClient = client;
    (global as any).__redisConnecting = null;
    connectingPromise = null;

    return client;
  })();

  (global as any).__redisConnecting = connectingPromise;

  return connectingPromise;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient?.isOpen) {
    await redisClient.quit();
    redisClient = null;
    (global as any).__redisClient = null;
    console.log('👋 Redis: Disconnected gracefully');
  }
};

export const isRedisHealthy = async (): Promise<boolean> => {
  try {
    if (!redisClient?.isOpen) return false;
    return (await redisClient.ping()) === 'PONG';
  } catch {
    return false;
  }
};