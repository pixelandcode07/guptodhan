import { IAboutContent } from './content.interface';
import { AboutContent } from './content.model';

// ✅ FIX: Admin প্যানেলের জন্য status ফিল্টার সরানো হয়েছে। 
// যাতে inactive থাকলেও এডিট করা যায়।
const getContentFromDB = async () => {
  return await AboutContent.findOne({}); 
};

// যদি কোনো ডকুমেন্ট না থাকে, তাহলে তৈরি করবে, থাকলে আপডেট করবে (Upsert)
const createOrUpdateContentInDB = async (payload: Partial<IAboutContent>) => {
  return await AboutContent.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

const updateContentInDB = async (id: string, payload: Partial<IAboutContent>) => {
  return await AboutContent.findByIdAndUpdate(id, payload, { new: true });
};

export const AboutContentServices = {
  getContentFromDB,
  createOrUpdateContentInDB,
  updateContentInDB,
};