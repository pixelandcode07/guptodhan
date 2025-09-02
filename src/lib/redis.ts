// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\redis.ts

import { createClient } from 'redis';

// .env.local থেকে আপনার ক্লাউড Redis-এর তথ্য নেওয়া হচ্ছে
export const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME, // ক্লাউড Redis-এর জন্য username প্রয়োজন
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// কানেকশন ফাংশন
export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Redis Connected Successfully!');
  }
};