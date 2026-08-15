/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminNotification } from '@/lib/utils/createAdminNotification';
import { IClassifiedAd } from './ad.interface';
import { ClassifiedAd } from './ad.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import mongoose, { Types } from 'mongoose';

const createAdInDB = async (payload: Partial<IClassifiedAd>) => {
  const result = await ClassifiedAd.create({ ...payload, status: 'pending' });

  // ✅ Admin Notification for New Ad
  await createAdminNotification(
    'buy_sell_ad',
    `New Buy & Sell Ad pending approval: ${result.title}`,
    `/general/buy/sell/listing` 
  );

  return result;
};

const searchAdsInDB = async (filters: Record<string, any>, options: { onlyActive?: boolean } = { onlyActive: true }) => {
  const query: Record<string, any> = {};

  if (options.onlyActive) {
    query.status = 'active';
  }

  if (filters.user) query.user = new Types.ObjectId(filters.user);

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
    .populate('user', 'name profilePicture phoneNumber')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('brand', 'name')
    .populate('productModel', 'name');

  if (!ad) {
    throw new Error('Ad not found.');
  }
  return ad;
};

const updateAdInDB = async (adId: string, userId: string, userRole: string, payload: Partial<IClassifiedAd>) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found!');

  const isOwner = ad.user.toString() === userId;
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAdmin) {
    throw new Error('Forbidden: Only the owner can edit the ad details.');
  }

  // ✅ Owner's own edit always goes back to pending for re-review
  if (isOwner) {
    payload.status = 'pending';
    
    // ✅ MAGIC FIX: Notify Admin upon Ad Edit
    await createAdminNotification(
      'buy_sell_ad_update',
      `An ad was updated and needs re-approval: ${payload.title || ad.title}`,
      `/general/buy/sell/listing`
    );
  }

  return await ClassifiedAd.findByIdAndUpdate(adId, payload, { new: true });
};

const deleteAdFromDB = async (adId: string, userId: string, userRole: string) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) throw new Error('Ad not found!');

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

// ✅ UPDATE STATUS: Admin Only
const updateAdStatusInDB = async (adId: string, status: string) => {
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) {
    throw new Error('Ad not found!');
  }
  ad.status = status as 'pending' | 'active' | 'sold' | 'inactive';
  await ad.save();
  return ad;
};

const getMyAdsFromDB = async (userId: string) => {
  return await ClassifiedAd.find({ user: new Types.ObjectId(userId) })
    .populate('category', 'name')
    .sort({ createdAt: -1 });
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
  getMyAdsFromDB, 
};