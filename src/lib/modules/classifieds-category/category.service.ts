import { Types } from "mongoose";
import { ClassifiedSubCategory } from "../classifieds-subcategory/subcategory.model";
import { ClassifiedAd } from "../classifieds/ad.model";
import { IClassifiedCategory } from "./category.interface";
import { ClassifiedCategory } from "./category.model";
import { deleteFromCloudinary } from "@/lib/utils/cloudinary";

// ✅ Redis Cache Imports
import { deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys } from '@/lib/redis/cache-keys';

// ================================================================
// 📝 CREATE CATEGORY
// ================================================================
const createCategoryInDB = async (payload: Partial<IClassifiedCategory>) => {
  const maxOrderCategory = await ClassifiedCategory.findOne()
    .sort({ orderCount: -1 })
    .select("orderCount -_id")
    .lean<{ orderCount: number }>();

  const nextOrder =
    maxOrderCategory && typeof maxOrderCategory.orderCount === "number"
      ? maxOrderCategory.orderCount + 1
      : 0;

  const result = await ClassifiedCategory.create({
    ...payload,
    orderCount: nextOrder,
  });

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);

  return result;
};

// ================================================================
// 📋 GET ALL CATEGORIES
// ================================================================
const getAllCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find().sort({ orderCount: 1 });
  return result;
};

// ================================================================
// 🌍 GET PUBLIC CATEGORIES
// ================================================================
const getPublicCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find({ status: "active" }).sort({
    orderCount: 1,
  });
  return result;
};

// ================================================================
// ✏️ UPDATE CATEGORY
// ================================================================
const updateCategoryInDB = async (
  id: string,
  payload: Partial<IClassifiedCategory>
) => {
  const result = await ClassifiedCategory.findByIdAndUpdate(id, payload, {
    new: true,
  });
  
  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);
  
  return result;
};

// ================================================================
// 🗑️ DELETE CATEGORY
// ================================================================
const deleteCategoryFromDB = async (id: string) => {
  const categoryId = new Types.ObjectId(id);

  const subCategoriesToDelete = await ClassifiedSubCategory.find({
    category: categoryId,
  });

  const subCategoryIds = subCategoriesToDelete.map((sub) => sub._id);
  const adUsingSubCategory = await ClassifiedAd.findOne({
    subCategory: { $in: subCategoryIds },
  });
  
  if (adUsingSubCategory) {
    throw new Error(
      "Cannot delete: One of its sub-categories is currently in use by an ad."
    );
  }

  await ClassifiedSubCategory.deleteMany({ category: categoryId });

  const category = await ClassifiedCategory.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }
  if (category.icon) {
    await deleteFromCloudinary(category.icon);
  }

  await ClassifiedCategory.findByIdAndDelete(categoryId);

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);

  return null;
};

// ================================================================
// 🔗 GET WITH SUBCATEGORIES
// ================================================================
const getCategoriesWithSubcategoriesFromDB = async () => {
  const result = await ClassifiedCategory.aggregate([
    {
      $lookup: {
        from: "classifiedsubcategories",
        localField: "_id",
        foreignField: "category",
        as: "subCategories",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        icon: 1,
        status: 1,
        "subCategories._id": 1,
        "subCategories.name": 1,
        "subCategories.slug": 1,
        "subCategories.category": 1,
        "subCategories.icon": 1,
        "subCategories.status": 1,
      },
    },
    {
      $sort: { orderCount: 1 },
    },
  ]);

  return result;
};

// ================================================================
// 🔍 GET BY ID
// ================================================================
const getCategoryByIdFromDB = async (id: string) => {
  const result = await ClassifiedCategory.findById(id);
  if (!result) {
    throw new Error("Category not found");
  }
  return result;
};

// ================================================================
// 📊 GET WITH COUNTS
// ================================================================
const getPublicCategoriesWithCountsFromDB = async (categoryId?: string) => {
  try {
    const matchStage: any = { status: "active" };

    if (categoryId) {
      matchStage._id = new Types.ObjectId(categoryId);
    }

    const categoriesWithCounts = await ClassifiedCategory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "classifiedads",
          localField: "_id",
          foreignField: "category",
          pipeline: [
            { $match: { status: "active" } },
            { $sort: { createdAt: -1 } },
          ],
          as: "ads",
        },
      },
      {
        $addFields: {
          adCount: { $size: "$ads" },
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          icon: 1,
          status: 1,
          adCount: 1,
          ads: 1,
          orderCount: 1,
        },
      },
      { $sort: { orderCount: 1 } },
    ]);

    return categoriesWithCounts;
  } catch (error) {
    console.error("Error fetching categories with ad counts:", error);
    return [];
  }
};

