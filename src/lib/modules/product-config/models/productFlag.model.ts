import { Schema, model, models } from 'mongoose';
import { IProductFlag } from '../interfaces/productFlag.interface';
import { v4 as uuidv4 } from "uuid";

const productFlagSchema = new Schema<IProductFlag>(
  {
    productFlagId: { type: String, required: true, unique: true, default: () => `PF-${uuidv4().replace(/-/g, '').slice(0, 8)}` },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
    orderCount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

export const ProductFlag =
  models.ProductFlag || model<IProductFlag>('ProductFlag', productFlagSchema);
