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
import { ProductSize } from '../../product-config/models/productSize.model';

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


// ✅ Helper Function: স্মার্টলি নাম খোঁজার জন্য (Quote এবং Special Character হ্যান্ডেল করবে)
const createFlexibleRegex = (text: string) => {
  // ১. স্পেশাল ক্যারেক্টারগুলো (যেমন +, *, ?) যাতে এরর না দেয়, তাই Escape করা হচ্ছে
  let escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // ২. সোজা Quote (') এবং বাঁকানো Quote (’) দুটোই যাতে ম্যাচ করে
  escaped = escaped.replace(/['’]/g, "['’]");
  
  // ৩. Regex রিটার্ন করা (Case Insensitive)
  return new RegExp(`^${escaped.trim()}$`, 'i');
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
  const category = await CategoryModel.findOne({ slug, status: 'active' });
  if (!category) return null;

  // ✅ ১. সব শর্ত $and এর মধ্যে রাখবো যাতে একটার সাথে আরেকটা সংঘর্ষ না করে
  const andConditions: any[] = [
    { category: category._id },
    { status: 'active' }
  ];

  // --- Filter: Sub-Category ---
  if (filters.subCategory) {
    const regex = createFlexibleRegex(filters.subCategory);
    const subCatDoc = await SubCategoryModel.findOne({ name: { $regex: regex } });
    if (subCatDoc) {
      andConditions.push({ subCategory: subCatDoc._id });
    } else {
      return { category, products: [], totalProducts: 0 };
    }
  }

  // --- Filter: Child-Category ---
  if (filters.childCategory) {
    const regex = createFlexibleRegex(filters.childCategory);
    const childCatDoc = await ChildCategoryModel.findOne({ name: { $regex: regex } });
    if (childCatDoc) {
      andConditions.push({ childCategory: childCatDoc._id });
    } else {
      return { category, products: [], totalProducts: 0 };
    }
  }

  // --- Filter: Brand ---
  if (filters.brand) {
    const regex = createFlexibleRegex(filters.brand);
    const brandDoc = await BrandModel.findOne({ name: { $regex: regex } });
    if (brandDoc) {
      andConditions.push({ brand: brandDoc._id });
    } else {
      return { category, products: [], totalProducts: 0 };
    }
  }

  // --- Filter: Size ---
  if (filters.size) {
    const regex = createFlexibleRegex(filters.size);
    const sizeDoc = await ProductSize.findOne({ name: { $regex: regex } });
    if (sizeDoc) {
      andConditions.push({ 'productOptions.size': sizeDoc._id });
    } else {
      return { category, products: [], totalProducts: 0 };
    }
  }

  // --- Filter: Search ---
  if (filters.search) {
    const searchRegex = { $regex: filters.search, $options: 'i' };
    andConditions.push({
      $or: [
        { productTitle: searchRegex },
        { productTag: { $in: [searchRegex] } }
      ]
    });
  }

  // 🔥 Filter: Price (Advanced Logic) 🔥
  // এটি এখন productPrice, discountPrice এবং productOptions.price সব জায়গায় চেক করবে
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const priceCondition: any = {};
    if (filters.priceMin !== undefined) priceCondition.$gte = filters.priceMin;
    if (filters.priceMax !== undefined) priceCondition.$lte = filters.priceMax;

    andConditions.push({
      $or: [
        { productPrice: priceCondition },           // Simple Product Price
        { discountPrice: priceCondition },          // Simple Product Discount Price
        { "productOptions.price": priceCondition }, // Variable Product Price
        { "productOptions.discountPrice": priceCondition } // Variable Discount
      ]
    });
  }

  // --- Final Query ---
  const query = { $and: andConditions };

  // --- Sorting ---
  let sortQuery: any = { createdAt: -1 };
  if (filters.sort === 'priceLowHigh') sortQuery = { productPrice: 1 }; // Note: Sorting complex price structures is tricky in Mongo, basic sort here
  if (filters.sort === 'priceHighLow') sortQuery = { productPrice: -1 };

  const products = await VendorProductModel.find(query)
    .populate('category', 'name slug')
    .populate('subCategory', 'name slug')
    .populate('childCategory', 'name slug')
    .populate('brand', 'name brandLogo')
    .populate('vendorStoreId', 'storeName')
    .populate('productModel', 'name')
    .populate({
      path: 'productOptions.size',
      model: 'ProductSize',
      select: 'name'
    })
    .sort(sortQuery);

  return {
    category,
    products,
    totalProducts: products.length
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
