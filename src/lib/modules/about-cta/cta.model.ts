// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-cta\cta.model.ts
import { Schema, model, models } from 'mongoose';
import { IAboutCta } from './cta.interface';

const aboutCtaSchema = new Schema<IAboutCta>({
  ctaImage: { type: String, required: true },
  ctaTitle: { type: String, required: true },
  ctaLink: { type: String, required: true },
  ctaButtonText: { type: String, required: true },
  ctaDescription: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const AboutCta = models.AboutCta || model<IAboutCta>('AboutCta', aboutCtaSchema);