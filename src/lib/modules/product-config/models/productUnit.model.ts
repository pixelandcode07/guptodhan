import { Schema, model, models } from 'mongoose';
import { IProductUnit } from '../interfaces/productUnit.interface';

const productUnitSchema = new Schema<IProductUnit>(
  {
    productUnitId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const ProductUnit =
  models.ProductUnit || model<IProductUnit>('ProductUnit', productUnitSchema);
