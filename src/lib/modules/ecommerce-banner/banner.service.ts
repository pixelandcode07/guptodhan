import { IEcommerceBanner } from './banner.interface';
import { EcommerceBanner } from './banner.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import { getCachedData, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

/**
 * 🆕 Create Banner
 * - Creates entry
 * - 🔥 Invalidates Cache (So new banner shows up instantly)
 */
const createBannerInDB = async (payload: Partial<IEcommerceBanner>) => {
  const result = await EcommerceBanner.create(payload);
  
  // 🗑️ Clear Cache
  await deleteCachePattern(CacheKeys.PATTERNS.BANNER_ALL);
  
  return result;
};

/**
 * 📋 Get All Banners (Admin)
 * - Cached for Admin Dashboard speed
 */
const getAllBannersFromDB = async () => {
  const cacheKey = CacheKeys.BANNER.ALL;

  return getCachedData(
    cacheKey,
    async () => {
      // .lean() makes query faster by returning plain objects instead of Mongoose Documents
      return EcommerceBanner.find({}).sort({ orderCount: 1 }).lean();
    },
    CacheTTL.SHORT // 5 mins cache for admin
  );
};

/**
 * 🚀 Get Public Banners (Homepage) - HEAVILY CACHED
 * - This is the most important function for website speed
 */
const getPublicBannersByPositionFromDB = async (position: string) => {
  const cacheKey = CacheKeys.BANNER.BY_POSITION(position);

  return getCachedData(
    cacheKey,
    async () => {
      return EcommerceBanner.find({ 
        bannerPosition: position, 
        status: 'active' 
      })
      .sort({ orderCount: 1 }) // সাজানো ব্যানার দেখাবে
      .select('-createdAt -updatedAt -__v') // অপ্রয়োজনীয় ডাটা বাদ
      .lean();
    },
    CacheTTL.BANNER_PUBLIC // 1 Hour cache
  );
};

/**
 * ✏️ Update Banner
 * - Updates DB
 * - 🔥 Clears Cache
 */
const updateBannerInDB = async (id: string, payload: Partial<IEcommerceBanner>) => {
  if (payload.bannerImage) {
    const existingBanner = await EcommerceBanner.findById(id);
    if (existingBanner?.bannerImage) {
      await deleteFromCloudinary(existingBanner.bannerImage);
    }
  }

  const result = await EcommerceBanner.findByIdAndUpdate(id, payload, { new: true });

  // 🗑️ Clear Cache because content changed
  await deleteCachePattern(CacheKeys.PATTERNS.BANNER_ALL);

  return result;
};

/**
 * 🗑️ Delete Banner
 * - Deletes from DB & Cloudinary
 * - 🔥 Clears Cache
 */
const deleteBannerInDB = async (id: string) => {
  const banner = await EcommerceBanner.findById(id);
  if (!banner) throw new Error("Banner not found.");
  
  if (banner.bannerImage) await deleteFromCloudinary(banner.bannerImage);
  
  const result = await EcommerceBanner.findByIdAndDelete(id);

  // 🗑️ Clear Cache
  await deleteCachePattern(CacheKeys.PATTERNS.BANNER_ALL);

  return result;
};

/**
 * 🔄 Reorder Banners
 * - Updates Order
 * - 🔥 Clears Cache (So new order reflects immediately)
 */
export const reorderBannerService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('Banner array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    EcommerceBanner.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  // 🗑️ Clear Cache is Critical here
  await deleteCachePattern(CacheKeys.PATTERNS.BANNER_ALL);

  return { message: 'Banner reordered successfully!' };
};

export const EcommerceBannerServices = {
  createBannerInDB,
  getAllBannersFromDB,
  getPublicBannersByPositionFromDB,
  updateBannerInDB,
  deleteBannerInDB,
  reorderBannerService
};