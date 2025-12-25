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
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
    connectionCount: 0,
  };
}

async function dbConnect(): Promise<mongoose.Connection> {
  // ✅ Step 1: যদি ইতিমধ্যে connection থাকে এবং ready থাকে
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log(
      `✅ [DB] Using cached connection (Active: ${cached.connectionCount})`
    );
    return cached.conn;
  }

  // ✅ Step 2: যদি connection promise চলছে (connecting state)
  if (cached.promise) {
    try {
      await cached.promise;
      if (mongoose.connection.readyState === 1) {
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
    // Connection Pool Settings
    maxPoolSize: NODE_ENV === 'production' ? 10 : 5, // Production এ বেশি
    minPoolSize: 2, // সবসময় ২টি connection ready রাখো
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    
    // Buffer Commands (Serverless এর জন্য)
    bufferCommands: false,
    
    // Retry Settings
    retryWrites: true,
    retryReads: true,
  };

  cached.promise = mongoose
    .connect(MONGODB_URI!, opts)
    .then((mongoose) => {
      cached.connectionCount += 1;
      console.log(
        `✅ [DB] MongoDB Connected! (Connection #${cached.connectionCount})`
      );
      return mongoose;
    })
    .catch((err) => {
      console.error('❌ [DB] MongoDB Connection Failed:', err.message);
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

// ✅ Graceful Shutdown Function (Optional but Recommended)
export async function dbDisconnect() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('✅ [DB] MongoDB Disconnected');
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

// ✅ Connection Health Check - Stale connection detect করবে
export async function healthCheck(): Promise<boolean> {
  try {
    if (!cached.conn) return false;
    
    // Ping করে দেখো connection alive আছে কিনা
    await mongoose.connection.db?.admin().ping();
    return true;
  } catch (error) {
    console.warn('⚠️ [DB] Connection health check failed, resetting cache');
    cached.conn = null;
    cached.promise = null;
    return false;
  }
}

export default dbConnect;