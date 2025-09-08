// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-banner\banner.service.ts

import { IClassifiedBanner } from './banner.interface';
import { ClassifiedBanner } from './banner.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createBannerInDB = async (payload: Partial<IClassifiedBanner>) => {
  const result = await ClassifiedBanner.create(payload);
  return result;
};

// সাধারণ ব্যবহারকারীদের জন্য শুধুমাত্র active ব্যানারগুলো দেখানো হবে
const getAllPublicBannersFromDB = async () => {
  const result = await ClassifiedBanner.find({ status: 'active' }).sort({ createdAt: -1 });
  return result;
};

const deleteBannerFromDB = async (id: string) => {
    const banner = await ClassifiedBanner.findById(id);
    if (!banner) { throw new Error("Banner not found"); }

    // Cloudinary থেকে ছবিটি ডিলিট করা হচ্ছে
    await deleteFromCloudinary(banner.bannerImage);
    
    await ClassifiedBanner.findByIdAndDelete(id);
    return null;
};

export const ClassifiedBannerServices = {
  createBannerInDB,
  getAllPublicBannersFromDB,
  deleteBannerFromDB,
};