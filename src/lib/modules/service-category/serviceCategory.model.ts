// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-category\serviceCategory.model.ts

import { Schema, model, models } from 'mongoose';
import { IServiceCategory } from './serviceCategory.interface';

const serviceCategorySchema = new Schema<IServiceCategory>({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ServiceCategory = models.ServiceCategory || model<IServiceCategory>('ServiceCategory', serviceCategorySchema);