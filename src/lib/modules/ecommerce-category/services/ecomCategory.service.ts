import { ICategory } from '../interfaces/ecomCategory.interface';
import { CategoryModel } from '../models/ecomCategory.model';
import mongoose, { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';
import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import {  } from '../models/ecomCategory.model';
import { SubCategoryModel } from '../models/ecomSubCategory.model';
import { ChildCategoryModel } from '../models/ecomChildCategory.model';
import { VendorProductModel } from '../../product/vendorProduct.model';
import { BrandModel } from '../../product-config/models/brandName.model';

// Create category
const createCategoryInDB = async (payload: Partial<ICategory>) => {
  const result = await CategoryModel.create(payload);
  return result;
};

// Get all categories (sorted by name)
const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find({}).sort({ orderCount: 1 });
  return result;
};

// Get only featured categories (optimized for landing page)
const getFeaturedCategoriesFromDB = async () => {
  const result = await CategoryModel.find({ 
    isFeatured: true, 
    status: 'active' 
  })
    .select('name categoryIcon isFeatured status slug categoryId')
    .sort({ name: 1 })
    .lean();
  return result;
};

// Get all main category products
export const getProductIdsByCategoryFromDB = async (categoryId: string) => {
  const products = await VendorProductModel.find({ category: categoryId, status: 'active' })
    .select('_id')
    .lean();
  
  console.log('Products found for category:', categoryId, products);
  // Return array of _id strings only
  return products.map(p => p._id.toString());
};

// Get category by ID
const getCategoryByIdFromDB = async (categoryId: string) => {
  const result = await CategoryModel.findOne({
    categoryId,
    status: 'active',
  });
  return result;
};

// Update category
const updateCategoryInDB = async (id: string, payload: Partial<ICategory>) => {
  const result = await CategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Category not found to update.');
  }
  return result;
};

// Delete category (only if no products exist under it)
const deleteCategoryFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ category: new Types.ObjectId(id) });
  if (existingModel) {
    throw new Error('Cannot delete this category as it is used in a product model.');
  }

  const result = await CategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Category not found to delete.');
  }
  return null;
};


export const getAllSubCategoriesWithChildren = async () => {
  // Get all main categories
  const mainCategories = await CategoryModel.find({ isNavbar: true }).sort({ orderCount: 1 });

  // Map each main category
  const result = await Promise.all(
    mainCategories.map(async (main) => {
      // Get all subcategories for this main category
      const subCategories: ISubCategory[] = await SubCategoryModel.find({
        category: new Types.ObjectId(main._id),
      }).sort({ name: 1 });

      // Map each subcategory to include its children
      const subWithChildren = await Promise.all(
        subCategories.map(async (sub) => {
          const childCategories: IChildCategory[] = await ChildCategoryModel.find({
            subCategory: sub._id,
          }).sort({ name: 1 });

          return {
            subCategoryId: sub.subCategoryId,
            name: sub.name,
            slug: sub.slug, // ✅ Added slug
            children: childCategories.map((child) => ({
              childCategoryId: child.childCategoryId,
              name: child.name,
              slug: child.slug, // ✅ Added slug
            })),
          };
        })
      );

      return {
        mainCategoryId: main._id,
        name: main.name,
        categoryIcon: main.categoryIcon,
        slug: main.slug, // ✅ Added slug
        subCategories: subWithChildren,
      };
    })
  );

  return result;
};

// rearrange ecommerce main categories 
export const reorderMainCategoriesService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    CategoryModel.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'Main categories reordered successfully!' };
};


// 1. Slug দিয়ে ক্যাটাগরি ডাটা এবং নাম দিয়ে ফিল্টার করা প্রোডাক্ট আনা
const getProductsByCategorySlugWithFiltersFromDB = async (
  slug: string,
  filters: {
    search?: string;
    subCategory?: string;   // Name (e.g. "Smart Phone")
    childCategory?: string; // Name (e.g. "Android")
    brand?: string;         // Name (e.g. "Samsung")
    size?: string;          // Name (e.g. "XL")
    sort?: string;
  }
) => {
  // ১. স্লাগ দিয়ে মেইন ক্যাটাগরি খুঁজে বের করা
  const category = await CategoryModel.findOne({ slug, status: 'active' });
  if (!category) return null;

  // ২. বেসিক কুয়েরি তৈরি
  const query: any = {
    category: category._id,
    status: 'active',
  };

  // ---------------------------------------------------------
  // 🔥 NAME TO ID CONVERSION LOGIC (নাম দিয়ে ID খোঁজা)
  // ---------------------------------------------------------

  // Filter: Sub-Category (By Name)
  if (filters.subCategory) {
    const subCatDoc = await SubCategoryModel.findOne({ 
      name: { $regex: new RegExp(`^${filters.subCategory}$`, 'i') } // Exact match, case insensitive
    });
    if (subCatDoc) {
      query.subCategory = subCatDoc._id;
    } else {
      // যদি নাম দিয়ে সাব-ক্যাটাগরি না পাওয়া যায়, তাহলে এমন আইডি দিবো যা ম্যাচ করবে না (Empty result)
      return { category, products: [] };
    }
  }

  // Filter: Child-Category (By Name)
  if (filters.childCategory) {
    const childCatDoc = await ChildCategoryModel.findOne({ 
      name: { $regex: new RegExp(`^${filters.childCategory}$`, 'i') }
    });
    if (childCatDoc) {
      query.childCategory = childCatDoc._id;
    } else {
      return { category, products: [] };
    }
  }

  // Filter: Brand (By Name)
  if (filters.brand) {
    const brandDoc = await BrandModel.findOne({ 
      name: { $regex: new RegExp(`^${filters.brand}$`, 'i') } 
    });
    if (brandDoc) {
      query.brand = brandDoc._id;
    } else {
      return { category, products: [] };
    }
  }

  // ---------------------------------------------------------
  // DIRECT FILTERING
  // ---------------------------------------------------------

  // Filter: Size (Direct Name Match in Array)
  // আপনার প্রোডাক্ট মডেলে size যদি string array হয় (['XL', 'L']), তাহলে সরাসরি নাম দিয়েই হবে।
  if (filters.size) {
    query['productOptions.size'] = filters.size;
  }

  // Filter: Search (Product Name)
  if (filters.search) {
    query.productTitle = { $regex: filters.search, $options: 'i' };
  }

  // ৩. সর্টিং
  let sortQuery: any = { createdAt: -1 };
  if (filters.sort === 'priceLowHigh') sortQuery = { 'productOptions.price': 1 };
  if (filters.sort === 'priceHighLow') sortQuery = { 'productOptions.price': -1 };

  // ৪. প্রোডাক্ট আনা
  const products = await VendorProductModel.find(query)
    .populate('category', 'name slug')
    .populate('subCategory', 'name slug')
    .populate('childCategory', 'name slug')
    .populate('brand', 'name brandLogo')
    .populate('vendorStoreId', 'storeName')
    .sort(sortQuery);

  return {
    category,
    products
  };
};

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getFeaturedCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getProductsByCategorySlugWithFiltersFromDB,

  getAllSubCategoriesWithChildren,
  reorderMainCategoriesService,
  getProductIdsByCategoryFromDB
};
