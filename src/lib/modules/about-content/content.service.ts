// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-content\content.service.ts
import { IAboutContent } from './content.interface';
import { AboutContent } from './content.model';

// একটি মাত্র ডকুমেন্ট থাকবে, তাই findOne ব্যবহার করা হচ্ছে
const getContentFromDB = async () => {
  return await AboutContent.findOne({ status: 'active' });
};

// যদি কোনো ডকুমেন্ট না থাকে, তাহলে তৈরি করবে, থাকলে আপডেট করবে (Upsert)
const createOrUpdateContentInDB = async (payload: Partial<IAboutContent>) => {
  return await AboutContent.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

export const AboutContentServices = {
  getContentFromDB,
  createOrUpdateContentInDB,
};