import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import { SubCategoryModel } from '../models/ecomSubCategory.model';
import '../models/ecomCategory.model';
import mongoose, { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';
import { VendorProductModel } from '../../product/vendorProduct.model';
import { BrandModel } from '../../product-config/models/brandName.model';
import { ProductSize } from '../../product-config/models/productSize.model';

// ✅ Redis Cache Imports
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

// ================================================================
// 📝 CREATE SUBCATEGORY
// ================================================================
const createSubCategoryInDB = async (payload: Partial<ISubCategory>) => {
  const result = await SubCategoryModel.create(payload);

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey('subcategories:all'); // ✅ এই লাইনটা যোগ করো

  return result;
};

// ================================================================
// 📋 GET ALL SUBCATEGORIES (WITH CACHE + AGGREGATION)
// ================================================================
const getAllSubCategoriesFromDB = async () => {
  const cacheKey = 'subcategories:all';

  return getCachedData(
    cacheKey,
    async () => {
      // ✅ Use aggregation instead of populate
      const result = await SubCategoryModel.aggregate([
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
          $project: {
            subCategoryId: 1,
            name: 1,
            slug: 1,
            status: 1,
            isFeatured: 1,
            isNavbar: 1,
            subCategoryIcon: 1,
            subCategoryBanner: 1,
            createdAt: 1,
            'category.name': 1,
            'category._id': 1,
          },
        },
        { $sort: { name: 1 } },
      ]);

      return result;
    },
    CacheTTL.CATEGORY_LIST
  );
};

// ================================================================
// 🔍 GET SUBCATEGORIES BY CATEGORY (WITH CACHE)
// ================================================================
const getSubCategoriesByCategoryFromDB = async (categoryId: string) => {
  const cacheKey = `subcategories:by-category:${categoryId}`;

  return getCachedData(
    cacheKey,
    async () => {
      const result = await SubCategoryModel.find({
        category: new Types.ObjectId(categoryId),
        status: 'active',
      })
        .sort({ name: 1 })
        .lean();

      return result;
    },
    CacheTTL.CATEGORY_LIST
  );
};

// ================================================================
// ✏️ UPDATE SUBCATEGORY
// ================================================================
// D:\Guptodhan Project\guptodhan\src\lib\modules\ecommerce-category\services\ecomSubCategory.service.ts

const updateSubCategoryInDB = async (id: string, payload: Partial<ISubCategory>) => {
  // 🔍 1. Fetch existing subcategory to get the old slug before updating
  const existingSubCategory = await SubCategoryModel.findById(id);
  
  if (!existingSubCategory) {
    throw new Error('SubCategory not found to update.');
  }

  const oldSlug = existingSubCategory.slug;

  // 📝 2. Perform the update
  const result = await SubCategoryModel.findByIdAndUpdate(id, payload, { 
    new: true, 
    runValidators: true 
  });

  if (!result) {
    throw new Error('Failed to update SubCategory.');
  }

  // 🗑️ 3. Clear general category caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey(`subcategories:by-category:${result.category}`);
  
  // 🔥 CRITICAL FIX: Ei line ta oboshhoi add korben nahole table e image asbe na
  await deleteCacheKey('subcategories:all');

  // 🔥 4. Clear products cache for the OLD slug
  if (oldSlug) {
    await deleteCachePattern(`subcategory:${oldSlug}:products:*`);
  }

  // 🔥 5. Clear products cache for the NEW slug (if it was updated to a new one)
  if (result.slug && result.slug !== oldSlug) {
    await deleteCachePattern(`subcategory:${result.slug}:products:*`);
  }

  return result;
};

// ================================================================
// 🗑️ DELETE SUBCATEGORY
// ================================================================
const deleteSubCategoryFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ 
    subCategory: new Types.ObjectId(id) 
  });

  if (existingModel) {
    throw new Error('Cannot delete this subcategory as it is used in a product model.');
  }

  const result = await SubCategoryModel.findByIdAndDelete(id);

  if (!result) {
    throw new Error('SubCategory not found to delete.');
  }

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey('subcategories:all'); // ✅ এই লাইনটা যোগ করো

  return null;
};

// ================================================================
// 🔍 GET PRODUCTS BY SUBCATEGORY SLUG WITH FILTERS (OPTIMIZED)
// ================================================================

// ✅ Helper: Create flexible regex
const createFlexibleRegex = (text: string) => {
  let escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  escaped = escaped.replace(/['']/g, "['']");
  return new RegExp(`^${escaped.trim()}$`, "i");
};

