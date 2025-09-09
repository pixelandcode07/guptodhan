
import { Schema, model, models } from 'mongoose';
import { IBrand } from './brand.interface';

const brandSchema = new Schema<IBrand>({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const Brand = models.Brand || model<IBrand>('Brand', brandSchema);