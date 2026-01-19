import { Schema, model, models } from 'mongoose';
import { IVendorProduct } from './vendorProduct.interface';

// Sub-schema for productOptions
const productOptionSchema = new Schema(
  {
    productImage: { type: String },
    color: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'ProductColor'
    }],
    size: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'ProductSize'
    }],
    unit: [{ type: String }],
    simType: [{ type: String }],
    condition: [{ type: String }],
    warranty: { type: String },
    stock: { type: Number },
    price: { type: Number },
    discountPrice: { type: Number },
  },
  { _id: false }
);

const vendorProductSchema = new Schema<IVendorProduct>(
  {
    // ✅ unique: true অটোমেটিক ইনডেক্স তৈরি করে, তাই নিচে আর ইনডেক্স লাগবে না
    productId: { type: String, required: true, unique: true },
    productTitle: { type: String, required: true, trim: true },
    vendorStoreId: { type: Schema.Types.ObjectId, ref: 'StoreModel', required: true }, 
    vendorName: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 255 },
    fullDescription: { type: String, required: true },
    specification: { type: String },
    warrantyPolicy: { type: String },
    productTag: [{ type: String }],
    videoUrl: { type: String },
    photoGallery: [{ type: String }],
    thumbnailImage: { type: String },
    productPrice: { type: Number },
    discountPrice: { type: Number },
    stock: { type: Number },
    sku: { type: String },
    rewardPoints: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: 'CategoryModel', required: true }, 
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategoryModel' }, 
    childCategory: { type: Schema.Types.ObjectId, ref: 'ChildCategoryModel' }, 
    brand: { type: Schema.Types.ObjectId, ref: 'BrandModel' }, 
    productModel: { type: Schema.Types.ObjectId, ref: 'ProductModel' }, 
    flag: { type: Schema.Types.ObjectId, ref: 'ProductFlag' }, 
    warranty: { type: Schema.Types.ObjectId, ref: 'ProductWarrantyModel' }, 
    weightUnit: { type: Schema.Types.ObjectId, ref: 'ProductUnit' }, 
    offerDeadline: { type: Date },
    metaTitle: { type: String },
    metaKeyword: { type: String },
    metaDescription: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    sellCount: { type: Number, default: 0 },
    productOptions: [productOptionSchema],
  },
  { timestamps: true }
);

// ===================================
// 🔥 DATABASE INDEXES (OPTIMIZED)
// ===================================

// ❌ REMOVED: productId index because 'unique: true' already creates it.
// vendorProductSchema.index({ productId: 1 });

// ❌ REMOVED: Redundant Single Indexes (Because Compound Indexes covers them)
// MongoDB 'Prefix Rule' অনুযায়ী, যদি { category: 1, status: 1 } থাকে, 
// তাহলে শুধু category দিয়ে সার্চ করলেও ওই ইনডেক্স কাজ করে। আলাদা ইনডেক্স লাগে না।

// vendorProductSchema.index({ category: 1 });       <-- Covered by Index 11
// vendorProductSchema.index({ vendorStoreId: 1 });  <-- Covered by Index 12
// vendorProductSchema.index({ subCategory: 1 });    <-- Covered by Index 13
// vendorProductSchema.index({ brand: 1 });          <-- Covered by Index 14

// ✅ KEEPING: These are unique/necessary
vendorProductSchema.index({ status: 1 });
vendorProductSchema.index({ childCategory: 1 });
vendorProductSchema.index({ createdAt: -1 });
vendorProductSchema.index({ sellCount: -1 }); // Best selling
vendorProductSchema.index({ offerDeadline: 1 }); // Flash sales
vendorProductSchema.index({ sku: 1 }); // Product lookup

// 🚀 COMPOUND INDEXES (ESR Rule Followed)
// এগুলো সবচেয়ে ফাস্ট কুয়েরি দিবে

// 1️⃣ Category Page Queries (Filter by Category + Active Status + Sort Newest)
vendorProductSchema.index({ 
  category: 1, 
  status: 1, 
  createdAt: -1 
});

// 2️⃣ Vendor Dashboard (My Products + Active/Inactive + Sort)
vendorProductSchema.index({ 
  vendorStoreId: 1, 
  status: 1, 
  createdAt: -1 
});

// 3️⃣ SubCategory Page
vendorProductSchema.index({ 
  subCategory: 1, 
  status: 1, 
  createdAt: -1 
});

// 4️⃣ Brand Page
vendorProductSchema.index({ 
  brand: 1, 
  status: 1 
});

// 5️⃣ Text Search (Search Bar)
vendorProductSchema.index({ 
  productTitle: 'text', 
  shortDescription: 'text',
  productTag: 'text'
});

export const VendorProductModel =
  models.VendorProductModel || model<IVendorProduct>('VendorProductModel', vendorProductSchema);