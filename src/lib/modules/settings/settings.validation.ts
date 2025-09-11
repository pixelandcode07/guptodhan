// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\settings\settings.validation.ts

import { z } from 'zod';

// এই স্কিমাটি শুধুমাত্র টেক্সট ফিল্ড এবং URL ভ্যালিডেট করবে
// ফাইল আপলোড কন্ট্রোলারে হ্যান্ডেল করা হবে
export const updateSettingsValidationSchema = z.object({
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  companyEmail: z.string().email().optional(),
  shortDescription: z.string().optional(),
  companyAddress: z.string().optional(),
  companyMapLink: z.string().url().optional(),
  tradeLicenseNo: z.string().optional(),
  tinNo: z.string().optional(),
  binNo: z.string().optional(),
  footerCopyrightText: z.string().optional(),
  isActive: z.boolean().optional(),
  // Image URLs will be added by the controller after upload
  primaryLogoLight: z.string().url().optional(),
  secondaryLogoDark: z.string().url().optional(),
  favicon: z.string().url().optional(),
  paymentBanner: z.string().url().optional(),
  userBanner: z.string().url().optional(),
});