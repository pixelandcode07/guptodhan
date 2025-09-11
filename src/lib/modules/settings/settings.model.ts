// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\settings\settings.model.ts

import { Schema, model, models } from 'mongoose';
import { ISettings } from './settings.interface';

const settingsSchema = new Schema<ISettings>({
  primaryLogoLight: { type: String, required: true },
  secondaryLogoDark: { type: String, required: true },
  favicon: { type: String, required: true },
  companyName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  companyEmail: { type: String, required: true },
  shortDescription: { type: String, required: true },
  companyAddress: { type: String, required: true },
  companyMapLink: { type: String },
  tradeLicenseNo: { type: String },
  tinNo: { type: String },
  binNo: { type: String },
  footerCopyrightText: { type: String, required: true },
  paymentBanner: { type: String },
  userBanner: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Settings = models.Settings || model<ISettings>('Settings', settingsSchema);