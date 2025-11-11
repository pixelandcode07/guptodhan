import { Schema, model, models } from 'mongoose';
import { IBrand } from '../interfaces/brandName.interface';
import { v4 as uuidv4 } from "uuid";

const brandSchema = new Schema<IBrand>(
  {
    brandId: { type: String, required: true, unique: true, default: () => `BN-${uuidv4().replace(/-/g, '').slice(0, 8)}`},
    name: { type: String, required: true, trim: true },
    brandLogo: { type: String, required: true },
    brandBanner: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    childCategory: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: String, enum: ['featured', 'not_featured'], default: 'not_featured' },
    orderCount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

export const BrandModel = models.BrandModel || model<IBrand>('BrandModel', brandSchema);
