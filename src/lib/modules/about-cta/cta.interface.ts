// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-cta\cta.interface.ts
import { Document } from 'mongoose';

export interface IAboutCta extends Document {
  ctaImage: string;
  ctaTitle: string;
  ctaLink: string;
  ctaButtonText: string;
  ctaDescription?: string;
  isActive: boolean;
}