import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import { ChildCategoryModel } from '../models/ecomChildCategory.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';
import { VendorProductModel } from '../../product/vendorProduct.model';
import { BrandModel } from '../../product-config/models/brandName.model';
import { ProductSize } from '../../product-config/models/productSize.model';

// ✅ Redis Cache Imports
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

// ================================================================
// 📝 CREATE CHILD CATEGORY
// ================================================================
const createChildCategoryInDB = async (payload: Partial<IChildCategory>) => {
  const result = await ChildCategoryModel.create(payload);

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);

  return result;
};

// ================================================================
// 📋 GET ALL CHILD CATEGORIES (WITH CACHE + AGGREGATION)
// ================================================================
const getAllChildCategoriesFromDB = async () => {
  const cacheKey = CacheKeys.CHILDCATEGORY.ALL;

  return getCachedData(
    cacheKey,
    async () => {
      // ✅ Use aggregation instead of populate
      const result = await ChildCategoryModel.aggregate([
        {
          $lookup: {
            from: 'categorymodels',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: 'subcategorymodels',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategory',
          },
        },
        { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },

        {
          $project: {
            childCategoryId: 1,
            name: 1,
            slug: 1,
            status: 1,
            icon: 1,
            createdAt: 1,
            'category.name': 1,
            'category._id': 1,
            'subCategory.name': 1,
            'subCategory._id': 1,
          },
        },
        { $sort: { name: 1 } },
      ]);

      return result;
    },
    CacheTTL.CHILDCATEGORY_LIST
  );
};

// ================================================================
// 🔍 GET CHILD CATEGORIES BY SUBCATEGORY (WITH CACHE)
// ================================================================
const getChildCategoriesBySubCategoryFromDB = async (subCategoryId: string) => {
  const cacheKey = CacheKeys.CHILDCATEGORY.BY_SUBCATEGORY(subCategoryId);

  return getCachedData(
    cacheKey,
    async () => {
      const result = await ChildCategoryModel.find({
        subCategory: new Types.ObjectId(subCategoryId),
        status: 'active',
      })
        .sort({ name: 1 })
        .lean();

      return result;
    },
    CacheTTL.CHILDCATEGORY_LIST
  );
};

// ================================================================
// ✏️ UPDATE CHILD CATEGORY
// ================================================================
const updateChildCategoryInDB = async (id: string, payload: Partial<IChildCategory>) => {
  const result = await ChildCategoryModel.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new Error('ChildCategory not found to update.');
  }

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey(CacheKeys.CHILDCATEGORY.BY_SUBCATEGORY(result.subCategory.toString()));

  return result;
};

