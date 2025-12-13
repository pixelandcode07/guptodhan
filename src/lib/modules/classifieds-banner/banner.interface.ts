
import { Document } from 'mongoose';

export interface IClassifiedBanner extends Document {
  bannerImage: string; // URL from Cloudinary
  bannerDescription?: string;
  status: 'active' | 'inactive';
}