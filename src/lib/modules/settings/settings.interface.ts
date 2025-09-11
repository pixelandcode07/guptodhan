// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\settings\settings.interface.ts

import { Document } from 'mongoose';

export interface ISettings extends Document {
  primaryLogoLight: string;
  secondaryLogoDark: string;
  favicon: string;
  companyName: string;
  phoneNumber: string;
  companyEmail: string;
  shortDescription: string;
  companyAddress: string;
  companyMapLink?: string;
  tradeLicenseNo?: string;
  tinNo?: string;
  binNo?: string;
  footerCopyrightText: string;
  paymentBanner?: string;
  userBanner?: string;
  isActive: boolean;
}