// ================================================================
// 🗑️ DELETE CHILD CATEGORY
// ================================================================
const deleteChildCategoryFromDB = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ID format: ${id}`);
  }

  // ✅ Document না থাকলেও cache clear করে দাও
  const existing = await ChildCategoryModel.findById(id).lean();
  
  if (!existing) {
    // ✅ MongoDB তে নেই কিন্তু cache এ থাকতে পারে — cache clear করে দাও
    await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
    await deleteCacheKey(CacheKeys.CHILDCATEGORY.ALL);
    console.warn(`⚠️ Document not in MongoDB but clearing stale cache for ID: ${id}`);
    return null; // ✅ Error throw না করে gracefully return
  }

  const existingModel = await ClassifiedAd.findOne({ 
    children: new Types.ObjectId(id) 
  });

  if (existingModel) {
    throw new Error('Cannot delete: this child category is used in a classified ad.');
  }

  const result = await ChildCategoryModel.findByIdAndDelete(id);

  // ✅ Delete এর পর সব related cache clear
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey(CacheKeys.CHILDCATEGORY.ALL);
  await deleteCacheKey(CacheKeys.CHILDCATEGORY.BY_SUBCATEGORY(result!.subCategory.toString()));

  return null;
};

// ================================================================
// 🔍 GET PRODUCTS BY CHILD CATEGORY SLUG WITH FILTERS (OPTIMIZED)
// ================================================================

// ✅ Helper: Create flexible regex
const createFlexibleRegex = (text: string) => {
  let escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  escaped = escaped.replace(/['']/g, "['']");
  return new RegExp(`^${escaped.trim()}$`, "i");
};

const getProductsByChildCategorySlugWithFiltersFromDB = async (
  slug: string,
  filters: {
    search?: string;
    brand?: string;
    size?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    page?: number;   // ✅ নতুন
    limit?: number;  // ✅ নতুন
  }
) => {
  const {
    page = 1,
    limit = 12,
    ...restFilters
  } = filters;

  const skip = (page - 1) * limit;

  const filterHash = JSON.stringify(filters);
  const cacheKey = CacheKeys.CHILDCATEGORY.PRODUCTS_BY_SLUG(slug, filterHash);

  return getCachedData(
    cacheKey,
    async () => {
      const childCategory = await ChildCategoryModel.findOne({
        slug: { $regex: new RegExp(`^${slug}$`, 'i') },
        status: 'active',
      }).lean();

      if (!childCategory) return null;

      const childCategoryData = childCategory as any;

      const matchStage: any = {
        childCategory: new Types.ObjectId(childCategoryData._id),
        status: 'active',
      };

      if (restFilters.brand) {
        const regex = createFlexibleRegex(restFilters.brand);
        const brandDoc = await BrandModel.findOne({ name: { $regex: regex } }).lean();
        if (brandDoc) matchStage.brand = (brandDoc as any)._id;
        else return { childCategory: childCategoryData, products: [], totalProducts: 0, totalPages: 0, page };
      }

      if (restFilters.size) {
        const regex = createFlexibleRegex(restFilters.size);
        const sizeDoc = await ProductSize.findOne({ name: { $regex: regex } }).lean();
        if (sizeDoc) matchStage['productOptions.size'] = (sizeDoc as any)._id;
        else return { childCategory: childCategoryData, products: [], totalProducts: 0, totalPages: 0, page };
      }

      if (restFilters.search) {
        const searchRegex = { $regex: restFilters.search, $options: 'i' };
        matchStage.$or = [
          { productTitle: searchRegex },
          { productTag: { $in: [searchRegex] } },
        ];
      }

      if (restFilters.priceMin !== undefined || restFilters.priceMax !== undefined) {
        const priceCondition: any = {};
        if (restFilters.priceMin !== undefined) priceCondition.$gte = restFilters.priceMin;
        if (restFilters.priceMax !== undefined) priceCondition.$lte = restFilters.priceMax;
        if (!matchStage.$or) matchStage.$or = [];
        matchStage.$or.push(
          { productPrice: priceCondition },
          { discountPrice: priceCondition },
        );
      }

      let sortStage: any = { createdAt: -1 };
      if (restFilters.sort === 'priceLowHigh') sortStage = { productPrice: 1 };
      if (restFilters.sort === 'priceHighLow') sortStage = { productPrice: -1 };

      // ✅ Total count
      const totalProducts = await VendorProductModel.countDocuments(matchStage);
      const totalPages = Math.ceil(totalProducts / limit);

      const products = await VendorProductModel.aggregate([
        { $match: matchStage },
        { $sort: sortStage },
        { $skip: skip },   // ✅
        { $limit: limit }, // ✅

        // ... বাকি সব lookup আগের মতোই থাকবে
        {
          $lookup: {
            from: 'categorymodels',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'subcategorymodels',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategory',
          },
        },
        { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'childcategorymodels',
            localField: 'childCategory',
            foreignField: '_id',
            as: 'childCategory',
          },
        },
        { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'brandmodels',
            localField: 'brand',
            foreignField: '_id',
            as: 'brand',
          },
        },
        { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'storemodels',
            localField: 'vendorStoreId',
            foreignField: '_id',
            as: 'vendorStoreId',
          },
        },
        { $unwind: { path: '$vendorStoreId', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'productmodels',
            localField: 'productModel',
            foreignField: '_id',
            as: 'productModel',
          },
        },
        { $unwind: { path: '$productModel', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            slug: {
              $ifNull: ['$slug', { $concat: ['product-', { $toString: '$_id' }] }],
            },
          },
        },
        {
          $project: {
            _id: 1,
            slug: 1,
            'category.name': 1,
            'category.slug': 1,
            'subCategory.name': 1,
            'subCategory.slug': 1,
            'childCategory.name': 1,
            'childCategory.slug': 1,
            'brand.name': 1,
            'brand.brandLogo': 1,
            'vendorStoreId.storeName': 1,
            'productModel.name': 1,
            productTitle: 1,
            thumbnailImage: 1,
            productPrice: 1,
            discountPrice: 1,
            stock: 1,
            status: 1,
            productOptions: 1,
            createdAt: 1,
          },
        },
      ]);

      return {
        childCategory: childCategoryData,
        products,
        totalProducts,
        totalPages,
        page,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    },
    CacheTTL.CHILDCATEGORY_PRODUCTS
  );
};

// ================================================================
// 📤 EXPORTS
// ================================================================
export const ChildCategoryServices = {
  createChildCategoryInDB,
  getAllChildCategoriesFromDB,
  getChildCategoriesBySubCategoryFromDB,
  updateChildCategoryInDB,
  deleteChildCategoryFromDB,
  getProductsByChildCategorySlugWithFiltersFromDB,
};