// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service\service.model.ts

import { Schema, model, models } from 'mongoose';
import { IService } from './service.interface';

const serviceSchema = new Schema<IService>({
  provider: { type: Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  subCategory: { type: Schema.Types.ObjectId, ref: 'ServiceSubCategory' },
  location: {
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },
  },
  images: [{ type: String, required: true }],
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
}, { timestamps: true });

serviceSchema.index({ category: 1, 'location.division': 1, 'location.district': 1 });

export const Service = models.Service || model<IService>('Service', serviceSchema);