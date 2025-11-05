/* eslint-disable @typescript-eslint/no-explicit-any */
import { IClassifiedAd } from './ad.interface';
import { ClassifiedAd } from './ad.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import mongoose, { Types } from 'mongoose';

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

// ✅ NEW: একটি নির্দিষ্ট ক্যাটাগরির সব বিজ্ঞাপন খোঁজার ফাংশন
const getPublicAdsByCategoryIdFromDB = async (categoryId: string) => {
  return await ClassifiedAd.find({ 
    category: new Types.ObjectId(categoryId), // ক্যাটাগরি ID দিয়ে খোঁজা হচ্ছে
    status: 'active'  
  })
    .populate('user', 'name profilePicture')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .sort({ createdAt: -1 });
};


const getFiltersForCategoryFromDB = async (categoryId: string) => {
  try {
    const categoryObjectId = new Types.ObjectId(categoryId);

    const result = await ClassifiedAd.aggregate([
      // ধাপ ১: শুধুমাত্র এই ক্যাটাগরির فعال বিজ্ঞাপনগুলো ম্যাচ করুন
      {
        $match: {
          category: categoryObjectId,
          status: 'active'
        }
      },
      // ধাপ ২: একই সাথে লোকেশন এবং ব্র্যান্ড অনুযায়ী গণনা করুন
      {
        $facet: {
          // শাখা ক: লোকেশন অনুযায়ী গণনা
          locations: [
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { count: -1 } }
          ],
          // শাখা খ: ব্র্যান্ড অনুযায়ী গণনা
          brands: [
            { $match: { brand: { $exists: true, $ne: null } } }, // শুধু ব্র্যান্ড আছে এমন বিজ্ঞাপন
            {
              $lookup: { // ব্র্যান্ড কালেকশন থেকে ব্র্যান্ডের নাম আনুন
                from: 'brands', // আপনার Brand মডেলের কালেকশনের নাম
                localField: 'brand',
                foreignField: '_id',
                as: 'brandDetails'
              }
            },
            { $unwind: '$brandDetails' }, // অ্যারে থেকে অবজেক্টে রূপান্তর
            { $group: { _id: "$brandDetails.name", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { name: 1 } }
          ],
          // শাখা গ: সাব-ক্যাটাগরি অনুযায়ী গণনা (যদি প্রয়োজন হয়)
          subCategories: [
            { $match: { subCategory: { $exists: true, $ne: null } } },
            {
              $lookup: {
                from: 'classifiedsubcategories', // আপনার SubCategory মডেলের কালেকশনের নাম
                localField: 'subCategory',
                foreignField: '_id',
                as: 'subCategoryDetails'
              }
            },
            { $unwind: '$subCategoryDetails' },
            { $group: { _id: "$subCategoryDetails.name", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { name: 1 } }
          ]
        }
      }
    ]);

    // $facet একটি অ্যারে ফেরত পাঠায়, আমরা প্রথম (এবং একমাত্র) এলিমেন্টটি নেব
    return result[0];

  } catch (error) {
    console.error("Error aggregating filters:", error);
    throw new Error("Failed to aggregate filter data.");
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
  getPublicAdsByCategoryIdFromDB,
  getFiltersForCategoryFromDB,
};
