/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/db.ts

import mongoose from 'mongoose';

// ================================================================
// Global Model Registration
// এই ইম্পোর্টগুলো এখানে রাখা ভালো, এতে "Missing Schema" এরর হয় না।
// ================================================================
import '@/lib/modules/ecommerce-category/models/ecomCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomSubCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomChildCategory.model';
import '@/lib/modules/brand/brand.model';
import '@/lib/modules/product-config/models/brandName.model'; // ✅ Ei line add koro
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

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

// Mongoose Connection Cache (Next.js Hot Reload Fix)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // যদি ইতিমধ্যে কানেকশন থাকে, সেটি রিটার্ন করো
  if (cached.conn) {
    // console.log('🚀 Using cached database connection');
    return cached.conn;
  }

  // যদি কানেকশন প্রসেস না চলে, নতুন কানেকশন শুরু করো
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Vercel/Serverless এর জন্য এটি false রাখা ভালো
      // dbName: 'guptodhan_db', // অপশনাল: যদি নির্দিষ্ট ডাটাবেস নাম দিতে চান
    };

    console.log('⏳ Attempting to connect to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully!');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;