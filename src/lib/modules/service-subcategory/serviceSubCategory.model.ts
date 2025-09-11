// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-subcategory\serviceSubCategory.model.ts

import { Schema, model, models } from 'mongoose';
import { IServiceSubCategory } from './serviceSubCategory.interface';

const serviceSubCategorySchema = new Schema<IServiceSubCategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ServiceSubCategory = models.ServiceSubCategory || model<IServiceSubCategory>('ServiceSubCategory', serviceSubCategorySchema);