// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\seo-settings\seo.service.ts

import { ISeoSettings } from './seo.interface';
import { SeoSettings } from './seo.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

// Upsert logic: যদি কোনো পেজের জন্য SEO সেটিংস না থাকে, তবে নতুন তৈরি করবে,
// আর থাকলে, পুরনোটিকে আপডেট করবে
const createOrUpdateSeoSettingsInDB = async (pageIdentifier: string, payload: Partial<ISeoSettings>) => {
  const existingSettings = await SeoSettings.findOne({ pageIdentifier });

  // যদি নতুন OG image আপলোড করা হয়, তাহলে পুরনোটি ডিলিট করা
  if (existingSettings && payload.ogImage && existingSettings.ogImage) {
      await deleteFromCloudinary(existingSettings.ogImage);
  }

  return await SeoSettings.findOneAndUpdate(
    { pageIdentifier }, 
    payload, 
    { new: true, upsert: true }
  );
};

const getPublicSeoSettingsFromDB = async (pageIdentifier: string) => {
  return await SeoSettings.findOne({ pageIdentifier });
};

export const SeoSettingsServices = {
  createOrUpdateSeoSettingsInDB,
  getPublicSeoSettingsFromDB,
};