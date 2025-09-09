import { Schema, model, models } from 'mongoose';
import { IProductSize } from '../interfaces/productSize.interface';

const productSizeSchema = new Schema<IProductSize>(
  {
    sizeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const ProductSize =
  models.ProductSize || model<IProductSize>('ProductSize', productSizeSchema);
