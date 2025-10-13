/* eslint-disable @typescript-eslint/no-explicit-any */
import { IClassifiedAd } from './ad.interface';
import { ClassifiedAd } from './ad.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import mongoose from 'mongoose';

const createAdInDB = async (payload: Partial<IClassifiedAd>) => {
  return await ClassifiedAd.create(payload);
};

const searchAdsInDB = async (filters: Record<string, any>) => {
  const query: Record<string, any> = { status: 'active' };
  if (filters.division) query.division = new RegExp(`^${filters.division}$`, 'i');
  if (filters.district) query.district = new RegExp(`^${filters.district}$`, 'i');
  if (filters.upazila) query.upazila = new RegExp(`^${filters.upazila}$`, 'i');

  return await ClassifiedAd.find(query)
    .populate('user', 'name profilePicture')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('brand', 'name logo')
    .populate('productModel', 'name')
    .sort({ createdAt: -1 });
};

const getSingleAdFromDB = async (adId: string) => {
  return await ClassifiedAd.findById(adId)
    .populate('user', 'name email phoneNumber profilePicture')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('brand', 'name')
    .populate('productModel', 'name');
};


// ✅ NEW: সকল فعال বিজ্ঞাপন দেখানোর জন্য
const getAllPublicAdsFromDB = async () => {
  return await ClassifiedAd.find({ status: 'active' })
    .populate('user', 'name profilePicture') // বিক্রেতার নাম ও ছবি দেখানোর জন্য
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .sort({ createdAt: -1 });
};

// ✅ NEW: একটি নির্দিষ্ট বিজ্ঞাপন তার ID দিয়ে দেখানোর জন্য
const getPublicAdByIdFromDB = async (id: string) => {
  const ad = await ClassifiedAd.findById(id)
    .populate('user', 'name profilePicture')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('brand', 'name')
    .populate('productModel', 'name');

  if (!ad || ad.status !== 'active') {
    throw new Error('Ad not found or is not active.');
  }
  return ad;
};


const updateAdInDB = async (adId: string, userId: string, payload: Partial<IClassifiedAd>) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found!');
  if (ad.user.toString() !== userId) throw new Error('Forbidden');
  return await ClassifiedAd.findByIdAndUpdate(adId, payload, { new: true });
};

const deleteAdFromDB = async (adId: string, userId: string) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found!');
  if (ad.user.toString() !== userId) throw new Error('Forbidden');

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (ad.images?.length) {
    await Promise.all(ad.images.map((url: string) => deleteFromCloudinary(url)));
    }
    await ClassifiedAd.findByIdAndDelete(adId, { session });
    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const ClassifiedAdServices = {
  createAdInDB,
  searchAdsInDB,
  getSingleAdFromDB,
  updateAdInDB,
  deleteAdFromDB,
  getAllPublicAdsFromDB,
  getPublicAdByIdFromDB,
};