const getProductsBySubCategorySlugWithFiltersFromDB = async (
  slug: string,
  filters: {
    search?: string;
    brand?: string;
    size?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
  }
) => {
  // ✅ Create cache key
  const filterHash = JSON.stringify(filters);
  const cacheKey = `subcategory:${slug}:products:${filterHash}`;

  return getCachedData(
    cacheKey,
    async () => {
      // Get subcategory
      const subCategory = await SubCategoryModel.findOne({ 
        slug, 
        status: 'active' 
      }).lean();

      if (!subCategory) return null;

      // ✅ Type-safe access
      const subCategoryData = subCategory as any;

      // Build match stage
      const matchStage: any = {
        subCategory: subCategoryData._id,
        status: 'active',
      };

      // Filter: Brand
      if (filters.brand) {
        const regex = createFlexibleRegex(filters.brand);
        const brandDoc = await BrandModel.findOne({ 
          name: { $regex: regex } 
        }).lean();

        if (!brandDoc) {
          return { subCategory: subCategoryData, products: [], totalProducts: 0 };
        }
        matchStage.brand = (brandDoc as any)._id;
      }

      // Filter: Size
      if (filters.size) {
        const regex = createFlexibleRegex(filters.size);
        const sizeDoc = await ProductSize.findOne({ 
          name: { $regex: regex } 
        }).lean();

        if (!sizeDoc) {
          return { subCategory: subCategoryData, products: [], totalProducts: 0 };
        }
        matchStage['productOptions.size'] = (sizeDoc as any)._id;
      }

      // Filter: Search
      if (filters.search) {
        const searchRegex = { $regex: filters.search, $options: 'i' };
        matchStage.$or = [
          { productTitle: searchRegex },
          { productTag: { $in: [searchRegex] } },
        ];
      }

      // Filter: Price
      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        const priceCondition: any = {};
        if (filters.priceMin !== undefined) priceCondition.$gte = filters.priceMin;
        if (filters.priceMax !== undefined) priceCondition.$lte = filters.priceMax;

        if (!matchStage.$or) matchStage.$or = [];
        
        matchStage.$or.push(
          { productPrice: priceCondition },
          { discountPrice: priceCondition },
          { 'productOptions.price': priceCondition },
          { 'productOptions.discountPrice': priceCondition }
        );
      }

      // Sorting
      let sortStage: any = { createdAt: -1 };
      if (filters.sort === 'priceLowHigh') sortStage = { productPrice: 1 };
      if (filters.sort === 'priceHighLow') sortStage = { productPrice: -1 };

      // ✅ Use aggregation
      const products = await VendorProductModel.aggregate([
        { $match: matchStage },
        { $sort: sortStage },

        // Lookup category
        {
          $lookup: {
            from: 'categorymodels',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

        // Lookup subcategory
        {
          $lookup: {
            from: 'subcategorymodels',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategory',
          },
        },
        { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },

        // Lookup child category
        {
          $lookup: {
            from: 'childcategorymodels',
            localField: 'childCategory',
            foreignField: '_id',
            as: 'childCategory',
          },
        },
        { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },

        // Lookup brand
        {
          $lookup: {
            from: 'brandmodels',
            localField: 'brand',
            foreignField: '_id',
            as: 'brand',
          },
        },
        { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },

        // Lookup vendor store
        {
          $lookup: {
            from: 'storemodels',
            localField: 'vendorStoreId',
            foreignField: '_id',
            as: 'vendorStoreId',
          },
        },
        { $unwind: { path: '$vendorStoreId', preserveNullAndEmptyArrays: true } },

        // Lookup product model
        {
          $lookup: {
            from: 'productmodels',
            localField: 'productModel',
            foreignField: '_id',
            as: 'productModel',
          },
        },
        { $unwind: { path: '$productModel', preserveNullAndEmptyArrays: true } },

        // ✅ SLUG SAFETY: Slug না থাকলে বানিয়ে নেবে
        {
          $addFields: {
            slug: { $ifNull: ["$slug", { $concat: ["product-", { $toString: "$_id" }] }] }
          }
        },

        // ✅ PROJECT STAGE (SLUG ADDED HERE)
        {
          $project: {
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
            
            // 🔥 CRITICAL FIX: এই লাইনটি আগে মিসিং ছিল
            slug: 1, 
          },
        },
      ]);

      return {
        subCategory: subCategoryData,
        products,
        totalProducts: products.length,
      };
    },
    CacheTTL.CATEGORY_PRODUCTS
  );
};

// ================================================================
// 📤 EXPORTS
// ================================================================
export const SubCategoryServices = {
  createSubCategoryInDB,
  getAllSubCategoriesFromDB,
  getSubCategoriesByCategoryFromDB,
  updateSubCategoryInDB,
  deleteSubCategoryFromDB,
  getProductsBySubCategorySlugWithFiltersFromDB,
};