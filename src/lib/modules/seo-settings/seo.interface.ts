// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\seo-settings\seo.interface.ts

import { Document } from 'mongoose';

export interface ISeoSettings extends Document {
  pageIdentifier: string; // যেমন: 'homepage', 'about-us'
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string; // Cloudinary থেকে পাওয়া URL
}