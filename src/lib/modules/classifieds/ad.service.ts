import { IClassifiedAd } from './ad.interface';
import { ClassifiedAd } from './ad.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createAdInDB = async (payload: Partial<IClassifiedAd>) => {
  return ClassifiedAd.create(payload);
};

const getAllAdsFromDB = async (filters: Record<string, any>) => {
  // একটি বেস কুয়েরি তৈরি করা হচ্ছে, যা শুধুমাত্র active বিজ্ঞাপন দেখাবে
  const query: Record<string, any> = { status: 'active' };

  // যদি URL থেকে কোনো division ফিল্টার আসে, তাহলে সেটিকে কুয়েরিতে যোগ করা হচ্ছে
  if (filters.division) {
    // Regex ব্যবহার করে case-insensitive সার্চ করা হচ্ছে
    query.division = new RegExp(filters.division, 'i');
  }
  // যদি URL থেকে কোনো district ফিল্টার আসে, তাহলে সেটিকেও কুয়েরিতে যোগ করা হচ্ছে
  if (filters.district) {
    query.district = new RegExp(filters.district, 'i');
  }
  // সমাধান: যদি URL থেকে কোনো upazila ফিল্টার আসে, তাহলে সেটিকেও কুয়েরিতে যোগ করা হচ্ছে
  if (filters.upazila) {
    query.upazila = new RegExp(filters.upazila, 'i');
  }
  // ভবিষ্যতে category, price range ইত্যাদির জন্য ফিল্টার এখানে যোগ করা যাবে

  const result = await ClassifiedAd.find(query)
    .populate('user', 'name profilePicture')
    .sort({ createdAt: -1 });
    
  return result;
};

const getSingleAdFromDB = async (adId: string) => {
  return ClassifiedAd.findById(adId);
};

const updateAdInDB = async (adId: string, userId: string, payload: Partial<IClassifiedAd>) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found');
  if (ad.user.toString() !== userId) throw new Error('Unauthorized');
  return ClassifiedAd.findByIdAndUpdate(adId, payload, { new: true });
};

const deleteAdFromDB = async (adId: string, userId: string) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found');
  if (ad.user.toString() !== userId) throw new Error('Unauthorized');

  if (ad.images.length) {
    await Promise.all(ad.images.map((url: string) => deleteFromCloudinary(url)));
  }

  await ClassifiedAd.findByIdAndDelete(adId);
  return null;
};

export const ClassifiedAdServices = {
  createAdInDB,
  getAllAdsFromDB,
  getSingleAdFromDB,
  updateAdInDB,
  deleteAdFromDB,
};
