import { Schema, model, models } from 'mongoose';
import { IVendorProduct } from './vendorProduct.interface';

const vendorProductSchema = new Schema<IVendorProduct>(
  {
    productId: { type: String, required: true, unique: true },
    productTitle: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 255 },
    fullDescription: { type: String, required: true },
    specification: { type: String, required: true },
    warrantyPolicy: { type: String, required: true },
    productTag: [{ type: String }],
    videoUrl: { type: String },
    photoGallery: [{ type: String, required: true }],
    thumbnailImage: { type: String, required: true },
    productPrice: { type: Number, required: true },
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
    warranty: { type: String, required: true },
    weightUnit: { type: String },
    offerDeadline: { type: Date },
    metaTitle: { type: String },
    metaKeyword: { type: String },
    metaDescription: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const VendorProductModel =
  models.VendorProductModel || model<IVendorProduct>('VendorProductModel', vendorProductSchema);
