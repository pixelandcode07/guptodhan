import { createClient } from 'redis';

// ✅ Use type inference instead of explicit typing
let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  // ✅ Return existing connection if available
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // ✅ Check if caching is enabled
  if (process.env.ENABLE_REDIS_CACHE !== 'true') {
    throw new Error('Redis caching is disabled');
  }

  console.log('🔗 Connecting to Redis...');

  // ✅ Common socket options
  const socketOptions = {
    connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT) || 10000,
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
  };

  let client;

  // ✅ Option 1: Using REDIS_URL (Recommended)
  if (process.env.REDIS_URL) {
    const url = process.env.REDIS_URL;
    // Only use TLS if the URL explicitly starts with rediss://
    const usesTLS = url.startsWith('rediss://');

    const options: any = {
      url: url,
      socket: {
        ...socketOptions,
        // Only enable TLS if requested by the URL
        tls: usesTLS,
        rejectUnauthorized: false,
      },
    };

    client = createClient(options);
  } 
  // ✅ Option 2: Using HOST/PORT (Fallback)
  else if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    console.log('🔗 Connecting to Redis using HOST/PORT...');

    const options: any = {
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        ...socketOptions,
        // ❌ IMPORTANT: Removed automatic TLS forcing for cloud.redislabs.com
        // This was causing the "packet length too long" error
        tls: false, 
      },
    };

    client = createClient(options);
  } else {
    throw new Error('❌ Redis configuration missing! Please set REDIS_URL or REDIS_HOST/REDIS_PORT');
  }

  // ✅ Set up event listeners
  client.on('error', (err) => {
    // Suppress simple connection logs to avoid clutter
    console.error('❌ Redis Client Error:', err.message);
  });

  client.on('connect', () => console.log('🔄 Redis: Connecting...'));
  client.on('ready', () => console.log('✅ Redis: Connected and Ready!'));
  client.on('end', () => console.log('👋 Redis: Connection closed'));

  // ✅ Connect to Redis
  try {
    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    console.error('❌ Redis: Connection failed:', error);
    try {
      await client.quit();
    } catch {} // Ignore cleanup errors
    throw error;
  }
};

// ✅ Graceful shutdown
export const disconnectRedis = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.quit();
      console.log('👋 Redis: Disconnected gracefully');
    } catch (error) {
      console.error('❌ Redis: Disconnect error:', error);
    } finally {
      redisClient = null;
    }
  }
};

// ✅ Health check
export const isRedisHealthy = async (): Promise<boolean> => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      return false;
    }
    const pong = await redisClient.ping();
    return pong === 'PONG';
  } catch (error) {
    return false;
  }
};