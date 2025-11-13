import { Schema, model, models } from 'mongoose';
import { IVendorProduct } from './vendorProduct.interface';

// Sub-schema for productOptions
const productOptionSchema = new Schema(
  {
    productImage: { type: String },
    unit: { type: String },
    simType: { type: String },
    warranty: { type: String },
    condition: { type: String },
    stock: { type: Number },
    price: { type: Number },
    discountPrice: { type: Number },
    color: { type: String },
    size: { type: String },
  },
  { _id: false }
);

const vendorProductSchema = new Schema<IVendorProduct>(
  {
    productId: { type: String, required: true, unique: true },
    productTitle: { type: String, required: true, trim: true },
    // ✅ পরিবর্তন করা হয়েছে: 'VendorStore' -> 'StoreModel'
    vendorStoreId: { type: Schema.Types.ObjectId, ref: 'StoreModel', required: true }, 
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
    // ✅ পরিবর্তন করা হয়েছে: 'Category' -> 'CategoryModel'
    category: { type: Schema.Types.ObjectId, ref: 'CategoryModel', required: true }, 
    // ✅ পরিবর্তন করা হয়েছে: 'SubCategory' -> 'SubCategoryModel'
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategoryModel' }, 
    // ✅ পরিবর্তন করা হয়েছে: 'ChildCategory' -> 'ChildCategoryModel'
    childCategory: { type: Schema.Types.ObjectId, ref: 'ChildCategoryModel' }, 
    // ✅ এটা ঠিক ছিল
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, 
    // ✅ এটা ঠিক ছিল
    productModel: { type: Schema.Types.ObjectId, ref: 'ProductModel' }, 
    // ✅ পরিবর্তন করা হয়েছে: 'Flag' -> 'ProductFlag'
    flag: { type: Schema.Types.ObjectId, ref: 'ProductFlag' }, 
    // ✅ পরিবর্তন করা হয়েছে: 'Warranty' -> 'ProductWarrantyModel'
    warranty: { type: Schema.Types.ObjectId, ref: 'ProductWarrantyModel' }, 
    // ✅ পরিবর্তন করা হয়েছে: 'WeightUnit' -> 'ProductUnit'
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

export const VendorProductModel =
  models.VendorProductModel || model<IVendorProduct>('VendorProductModel', vendorProductSchema);