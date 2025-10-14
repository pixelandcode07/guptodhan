import { Schema, model, models } from 'mongoose';
import { IEcommerceBanner } from './banner.interface';

const bannerSchema = new Schema<IEcommerceBanner>({
  bannerImage: { type: String, required: true },
  bannerPosition: { type: String, enum: ['top-homepage', 'left-homepage', 'right-homepage', 'middle-homepage', 'bottom-homepage', 'top-shoppage'], required: true },
  textPosition: { type: String, enum: ['left', 'right'], required: true },
  bannerLink: { type: String },
  subTitle: { type: String },
  bannerTitle: { type: String, required: true },
  bannerDescription: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const EcommerceBanner = models.EcommerceBanner || model<IEcommerceBanner>('EcommerceBanner', bannerSchema); 