
import { createClient } from 'redis';


export const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));


export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Redis Connected Successfully!');
  }
};