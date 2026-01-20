import { IProductQA } from './productQNA.interface';
import { ProductQAModel } from './productQNA.model';
import { Types } from 'mongoose';

// ✅ Redis Cache Imports
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

// ================================================================
// 📝 CREATE PRODUCT Q&A
// ================================================================
const createProductQAInDB = async (payload: Partial<IProductQA>) => {
  const result = await ProductQAModel.create(payload);

  // 🗑️ Clear caches
  if (payload.productId) {
    await deleteCacheKey(CacheKeys.QNA.BY_PRODUCT(payload.productId.toString()));
  }
  if (payload.userId) {
    await deleteCacheKey(CacheKeys.QNA.BY_USER(payload.userId.toString()));
  }
  await deleteCachePattern(CacheKeys.PATTERNS.QNA_ALL);

  return result;
};

// ================================================================
// 📋 GET ALL PRODUCT Q&A (WITH CACHE)
// ================================================================
const getAllProductQAFromDB = async () => {
  const cacheKey = CacheKeys.QNA.ALL;

  return getCachedData(
    cacheKey,
    async () => {
      const result = await ProductQAModel.find()
        .sort({ createdAt: -1 })
        .lean();
      return result;
    },
    CacheTTL.QNA_LIST
  );
};

// ================================================================
// 🔍 GET Q&A BY PRODUCT (WITH CACHE)
// ================================================================
const getProductQAByProductFromDB = async (productId: string) => {
  const cacheKey = CacheKeys.QNA.BY_PRODUCT(productId);

  return getCachedData(
    cacheKey,
    async () => {
      const result = await ProductQAModel.find({
        productId: new Types.ObjectId(productId),
        status: 'active',
      })
        .sort({ createdAt: -1 })
        .lean();
      return result;
    },
    CacheTTL.QNA_BY_PRODUCT
  );
};

// ================================================================
// GET Q&A BY USER (WITH CACHE)
// ================================================================
const getProductQAByUserFromDB = async (userId: string) => {
  const cacheKey = CacheKeys.QNA.BY_USER(userId);

  return getCachedData(
    cacheKey,
    async () => {
      const result = await ProductQAModel.find({
        userId: new Types.ObjectId(userId),
      })
        .sort({ createdAt: -1 })
        .lean();
      return result;
    },
    CacheTTL.QNA_BY_USER
  );
};

// ================================================================
// ✏️ UPDATE Q&A WITH ANSWER
// ================================================================
const updateProductQAWithAnswerInDB = async (id: string, payload: Partial<IProductQA>) => {
  const result = await ProductQAModel.findByIdAndUpdate(id, payload, { new: true });
  
  if (!result) {
    throw new Error('Product Q&A not found to update.');
  }

  // 🗑️ Clear caches
  await deleteCacheKey(CacheKeys.QNA.BY_ID(id));
  await deleteCacheKey(CacheKeys.QNA.BY_PRODUCT(result.productId.toString()));
  if (result.userId) {
    await deleteCacheKey(CacheKeys.QNA.BY_USER(result.userId.toString()));
  }
  await deleteCachePattern(CacheKeys.PATTERNS.QNA_ALL);

  return result;
};

// ================================================================
// 🗑️ DELETE PRODUCT Q&A
// ================================================================
const deleteProductQAFromDB = async (id: string) => {
  const result = await ProductQAModel.findByIdAndDelete(id);
  
  if (!result) {
    throw new Error('Product Q&A not found to delete.');
  }

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.QNA_ALL);
  await deleteCacheKey(CacheKeys.QNA.BY_PRODUCT(result.productId.toString()));

  return null;
};

// ================================================================
// 📤 EXPORTS
// ================================================================
export const ProductQAService = {
  createProductQAInDB,
  getAllProductQAFromDB,
  getProductQAByProductFromDB,
  getProductQAByUserFromDB,
  updateProductQAWithAnswerInDB,
  deleteProductQAFromDB,
};