import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import { SubCategoryModel } from '../models/ecomSubCategory.model';
import '../models/ecomCategory.model'; // ensure CategoryModel registered
import mongoose, { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';
import { VendorProductModel } from '../../product/vendorProduct.model';
import { BrandModel } from '../../product-config/models/brandName.model';

// Create subcategory
const createSubCategoryInDB = async (payload: Partial<ISubCategory>) => {
  const result = await SubCategoryModel.create(payload);
  return result;
};

// Get all subcategories (both active and inactive)
const getAllSubCategoriesFromDB = async () => {
  const result = await SubCategoryModel.find({})
    .populate('category', 'name')
    .sort({ name: 1 });
  return result;
};

// Get subcategories by category
const getSubCategoriesByCategoryFromDB = async (categoryId: string) => {
  const result = await SubCategoryModel.find({
    category: new Types.ObjectId(categoryId),
  }).sort({ name: 1 });
  return result;
};

// Update subcategory
const updateSubCategoryInDB = async (id: string, payload: Partial<ISubCategory>) => {
  const result = await SubCategoryModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!result) {
    throw new Error('SubCategory not found to update.');
  }
  return result;
};

// Delete subcategory (only if no products exist under it)
const deleteSubCategoryFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ subCategory: new Types.ObjectId(id) });
  if (existingModel) {
    throw new Error('Cannot delete this subcategory as it is used in a product model.');
  }

  const result = await SubCategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('SubCategory not found to delete.');
  }
  return null;
};

// Get subcategory by slug
const getProductsBySubCategorySlugWithFiltersFromDB = async (
  slug: string,
  filters: {
    search?: string;
    brand?: string; // Name
    size?: string;  // Name
    sort?: string;
  }
) => {
  // ১. স্লাগ দিয়ে সাব-ক্যাটাগরি খোঁজা
  const subCategory = await SubCategoryModel.findOne({ slug, status: 'active' });
  if (!subCategory) return null;

  const query: any = {
    subCategory: subCategory._id,
    status: 'active',
  };

  // 🔥 Filter: Brand (By Name)
  if (filters.brand) {
    const brandDoc = await BrandModel.findOne({ 
      name: { $regex: new RegExp(`^${filters.brand}$`, 'i') } 
    });
    if (brandDoc) {
      query.brand = brandDoc._id;
    } else {
      return { subCategory, products: [] };
    }
  }

  // Filter: Size (By Name)
  if (filters.size) {
    query['productOptions.size'] = filters.size;
  }

  // Filter: Search
  if (filters.search) {
    query.productTitle = { $regex: filters.search, $options: 'i' };
  }

  // Sorting
  let sortQuery: any = { createdAt: -1 };
  if (filters.sort === 'priceLowHigh') sortQuery = { 'productOptions.price': 1 };
  if (filters.sort === 'priceHighLow') sortQuery = { 'productOptions.price': -1 };

  const products = await VendorProductModel.find(query)
    .populate('category', 'name slug')
    .populate('subCategory', 'name slug')
    .populate('childCategory', 'name slug')
    .populate('brand', 'name brandLogo')
    .populate('vendorStoreId', 'storeName')
    .sort(sortQuery);

  return { subCategory, products };
};

export const SubCategoryServices = {
  createSubCategoryInDB,
  getAllSubCategoriesFromDB,
  getSubCategoriesByCategoryFromDB,
  updateSubCategoryInDB,
  deleteSubCategoryFromDB,
  getProductsBySubCategorySlugWithFiltersFromDB,
};
