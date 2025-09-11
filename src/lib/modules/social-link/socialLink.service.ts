// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\social-link\socialLink.service.ts

import { ISocialLink } from './socialLink.interface';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import { SocialLink } from './socialLink.model';

const createSocialLinkInDB = async (payload: Partial<ISocialLink>) => {
  return await SocialLink.create(payload);
};

const getPublicSocialLinksFromDB = async () => {
  return await SocialLink.find().sort({ createdAt: 1 });
};

const updateSocialLinkInDB = async (id: string, payload: Partial<ISocialLink>) => {
  return await SocialLink.findByIdAndUpdate(id, payload, { new: true });
};

const deleteSocialLinkFromDB = async (id: string) => {
  const socialLink = await SocialLink.findById(id);
  if (!socialLink) {
    throw new Error("Social link not found");
  }
  // Cloudinary থেকে আইকনটি ডিলিট করা হচ্ছে
  await deleteFromCloudinary(socialLink.icon);
  await SocialLink.findByIdAndDelete(id);
  return null;
};

export const SocialLinkServices = {
  createSocialLinkInDB,
  getPublicSocialLinksFromDB,
  updateSocialLinkInDB,
  deleteSocialLinkFromDB,
};