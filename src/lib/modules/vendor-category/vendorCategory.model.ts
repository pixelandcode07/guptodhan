import { Schema, model, models } from 'mongoose';
import { IVendorCategory } from './vendorCategory.interface';

const vendorCategorySchema = new Schema<IVendorCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const VendorCategoryModel =
  models.VendorCategoryModel || model<IVendorCategory>('VendorCategoryModel', vendorCategorySchema);
