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

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<mongoose.Connection> {
  // ✅ Already connected — extra ping নেই, সরাসরি return
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // ✅ Connection in progress — duplicate connection তৈরি হবে না
  if (cached.promise) {
    const m = await cached.promise;
    cached.conn = m.connection;
    return cached.conn;
  }

  // ✅ New connection
  cached.promise = mongoose.connect(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    retryReads: true,
    maxIdleTimeMS: 60000,
  });

  try {
    const m = await cached.promise;
    cached.conn = m.connection;
    console.log('✅ [DB] MongoDB Connected!');
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('❌ [DB] MongoDB Connection Failed:', err);
    throw err;
  }
}

// ✅ Simple wrapper — শুধু connect করে query run করে, extra ping নেই
export async function safeDbQuery<T>(queryFn: () => Promise<T>): Promise<T> {
  await dbConnect();
  return queryFn();
}

export async function dbDisconnect() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('✅ [DB] Disconnected');
  }
}

export function getConnectionStatus() {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
}

export default dbConnect;