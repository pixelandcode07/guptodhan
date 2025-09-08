// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-banner\banner.interface.ts

import { Document } from 'mongoose';

export interface IClassifiedBanner extends Document {
  bannerImage: string; // URL from Cloudinary
  bannerDescription?: string;
  status: 'active' | 'inactive';
}