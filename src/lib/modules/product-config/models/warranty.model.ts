import { Schema, model, models } from 'mongoose';
import { IProductWarranty } from '../interfaces/warranty.interface';

const productWarrantySchema = new Schema<IProductWarranty>(
  {
    warrantyName: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const ProductWarrantyModel =
  models.ProductWarrantyModel ||
  model<IProductWarranty>('ProductWarrantyModel', productWarrantySchema);
