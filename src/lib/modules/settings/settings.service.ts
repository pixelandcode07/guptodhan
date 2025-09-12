// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\settings\settings.service.ts

import { ISettings } from './settings.interface';
import { Settings } from './settings.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

// Upsert logic: যদি কোনো সেটিংস ডকুমেন্ট না থাকে, তবে নতুন তৈরি করবে,
// আর থাকলে, পুরনোটিকে আপডেট করবে
const createOrUpdateSettingsInDB = async (payload: Partial<ISettings>) => {
  const existingSettings = await Settings.findOne();

  // যদি নতুন ইমেজ আপলোড করা হয়, তাহলে পুরনো ইমেজ ডিলিট করা
  if (existingSettings) {
      const fieldsToDelete: (keyof ISettings)[] = ['primaryLogoLight', 'secondaryLogoDark', 'favicon', 'paymentBanner', 'userBanner'];
      for (const field of fieldsToDelete) {
          if (payload[field] && existingSettings[field]) {
              await deleteFromCloudinary(existingSettings[field] as string);
          }
      }
  }

  return await Settings.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

const getPublicSettingsFromDB = async () => {
  return await Settings.findOne({ isActive: true });
};

export const SettingsServices = {
  createOrUpdateSettingsInDB,
  getPublicSettingsFromDB,
};