import { Schema, model, models } from 'mongoose';
import { IProductFlag } from '../interfaces/productFlag.interface';

const productFlagSchema = new Schema<IProductFlag>(
  {
    productFlagId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProductFlag =
  models.ProductFlag || model<IProductFlag>('ProductFlag', productFlagSchema);
