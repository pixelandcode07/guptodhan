import { ICategory } from "../interfaces/ecomCategory.interface";
import { CategoryModel } from "../models/ecomCategory.model";
import mongoose, { Types } from "mongoose";
import { ClassifiedAd } from "../../classifieds/ad.model";
import { ISubCategory } from "../interfaces/ecomSubCategory.interface";
import { IChildCategory } from "../interfaces/ecomChildCategory.interface";
import { SubCategoryModel } from "../models/ecomSubCategory.model";
import { ChildCategoryModel } from "../models/ecomChildCategory.model";
import { VendorProductModel } from "../../product/vendorProduct.model";
import { BrandModel } from "../../product-config/models/brandName.model";
import { ProductSize } from "../../product-config/models/productSize.model";

// ✅ Redis Cache Imports
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

// ================================================================
// 📝 CREATE CATEGORY
// ================================================================
const createCategoryInDB = async (payload: Partial<ICategory>) => {
  // Find highest orderCount
  const maxOrderCategory = await CategoryModel.findOne()
    .sort({ orderCount: -1 })
    .select("orderCount -_id")
    .lean<{ orderCount: number }>();

  // Set next orderCount
  const nextOrder =
    maxOrderCategory && typeof maxOrderCategory.orderCount === "number"
      ? maxOrderCategory.orderCount + 1
      : 0;

  // Create category with orderCount
  const result = await CategoryModel.create({
    ...payload,
    orderCount: nextOrder,
  });

  // 🗑️ Clear category caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey(CacheKeys.CATEGORY.WITH_HIERARCHY);
  await deleteCacheKey('featured:all-categories'); // ✅ Added
  await deleteCachePattern('featured:*'); // ✅ Added

  return result;
};

// ================================================================
// 📋 GET ALL CATEGORIES (WITH CACHE)
// ================================================================
const getAllCategoriesFromDB = async () => {
  const cacheKey = CacheKeys.CATEGORY.ALL;

  return getCachedData(
    cacheKey,
    async () => {
      const result = await CategoryModel.find({})
        .sort({ orderCount: 1 })
        .lean();
      return result;
    },
    CacheTTL.CATEGORY_LIST
  );
};

// ================================================================
// ⭐ GET FEATURED CATEGORIES (WITH CACHE)
// ================================================================
const getFeaturedEverythingFromDB = async () => {
  const cacheKey = 'featured:all-categories';

  return getCachedData(
    cacheKey,
    async () => {
      // একসাথে তিনটি টেবিল থেকে ডাটা ফেচ করা হচ্ছে
      const [mainCategories, subCategories] = await Promise.all([
        CategoryModel.find({ isFeatured: true, status: 'active' }).lean(),
        SubCategoryModel.find({ isFeatured: true, status: 'active' }).lean(),
      ]);

      // সবগুলোকে একটি ফরম্যাটে সাজানো যাতে ফ্রন্টএন্ডে সমস্যা না হয়
      const formattedMain = mainCategories.map((item: any) => ({
        _id: item._id,
        name: item.name,
        categoryIcon: item.categoryIcon,
        slug: item.slug,
        type: 'main-category'
      }));

      const formattedSub = subCategories.map((item: any) => ({
        _id: item._id,
        name: item.name,
        categoryIcon: item.subCategoryIcon, 
        slug: item.slug,
        type: 'sub-category'
      }));

      return [...formattedMain, ...formattedSub];
    },
    CacheTTL.CATEGORY_LIST
  );
};

// ================================================================
// 🔍 GET PRODUCT IDS BY CATEGORY (WITH CACHE) - FIXED
// ================================================================
export const getProductIdsByCategoryFromDB = async (categoryId: string) => {
  const cacheKey = `category:${categoryId}:product-ids`;

  return getCachedData(
    cacheKey,
    async () => {
      const products = await VendorProductModel.find({
        category: categoryId,
        status: "active",
      })
        .select("_id")
        .lean();

      // ✅ FIX: Type assertion to handle unknown _id type
      return products.map((p: any) => p._id.toString());
    },
    CacheTTL.CATEGORY_PRODUCTS
  );
};

