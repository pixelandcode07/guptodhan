import { Schema, model, models } from 'mongoose';
import { IProductSimType } from '../interfaces/productSimType.interface';

const productSimTypeSchema = new Schema<IProductSimType>(
  {
    simTypeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const ProductSimTypeModel =
  models.ProductSimTypeModel || model<IProductSimType>('ProductSimTypeModel', productSimTypeSchema);
