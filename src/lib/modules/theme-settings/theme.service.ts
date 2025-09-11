// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\theme-settings\theme.service.ts

import { IThemeSettings } from './theme.interface';
import { ThemeSettings } from './theme.model';

// Upsert logic: যদি কোনো থিম ডকুমেন্ট না থাকে, তবে নতুন তৈরি করবে,
// আর থাকলে, পুরনোটিকে আপডেট করবে
const createOrUpdateThemeInDB = async (payload: Partial<IThemeSettings>) => {
  return await ThemeSettings.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

const getPublicThemeFromDB = async () => {
  return await ThemeSettings.findOne();
};

export const ThemeSettingsServices = {
  createOrUpdateThemeInDB,
  getPublicThemeFromDB,
};