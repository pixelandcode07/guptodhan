// src/lib/modules/vendor-store/vendorStore.model.ts
// ✅ OPTIMIZED: Removed Duplicate Indexes & Fixed Conflicts

import { Schema, model, models, Types } from 'mongoose';
import { IStore } from './vendorStore.interface';

const storeSchema = new Schema<IStore>(
  {
    vendorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Vendor',
      required: true,
      // ❌ index: true সরিয়ে দিয়েছি (নিচে compound index আছে)
    },

    storeLogo: { type: String, required: true },

    storeBanner: { type: String, required: true },

    storeName: { 
      type: String, 
      required: true, 
      trim: true,
      // ❌ index: true সরিয়ে দিয়েছি (নিচে compound index আছে)
    },

    storeAddress: { type: String, required: true },

    storePhone: { type: String, required: true },

    storeEmail: { 
      type: String, 
      required: true, 
      unique: true, // ✅ unique অটোমেটিক ইনডেক্স তৈরি করে, তাই আলাদা index লাগবে না
      sparse: true,
    },

    vendorShortDescription: { type: String, required: true },

    fullDescription: { type: String, required: true },

    commission: { type: Number, default: 0 },

    storeSocialLinks: {
      facebook: { type: String },
      whatsapp: { type: String },
      linkedIn: { type: String },
      tiktok: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },

    storeMetaTitle: { type: String },

    storeMetaKeywords: [{ type: String }],

    storeMetaDescription: { type: String },

    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active',
      // ❌ index: true সরিয়ে দিয়েছি (নিচে compound index আছে)
    },
  },
  { timestamps: true }
);

// ================================================================
// 🎯 INDEXES - Professional Strategy (CLEANED UP)
// ================================================================

// 1️⃣ Vendor Dashboard Query: (Vendor ID + Status + Sort by Date)
// ভেন্ডর তার নিজের স্টোরগুলো যখন দেখবে
storeSchema.index({ vendorId: 1, status: 1, createdAt: -1 });

// 2️⃣ Public Store List: (Status + Sort by Name)
// যখন ইউজাররা সব দোকান দেখবে (Alphabetical Order)
storeSchema.index({ status: 1, storeName: 1 });

// 3️⃣ Search: (Text Search on Store Name)
// সার্চ বারের জন্য
storeSchema.index({ storeName: 'text' });

// ❌ REMOVED DUPLICATES:
// - storeEmail (Unique true থাকার কারণে অটো ইনডেক্স আছে)
// - vendorId (উপরে ১ নম্বর ইনডেক্স দিয়েই কাজ হবে)

export const StoreModel = models.StoreModel || model<IStore>('StoreModel', storeSchema);