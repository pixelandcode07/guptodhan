import { IReview } from './productReview.interface';
import { ReviewModel } from './productReview.model';
import { Types } from 'mongoose';

// ✅ Redis Cache Imports
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

// ================================================================
// 📝 CREATE REVIEW
// ================================================================
const createReviewInDB = async (payload: Partial<IReview>) => {
  const result = await ReviewModel.create(payload);

  // 🗑️ Clear caches
  if (payload.productId) {
    await deleteCacheKey(CacheKeys.REVIEW.BY_PRODUCT(payload.productId.toString()));
    await deleteCacheKey(CacheKeys.REVIEW.STATS_BY_PRODUCT(payload.productId.toString()));
  }
  if (payload.userId) {
    await deleteCacheKey(CacheKeys.REVIEW.BY_USER(payload.userId.toString()));
  }
  await deleteCachePattern(CacheKeys.PATTERNS.REVIEW_ALL);

  return result;
};

// ================================================================
// 📋 GET ALL REVIEWS (WITH CACHE)
// ================================================================
const getAllReviewsFromDB = async () => {
  const cacheKey = CacheKeys.REVIEW.ALL;

  return getCachedData(
    cacheKey,
    async () => {
      const result = await ReviewModel.find()
        .sort({ uploadedTime: -1 })
        .lean();
      return result;
    },
    CacheTTL.REVIEW_LIST
  );
};

// ================================================================
// 🔍 GET REVIEWS BY USER (WITH CACHE + AGGREGATION)
// ================================================================
const getReviewsByUserFromDB = async (userId: string) => {
  const cacheKey = CacheKeys.REVIEW.BY_USER(userId);

  return getCachedData(
    cacheKey,
    async () => {
      // ✅ Use aggregation instead of populate
      const result = await ReviewModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        { $sort: { uploadedTime: -1 } },

        // Lookup product
        {
          $lookup: {
            from: 'vendorproductmodels',
            localField: 'productId',
            foreignField: '_id',
            as: 'productId',
          },
        },
        { $unwind: { path: '$productId', preserveNullAndEmptyArrays: true } },

        // Project needed fields
        {
          $project: {
            reviewId: 1,
            rating: 1,
            comment: 1,
            uploadedTime: 1,
            reviewImages: 1,
            'productId.productTitle': 1,
            'productId.thumbnailImage': 1,
            'productId._id': 1,
            createdAt: 1,
          },
        },
      ]);

      return result;
    },
    CacheTTL.REVIEW_BY_USER
  );
};

// ================================================================
// ✏️ UPDATE REVIEW
// ================================================================
const updateReviewInDB = async (id: string, payload: Partial<IReview>) => {
  const result = await ReviewModel.findByIdAndUpdate(id, payload, { new: true });
  
  if (!result) {
    throw new Error('Review not found to update.');
  }

  // 🗑️ Clear caches
  await deleteCacheKey(CacheKeys.REVIEW.BY_ID(id));
  await deleteCacheKey(CacheKeys.REVIEW.BY_PRODUCT(result.productId.toString()));
  await deleteCacheKey(CacheKeys.REVIEW.STATS_BY_PRODUCT(result.productId.toString()));
  if (result.userId) {
    await deleteCacheKey(CacheKeys.REVIEW.BY_USER(result.userId.toString()));
  }
  await deleteCachePattern(CacheKeys.PATTERNS.REVIEW_ALL);

  return result;
};

// ================================================================
// 🗑️ DELETE REVIEW
// ================================================================
const deleteReviewFromDB = async (id: string) => {
  const result = await ReviewModel.findByIdAndDelete(id);
  
  if (!result) {
    throw new Error('Review not found to delete.');
  }

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.REVIEW_ALL);
  await deleteCacheKey(CacheKeys.REVIEW.BY_PRODUCT(result.productId.toString()));
  await deleteCacheKey(CacheKeys.REVIEW.STATS_BY_PRODUCT(result.productId.toString()));

  return null;
};

// ================================================================
// 🔍 GET REVIEWS BY PRODUCT (WITH CACHE)
// ================================================================
const getReviewsByProductFromDB = async (productId: string) => {
  const cacheKey = CacheKeys.REVIEW.BY_PRODUCT(productId);

  return getCachedData(
    cacheKey,
    async () => {
      const result = await ReviewModel.find({
        productId: new Types.ObjectId(productId),
      })
        .sort({ uploadedTime: -1 })
        .lean();
      return result;
    },
    CacheTTL.REVIEW_BY_PRODUCT
  );
};

// ================================================================
// 📊 GET REVIEW STATISTICS BY PRODUCT (BONUS - WITH CACHE)
// ================================================================
const getReviewStatsByProductFromDB = async (productId: string) => {
  const cacheKey = CacheKeys.REVIEW.STATS_BY_PRODUCT(productId);

  return getCachedData(
    cacheKey,
    async () => {
      const stats = await ReviewModel.aggregate([
        { $match: { productId: new Types.ObjectId(productId) } },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: '$rating' },
            fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
            fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
            threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
            twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
            oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          },
        },
      ]);

      return stats[0] || {
        totalReviews: 0,
        averageRating: 0,
        fiveStars: 0,
        fourStars: 0,
        threeStars: 0,
        twoStars: 0,
        oneStar: 0,
      };
    },
    CacheTTL.REVIEW_STATS
  );
};

// ================================================================
// 📤 EXPORTS
// ================================================================
export const ReviewServices = {
  createReviewInDB,
  getAllReviewsFromDB,
  getReviewsByUserFromDB,
  getReviewsByProductFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
  getReviewStatsByProductFromDB, // ✅ Bonus function
};