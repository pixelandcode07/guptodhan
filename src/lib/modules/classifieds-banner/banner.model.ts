
import { Schema, model, models } from 'mongoose';
import { IClassifiedBanner } from './banner.interface';

const classifiedBannerSchema = new Schema<IClassifiedBanner>({
  bannerImage: { type: String, required: true },
  bannerDescription: { type: String },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
}, { 
    timestamps: true 
});

export const ClassifiedBanner = models.ClassifiedBanner || model<IClassifiedBanner>('ClassifiedBanner', classifiedBannerSchema);