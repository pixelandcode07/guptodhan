import { Schema, model, models } from 'mongoose';
import { IBrand } from '../interfaces/brandName.interface';

const brandSchema = new Schema<IBrand>(
  {
    brandId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    brandLogo: { type: String, required: true },
    brandBanner: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    childCategory: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: String, enum: ['featured', 'not_featured'], default: 'not_featured' },
  },
  { timestamps: true }
);

export const BrandModel = models.BrandModel || model<IBrand>('BrandModel', brandSchema);
