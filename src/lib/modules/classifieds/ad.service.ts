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

  if (filters.category) query.category = new Types.ObjectId(filters.category);
  
  if (filters.subCategory) {
    const subCats = Array.isArray(filters.subCategory) ? filters.subCategory : [filters.subCategory];
    query['subCategory.name'] = { $in: subCats.map(s => new RegExp(`^${s}$`, 'i')) };
  }

  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
    query['brand.name'] = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
  }

  if (filters.division) query.division = new RegExp(`^${filters.division}$`, 'i');
  if (filters.district) query.district = new RegExp(`^${filters.district}$`, 'i');
  if (filters.upazila) query.upazila = new RegExp(`^${filters.upazila}$`, 'i');

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  if (filters.title) {
    query.title = { $regex: filters.title, $options: 'i' };
  }

  return await ClassifiedAd.find(query)
    .populate('user', 'name profilePicture')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('brand', 'name logo')
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

const getAllPublicAdsFromDB = async () => {
  return await ClassifiedAd.find({ status: 'active' })
    .populate('user', 'name profilePicture')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .sort({ createdAt: -1 });
};

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

// ✅ UPDATE: ৪টি প্যারামিটার, কিন্তু শুধুমাত্র OWNER এডিট করতে পারবে
const updateAdInDB = async (adId: string, userId: string, userRole: string, payload: Partial<IClassifiedAd>) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found!');

  // লজিক: শুধুমাত্র অ্যাড-এর মালিক (Owner) কন্টেন্ট এডিট করতে পারবে
  // Admin স্ট্যাটাস চেঞ্জ করতে পারবে (সেটা অন্য API), কিন্তু কন্টেন্ট এডিট করতে পারবে না।
  const isOwner = ad.user.toString() === userId;

  if (!isOwner) {
    throw new Error('Forbidden: Only the owner can edit the ad details.');
  }

  return await ClassifiedAd.findByIdAndUpdate(adId, payload, { new: true });
};

// ✅ DELETE: Owner এবং Admin উভয়েই ডিলিট করতে পারবে
const deleteAdFromDB = async (adId: string, userId: string, userRole: string) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found!');

  // লজিক: মালিক অথবা এডমিন - যেই হোক ডিলিট করতে পারবে
  const isOwner = ad.user.toString() === userId;
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAdmin) {
    throw new Error('Forbidden: You are not allowed to delete this ad.');
  }

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

const getPublicAdsByCategoryIdFromDB = async (categoryId: string) => {
  return await ClassifiedAd.find({ 
    category: new Types.ObjectId(categoryId),
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
      { $match: { category: categoryObjectId, status: 'active' } },
      {
        $facet: {
          locations: [
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { count: -1 } }
          ],
          brands: [
            { $match: { brand: { $exists: true, $ne: null } } },
            {
              $lookup: { 
                from: 'brands', 
                localField: 'brand',
                foreignField: '_id',
                as: 'brandDetails'
              }
            },
            { $unwind: '$brandDetails' }, 
            { $group: { _id: "$brandDetails.name", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { name: 1 } }
          ],
          subCategories: [
            { $match: { subCategory: { $exists: true, $ne: null } } },
            {
              $lookup: {
                from: 'classifiedsubcategories', 
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
    return result[0];
  } catch (error) {
    console.error("Error aggregating filters:", error);
    throw new Error("Failed to aggregate filter data.");
  }
};

const getAllAdsForAdminFromDB = async () => {
  return await ClassifiedAd.find({})
    .populate('user', 'name')
    .populate('category', 'name')
    .sort({ createdAt: -1 });
}

// ✅ UPDATE STATUS: Admin Only (Controller checks permission)
const updateAdStatusInDB = async (adId: string, status: string) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) {
    throw new Error('Ad not found!');
  }
  // Type assertion to match model definition
  ad.status = status as 'pending' | 'active' | 'sold' | 'inactive';
  await ad.save();
  return ad;
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
  getAllAdsForAdminFromDB,
  updateAdStatusInDB,
};