// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-banner\banner.model.ts

import { Schema, model, models } from 'mongoose';
import { IClassifiedBanner } from './banner.interface';

const classifiedBannerSchema = new Schema<IClassifiedBanner>({
  bannerImage: { type: String, required: true },
  bannerDescription: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { 
    timestamps: true 
});

// Next.js-এর 'OverwriteModelError' সমাধান করার জন্য
export const ClassifiedBanner = models.ClassifiedBanner || model<IClassifiedBanner>('ClassifiedBanner', classifiedBannerSchema);