// ================================================================
// 🔍 GET CATEGORY BY ID (WITH CACHE)
// ================================================================
const getCategoryByIdFromDB = async (categoryId: string) => {
  const cacheKey = CacheKeys.CATEGORY.BY_ID(categoryId);

  return getCachedData(
    cacheKey,
    async () => {
      const result = await CategoryModel.findOne({
        categoryId,
        status: "active",
      }).lean();
      return result;
    },
    CacheTTL.CATEGORY_LIST
  );
};

// ================================================================
// ✏️ UPDATE CATEGORY
// ================================================================
const updateCategoryInDB = async (id: string, payload: Partial<ICategory>) => {
  const result = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new Error("Category not found to update.");
  }

  // 🗑️ Clear caches
  await deleteCacheKey(CacheKeys.CATEGORY.BY_ID(result.categoryId));
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey(CacheKeys.CATEGORY.WITH_HIERARCHY); // ✅ Nav Menu update korbe
  await deleteCacheKey('featured:all-categories'); // ✅ Featured update korbe
  await deleteCachePattern('featured:*'); // ✅ Added

  return result;
};

// ================================================================
// 🗑️ DELETE CATEGORY
// ================================================================
const deleteCategoryFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({
    category: new Types.ObjectId(id),
  });

  if (existingModel) {
    throw new Error(
      "Cannot delete this category as it is used in a product model."
    );
  }

  const result = await CategoryModel.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Category not found to delete.");
  }

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey(CacheKeys.CATEGORY.WITH_HIERARCHY); // ✅ Added
  await deleteCacheKey('featured:all-categories'); // ✅ Added
  await deleteCachePattern('featured:*'); // ✅ Added

  return null;
};

// ================================================================
// 🌳 GET ALL CATEGORIES WITH HIERARCHY (OPTIMIZED - WITH CACHE)
// ================================================================
export const getAllSubCategoriesWithChildren = async () => {
  const cacheKey = CacheKeys.CATEGORY.WITH_HIERARCHY;

  return getCachedData(
    cacheKey,
    async () => {
      // ✅ Step 1: Get all navbar main categories
      const mainCategories = await CategoryModel.find({ isNavbar: true })
        .sort({ orderCount: 1 })
        .lean();

      if (!mainCategories || mainCategories.length === 0) return [];

      // ✅ Type-safe: Extract IDs
      const mainIds = mainCategories.map((cat: any) => cat._id);

      // ✅ Step 2: Get all subcategories in ONE query
      const allSubCategories = await SubCategoryModel.find({
        category: { $in: mainIds },
        status: 'active'
      }).lean();

      // ✅ Type-safe: Extract sub IDs
      const subIds = allSubCategories.map((sub: any) => sub._id);

      // ✅ Step 3: Get all child categories in ONE query
      const allChildCategories = await ChildCategoryModel.find({
        subCategory: { $in: subIds },
        status: 'active'
      }).lean();

      // ✅ Step 4: Build hierarchy in JavaScript (Type-safe)
      const result = mainCategories.map((main: any) => {
        const subCategoriesOfThisMain = allSubCategories.filter(
          (sub: any) => sub.category?.toString() === main._id?.toString()
        );

        const subWithChildren = subCategoriesOfThisMain.map((sub: any) => {
          const childrenOfThisSub = allChildCategories.filter(
            (child: any) => child.subCategory?.toString() === sub._id?.toString()
          );

          return {
            subCategoryId: sub.subCategoryId,
            name: sub.name,
            slug: sub.slug,
            children: childrenOfThisSub.map((child: any) => ({
              childCategoryId: child.childCategoryId,
              name: child.name,
              slug: child.slug,
            })),
          };
        });

        return {
          mainCategoryId: main._id?.toString(),
          name: main.name,
          categoryIcon: main.categoryIcon,
          slug: main.slug,
          subCategories: subWithChildren,
        };
      });

      return result;
    },
    CacheTTL.CATEGORY_HIERARCHY
  );
};

// ================================================================
// 🔄 REORDER CATEGORIES
// ================================================================
export const reorderMainCategoriesService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error("orderedIds array is empty");
  }

  // Update orderCount in parallel
  const updatePromises = orderedIds.map((id, index) =>
    CategoryModel.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  // 🗑️ Clear all category caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  await deleteCacheKey(CacheKeys.CATEGORY.WITH_HIERARCHY); // ✅ Added

  return { message: "Main categories reordered successfully!" };
};

