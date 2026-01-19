// src/lib/redis/client.ts
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  const config: any = {
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      
      // 🔥 TLS Support for Redis Cloud
      tls: process.env.REDIS_TLS_ENABLED === 'true',
      
      // Connection timeout
      connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT) || 10000,
      
      // Reconnection strategy with exponential backoff
      reconnectStrategy: (retries: number) => {
        const maxRetries = Number(process.env.REDIS_MAX_RETRIES) || 3;
        if (retries > maxRetries) {
          console.error('❌ Redis: Max reconnection attempts reached');
          return new Error('Redis connection failed');
        }
        
        const delay = Math.min(
          retries * (Number(process.env.REDIS_RETRY_DELAY) || 500), 
          3000
        );
        console.log(`🔄 Redis: Reconnecting... Attempt ${retries} (delay: ${delay}ms)`);
        return delay;
      },
    },
    
    // Command timeout
    commandsQueueMaxLength: 1000,
  };

  // Add credentials if provided
  if (process.env.REDIS_USERNAME) {
    config.username = process.env.REDIS_USERNAME;
  }
  
  if (process.env.REDIS_PASSWORD) {
    config.password = process.env.REDIS_PASSWORD;
  }

  redisClient = createClient(config);

  // Event listeners
  redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
  });

  redisClient.on('connect', () => {
    console.log('🔄 Redis: Connecting...');
  });

  redisClient.on('ready', () => {
    console.log('✅ Redis: Connected and Ready!');
  });

  redisClient.on('reconnecting', () => {
    console.log('🔄 Redis: Reconnecting...');
  });

  redisClient.on('end', () => {
    console.log('👋 Redis: Connection closed');
  });

  await redisClient.connect();
  return redisClient;
};

// Graceful shutdown
export const disconnectRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    console.log('👋 Redis: Disconnected gracefully');
  }
};

// Health check
export const isRedisHealthy = async (): Promise<boolean> => {
  try {
    const redis = await getRedisClient();
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
};