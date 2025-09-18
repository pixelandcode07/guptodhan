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
  { _id: false } // no separate _id for each option
);

const vendorProductSchema = new Schema<IVendorProduct>(
  {
    productId: { type: String, required: true, unique: true },
    productTitle: { type: String, required: true, trim: true },
    vendorStoreId: { type: Schema.Types.ObjectId, ref: 'VendorStore', required: true },
    shortDescription: { type: String, required: true, maxlength: 255 },
    fullDescription: { type: String, required: true },
    specification: { type: String, required: true },
    warrantyPolicy: { type: String, required: true },
    productTag: [{ type: String }],
    videoUrl: { type: String },
    photoGallery: [{ type: String }],
    thumbnailImage: { type: String },
    productPrice: { type: Number },
    discountPrice: { type: Number },
    stock: { type: Number },
    sku: { type: String },
    rewardPoints: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    childCategory: { type: Schema.Types.ObjectId, ref: 'ChildCategory' },
    brand: { type: Schema.Types.ObjectId, ref: 'BrandModel' },
    productModel: { type: String },
    flag: { type: String },
    warranty: { type: String },
    weightUnit: { type: String },
    offerDeadline: { type: Date },
    metaTitle: { type: String },
    metaKeyword: { type: String },
    metaDescription: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // New field: productOptions
    productOptions: [productOptionSchema],
  },
  { timestamps: true }
);

export const VendorProductModel =
  models.VendorProductModel || model<IVendorProduct>('VendorProductModel', vendorProductSchema);