// ================================================================
// 🔍 GET PRODUCTS BY CATEGORY SLUG WITH FILTERS (OPTIMIZED)
// ================================================================

// ✅ Helper: Create flexible regex for search
const createFlexibleRegex = (text: string) => {
  let escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  escaped = escaped.replace(/['']/g, "['']");
  return new RegExp(`^${escaped.trim()}$`, "i");
};

const getProductsByCategorySlugWithFiltersFromDB = async (
  slug: string,
  filters: {
    search?: string;
    subCategory?: string;
    childCategory?: string;
    brand?: string;
    size?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
  }
) => {
  // ✅ Create cache key based on slug and filters
  const filterHash = JSON.stringify(filters);
  const cacheKey = CacheKeys.CATEGORY.PRODUCTS_BY_SLUG(slug, filterHash);

  return getCachedData(
    cacheKey,
    async () => {
      // ✅ Get category (Type-safe)
      const category = await CategoryModel.findOne({ slug, status: "active" }).lean();
      
      if (!category) return null;

      // ✅ Type assertion for safety
      const categoryData = category as any;

      // ✅ Build aggregation pipeline
      const matchStage: any = {
        category: categoryData._id,
        status: "active",
      };

      // Filter: Sub-Category
      if (filters.subCategory) {
        const regex = createFlexibleRegex(filters.subCategory);
        const subCatDoc = await SubCategoryModel.findOne({
          name: { $regex: regex },
        }).lean();

        if (!subCatDoc) {
          return { category: categoryData, products: [], totalProducts: 0 };
        }
        matchStage.subCategory = (subCatDoc as any)._id;
      }

      // Filter: Child-Category
      if (filters.childCategory) {
        const regex = createFlexibleRegex(filters.childCategory);
        const childCatDoc = await ChildCategoryModel.findOne({
          name: { $regex: regex },
        }).lean();

        if (!childCatDoc) {
          return { category: categoryData, products: [], totalProducts: 0 };
        }
        matchStage.childCategory = (childCatDoc as any)._id;
      }

      // Filter: Brand
      if (filters.brand) {
        const regex = createFlexibleRegex(filters.brand);
        const brandDoc = await BrandModel.findOne({ name: { $regex: regex } }).lean();

        if (!brandDoc) {
          return { category: categoryData, products: [], totalProducts: 0 };
        }
        matchStage.brand = (brandDoc as any)._id;
      }

      // Filter: Size
      if (filters.size) {
        const regex = createFlexibleRegex(filters.size);
        const sizeDoc = await ProductSize.findOne({ name: { $regex: regex } }).lean();

        if (!sizeDoc) {
          return { category: categoryData, products: [], totalProducts: 0 };
        }
        matchStage["productOptions.size"] = (sizeDoc as any)._id;
      }

      // Filter: Search
      if (filters.search) {
        const searchRegex = { $regex: filters.search, $options: "i" };
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
          { "productOptions.price": priceCondition },
          { "productOptions.discountPrice": priceCondition }
        );
      }

      // ✅ Sorting
      let sortStage: any = { createdAt: -1 };
      if (filters.sort === "priceLowHigh") sortStage = { productPrice: 1 };
      if (filters.sort === "priceHighLow") sortStage = { productPrice: -1 };

      // ✅ Use aggregation instead of populate (MUCH FASTER!)
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

        // ⚠️ SAFETY: Ensure slug exists (যদি ডাটাবেসে মিসিং থাকে)
        {
          $addFields: {
            slug: { $ifNull: ["$slug", { $concat: ["product-", { $toString: "$_id" }] }] }
          }
        },

        // ✅ Project only needed fields (slug: 1 added here)
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
            
            // 🔥 CRITICAL FIX: এই লাইনটি মিসিং ছিল
            slug: 1, 
          },
        },
      ]);

      return {
        category: categoryData,
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
export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getFeaturedEverythingFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getProductsByCategorySlugWithFiltersFromDB,
  getAllSubCategoriesWithChildren,
  reorderMainCategoriesService,
  getProductIdsByCategoryFromDB,
};