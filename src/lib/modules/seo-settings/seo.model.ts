// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\seo-settings\seo.model.ts

import { Schema, model, models } from 'mongoose';
import { ISeoSettings } from './seo.interface';

const seoSettingsSchema = new Schema<ISeoSettings>({
  pageIdentifier: { type: String, required: true, unique: true, index: true },
  metaTitle: { type: String, required: true },
  metaKeywords: [{ type: String }],
  metaDescription: { type: String, required: true },
  ogTitle: { type: String, required: true },
  ogDescription: { type: String, required: true },
  ogImage: { type: String },
}, { timestamps: true });

export const SeoSettings = models.SeoSettings || model<ISeoSettings>('SeoSettings', seoSettingsSchema);