// ================================================================
// 🔍 SEARCH ADS
// ================================================================
const searchAdsInDB = async (filters: Record<string, any>) => {
  const query: Record<string, any> = { status: "active" };

  if (filters.division)
    query.division = new RegExp(`^${filters.division}$`, "i");
  if (filters.district)
    query.district = new RegExp(`^${filters.district}$`, "i");
  if (filters.upazila) query.upazila = new RegExp(`^${filters.upazila}$`, "i");

  if (filters.category) query.category = new Types.ObjectId(filters.category);
  if (filters.subCategory)
    query.subCategory = new Types.ObjectId(filters.subCategory);
  if (filters.brand) query.brand = new Types.ObjectId(filters.brand);

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  return await ClassifiedAd.find(query)
    .populate("user", "name profilePicture")
    .populate("category", "name slug")
    .populate("subCategory", "name")
    .populate("brand", "name logo")
    .sort({ createdAt: -1 });
};

// ================================================================
// 🔄 REORDER CATEGORIES
// ================================================================
const reorderClassifiedCategoryService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error("orderedIds array is empty");
  }

  const updatePromises = orderedIds.map((id, index) =>
    ClassifiedCategory.findByIdAndUpdate(
      id,
      { orderCount: index },
      { new: true }
    )
  );

  await Promise.all(updatePromises);
  
  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);

  return { message: "Category reordered successfully!" };
};

// ================================================================
// 🔥 GET PAGE DATA BY SLUG (Single API) - SOLVED HERE
// ================================================================
const getCategoryPageDataBySlugFromDB = async (slug: string, filters: any) => {
  // ১. Slug দিয়ে ক্যাটাগরি খোঁজা
  const category = await ClassifiedCategory.findOne({ 
    slug: { $regex: new RegExp(`^${slug}$`, 'i') }, 
    status: 'active' 
  }).lean<IClassifiedCategory>();

  if (!category) return null;

  const categoryId = category._id;

  // ২. বেসিক কুয়েরি
  const query: any = { 
    category: new Types.ObjectId(categoryId as string), 
    status: 'active' 
  };

  // --- 🔥 FIXED FILTER LOGIC ---
  
  // A. Search (Title)
  if (filters.search) {
    query.title = { $regex: filters.search, $options: 'i' };
  }

  // B. Sub Category (Array of ObjectIds)
  if (filters.subCategory) {
    const subCats = Array.isArray(filters.subCategory) ? filters.subCategory : [filters.subCategory];
    // ✅ FIX: Convert all strings to ObjectIds
    query.subCategory = { $in: subCats.map((id: string) => new Types.ObjectId(id)) };
  }

  // C. Brand (Array of Strings) - ✅ FIX: No Regex inside $in
  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
    // MongoDB $in supports array of strings directly
    query.brand = { $in: brands };
  }

  // D. Location (District & Division) - ✅ FIX: No Regex inside $in
  if (filters.district) {
    const districts = Array.isArray(filters.district) ? filters.district : [filters.district];
    query.district = { $in: districts };
  }
  if (filters.division) {
    const divisions = Array.isArray(filters.division) ? filters.division : [filters.division];
    query.division = { $in: divisions };
  }

  // E. Price Range
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  // F. Sorting
  let sortOption: any = { createdAt: -1 };
  if (filters.sort === 'priceLowHigh') {
    sortOption = { price: 1 };
  } else if (filters.sort === 'priceHighLow') {
    sortOption = { price: -1 };
  }

  // ৩. প্যারালাল কুয়েরি
  const [ads, filtersRaw, priceStats] = await Promise.all([
    // A. Filtered Ads
    ClassifiedAd.find(query)
      .populate('subCategory', 'name')
      .populate('brand', 'name')
      .sort(sortOption)
      .lean(),

    // B. Filters Facets (Always from Base Category to show all options)
    ClassifiedAd.aggregate([
      { $match: { category: new Types.ObjectId(categoryId as string), status: 'active' } },
      {
        $facet: {
          subCategories: [
            { $group: { _id: "$subCategory", count: { $sum: 1 } } },
            { $lookup: { from: "classifiedsubcategories", localField: "_id", foreignField: "_id", as: "details" } },
            { $unwind: "$details" },
            { $project: { name: "$details.name", count: 1 } }
          ],
          brands: [
            { $group: { _id: "$brand", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $project: { brand: "$_id", count: 1 } }
          ],
          locations: [
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $project: { name: "$_id", count: 1 } }
          ]
        }
      }
    ]),

    // C. Price Range (Global for this category)
    ClassifiedAd.aggregate([
      { $match: { category: new Types.ObjectId(categoryId as string), status: 'active' } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ])
  ]);

  const filterData = filtersRaw[0];
  const priceRange = priceStats.length > 0 
    ? { min: priceStats[0].minPrice, max: priceStats[0].maxPrice }
    : { min: 0, max: 100000 };

  return {
    category: {
      _id: category._id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      adCount: ads.length
    },
    ads,
    filters: {
      subCategories: filterData.subCategories,
      brand: filterData.brands, 
      locations: filterData.locations
    },
    priceRange
  };
};

export const ClassifiedCategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getCategoriesWithSubcategoriesFromDB,
  getPublicCategoriesFromDB,
  getCategoryByIdFromDB,
  getPublicCategoriesWithCountsFromDB,
  searchAdsInDB,
  reorderClassifiedCategoryService,
  getCategoryPageDataBySlugFromDB,
};