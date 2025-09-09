import { Schema, model, models } from 'mongoose';
import { IProductColor } from '../interfaces/productColor.interface';

const productColorSchema = new Schema<IProductColor>(
  {
    productColorId: { type: String, required: true, unique: true },
    color: { type: String, required: true, trim: true },
    colorName: { type: String, required: true, trim: true },
    colorCode: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const ProductColor =
  models.ProductColor || model<IProductColor>('ProductColor', productColorSchema);
