import { Schema, model, models } from 'mongoose';
import { IBrand } from '../interfaces/brandName.interface';

const brandSchema = new Schema<IBrand>(
  {
    brandId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    brandLogo: { type: String, required: true },
    brandBanner: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'ChildCategory' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const BrandModel = models.BrandModel || model<IBrand>('BrandModel', brandSchema);
