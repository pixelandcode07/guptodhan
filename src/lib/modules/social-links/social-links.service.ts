import { ISocialLinks } from './social-links.interface';
import { SocialLinks } from './social-links.model';

// Upsert logic: একটি মাত্র ডকুমেন্ট তৈরি বা আপডেট করা
const createOrUpdateSocialLinksInDB = async (payload: Partial<ISocialLinks>) => {
  return await SocialLinks.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

// পাবলিক ওয়েবসাইটে দেখানোর জন্য
const getPublicSocialLinksFromDB = async () => {
  return await SocialLinks.findOne();
};

export const SocialLinksServices = {
  createOrUpdateSocialLinksInDB,
  getPublicSocialLinksFromDB,
};