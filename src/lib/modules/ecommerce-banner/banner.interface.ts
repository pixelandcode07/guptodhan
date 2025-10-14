import { Document } from 'mongoose';

export interface IEcommerceBanner extends Document {
  bannerImage: string; // Cloudinary URL
  bannerPosition: 'top-homepage' | 'left-homepage' | 'right-homepage' | 'middle-homepage' | 'bottom-homepage' | 'top-shoppage';
  textPosition: 'left' | 'right';
  bannerLink?: string;
  subTitle?: string;
  bannerTitle: string;
  bannerDescription?: string;
  buttonText?: string;
  buttonLink?: string;
  status: 'active' | 'inactive';
} 