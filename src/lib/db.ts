/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/db.ts

import mongoose from 'mongoose';

// ================================================================
// Global Model Registration
// ================================================================
import '@/lib/modules/ecommerce-category/models/ecomCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomSubCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomChildCategory.model';
import '@/lib/modules/brand/brand.model';
import '@/lib/modules/product-config/models/brandName.model';
import '@/lib/modules/product-model/productModel.model';
import '@/lib/modules/product-config/models/productFlag.model';
import '@/lib/modules/product-config/models/warranty.model';
import '@/lib/modules/product-config/models/productUnit.model';
import '@/lib/modules/vendor-store/vendorStore.model';
import '@/lib/modules/product-review/productReview.model';
import '@/lib/modules/vendors/vendor.model';
import '@/lib/modules/product/vendorProduct.model';
// ================================================================

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

// Global mongoose cache
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
  connectionCount: number;
  lastHealthCheck: number;
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
    connectionCount: 0,
    lastHealthCheck: 0,
  };
}

async function dbConnect(): Promise<mongoose.Connection> {
  // ✅ Step 1: যদি connection exist করে এবং healthy থাকে
  if (cached.conn && mongoose.connection.readyState === 1) {
    // 5 মিনিটে একবার health check করো
    const now = Date.now();
    if (now - cached.lastHealthCheck > 5 * 60 * 1000) {
      try {
        await mongoose.connection.db?.admin().ping();
        cached.lastHealthCheck = now;
        console.log(
          `✅ [DB] Using cached connection (Active: ${cached.connectionCount})`
        );
        return cached.conn;
      } catch (e) {
        console.warn('⚠️ [DB] Connection stale, reconnecting...');
        cached.conn = null;
        cached.promise = null;
      }
    } else {
      console.log(
        `✅ [DB] Using cached connection (Active: ${cached.connectionCount})`
      );
      return cached.conn;
    }
  }

  // ✅ Step 2: যদি connection promise চলছে
  if (cached.promise) {
    try {
      await cached.promise;
      if (mongoose.connection.readyState === 1) {
        cached.lastHealthCheck = Date.now();
        console.log(
          `✅ [DB] Connection established from pending promise (Active: ${cached.connectionCount})`
        );
        return cached.conn!;
      }
    } catch (e) {
      console.error('❌ [DB] Connection error from pending promise:', e);
      cached.promise = null;
      throw e;
    }
  }

  // ✅ Step 3: নতুন connection তৈরি করো
  console.log('⏳ [DB] Initiating new MongoDB connection...');

  const opts: mongoose.ConnectOptions = {
    // ================================================================
    // Connection Pool Settings
    // ================================================================
    maxPoolSize: NODE_ENV === 'production' ? 10 : 5,
    minPoolSize: NODE_ENV === 'production' ? 2 : 1,
    
    // ================================================================
    // Socket/Timeout Settings (Free tier MongoDB Atlas এর জন্য)
    // ================================================================
    socketTimeoutMS: 60000, // 60 seconds - Free tier slow connection handle করবে
    serverSelectionTimeoutMS: 15000, // 15 seconds
    connectTimeoutMS: 45000, // 45 seconds
    family: 4, // IPv4 prefer করো
    
    // ================================================================
    // Buffer Commands
    // ================================================================
    bufferCommands: true, // Serverless environment এর জন্য
    
    // ================================================================
    // Retry Settings (TLS handshake fail হলে auto retry করবে)
    // ================================================================
    retryWrites: true,
    retryReads: true,
    
    // ================================================================
    // SSL/TLS Settings - এটাই CRITICAL for free tier!
    // ================================================================
    tls: true,
    tlsAllowInvalidCertificates: true, // Free tier এর জন্য
    
    // ================================================================
    // Pool Configuration
    // ================================================================
    waitQueueTimeoutMS: 30000,
    maxIdleTimeMS: 60000,
  };

  cached.promise = mongoose
    .connect(MONGODB_URI!, opts)
    .then((mongoose) => {
      cached.connectionCount += 1;
      cached.lastHealthCheck = Date.now();
      console.log(
        `✅ [DB] MongoDB Connected! (Connection #${cached.connectionCount})`
      );
      return mongoose;
    })
    .catch((err) => {
      console.error('❌ [DB] MongoDB Connection Failed:');
      console.error('Error:', err.message);
      if (err.reason) console.error('Reason:', err.reason);
      cached.promise = null;
      throw err;
    });

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

// ✅ Graceful Shutdown
export async function dbDisconnect() {
  if (cached.conn) {
    try {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
      cached.lastHealthCheck = 0;
      console.log('✅ [DB] MongoDB Disconnected');
    } catch (e) {
      console.error('❌ [DB] Disconnect error:', e);
    }
  }
}

// ✅ Get Connection Status
export function getConnectionStatus() {
  const states: { [key: number]: string } = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
}

// ✅ Health Check - improved version
export async function healthCheck(): Promise<boolean> {
  try {
    if (!cached.conn || mongoose.connection.readyState !== 1) {
      console.warn('⚠️ [DB] No active connection');
      return false;
    }

    // Ping করে দেখো
    await mongoose.connection.db?.admin().ping();
    cached.lastHealthCheck = Date.now();
    console.log('✅ [DB] Health check passed');
    return true;
  } catch (error) {
    console.warn('⚠️ [DB] Health check failed, resetting cache');
    console.error('Health check error:', error);
    cached.conn = null;
    cached.promise = null;
    cached.lastHealthCheck = 0;
    return false;
  }
}

// ✅ Safe wrapper for queries - এটা use করো API routes এ
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>
): Promise<T> {
  try {
    // Connection establish করো
    await dbConnect();

    // Health check করো
    const isHealthy = await healthCheck();
    if (!isHealthy) {
      console.warn('⚠️ [DB] Connection unhealthy, attempting reconnect...');
      cached.conn = null;
      cached.promise = null;
      await dbConnect();
    }

    // Query execute করো
    return await queryFn();
  } catch (error) {
    console.error('❌ [DB] Query failed:', error);
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;