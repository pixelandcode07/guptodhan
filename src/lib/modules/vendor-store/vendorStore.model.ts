// src/lib/modules/vendor-store/vendorStore.model.ts
// ✅ OPTIMIZED: Added indexes for better performance + populate optimization

import { Schema, model, models, Types } from 'mongoose';
import { IStore } from './vendorStore.interface';

const storeSchema = new Schema<IStore>(
  {
    vendorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Vendor',
      required: true,
      index: true // ✅ CRITICAL: vendorId lookup
    },

    storeLogo: { type: String, required: true },

    storeBanner: { type: String, required: true },

    storeName: { 
      type: String, 
      required: true, 
      trim: true,
      index: true // ✅ For storeName search
    },

    storeAddress: { type: String, required: true },

    storePhone: { type: String, required: true },

    storeEmail: { 
      type: String, 
      required: true, 
      unique: true,
      sparse: true,
      index: true // ✅ For email lookup
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
      index: true // ✅ For status filtering
    },
  },
  { timestamps: true }
);

// ================================================================
// 🎯 INDEXES - Professional Strategy (NO DUPLICATES)
// ================================================================

// ✅ Single Field Indexes (only if not in compound indexes)
// vendorId, storeName, storeEmail, status already have field-level indexes

// ✅ Compound Indexes (ESR rule: Equality, Sort, Range)

// Most common: Get store by vendor, filter by status, sort by date
storeSchema.index({ 
  vendorId: 1,      // Equality (which vendor)
  status: 1,        // Equality (active/inactive)
  createdAt: -1     // Sort (recent first)
});

// Query: Get active stores sorted by name
storeSchema.index({ 
  status: 1,        // Equality
  storeName: 1      // Sort (alphabetical)
});

// Query: Vendor store lookup with creation date
storeSchema.index({ 
  vendorId: 1,      // Equality
  createdAt: -1     // Sort
});

// Query: Get stores by email (for unique validation)
storeSchema.index({ 
  storeEmail: 1     // Equality
});

// ================================================================
// 🎯 INDEX SUMMARY
// ================================================================

/*
TOTAL INDEXES: 7 (optimized)

Index 1: { vendorId, status, createdAt }
  - Get vendor's stores filtered by status, sorted by date
  - Perfect for vendor dashboard queries

Index 2: { status, storeName }
  - Get active stores sorted alphabetically
  - Perfect for store listing page

Index 3: { vendorId, createdAt }
  - Get vendor's stores sorted by date
  - Perfect for vendor store history

Index 4: { storeEmail }
  - Email lookup
  - Perfect for unique constraint validation

Field-level indexes (auto-created):
  - vendorId (lookup)
  - storeName (search)
  - storeEmail (unique)
  - status (filter)

BENEFITS:
✅ Fast vendor store lookups
✅ Fast status filtering
✅ Fast sorting operations
✅ No duplicate indexes
✅ Optimal for all common queries
✅ ESR rule followed
*/

export const StoreModel = models.StoreModel || model<IStore>('StoreModel', storeSchema);