import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import { ChildCategoryModel } from '../models/ecomChildCategory.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';
import { VendorProductModel } from '../../product/vendorProduct.model';
import mongoose from 'mongoose';
import { BrandModel } from '../../product-config/models/brandName.model';
import { ProductSize } from '../../product-config/models/productSize.model';

// Create child category
const createChildCategoryInDB = async (payload: Partial<IChildCategory>) => {
  const result = await ChildCategoryModel.create(payload);
  return result;
};

// Get all child categories (both active and inactive)
const getAllChildCategoriesFromDB = async () => {
  const result = await ChildCategoryModel.find({})
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .sort({ name: 1 });
  return result;
};

// Get child categories by subcategory
const getChildCategoriesBySubCategoryFromDB = async (subCategoryId: string) => {
  const result = await ChildCategoryModel.find({
    subCategory: new Types.ObjectId(subCategoryId),
    status: 'active',
  }).sort({ name: 1 });
  return result;
};

// Update child category
const updateChildCategoryInDB = async (id: string, payload: Partial<IChildCategory>) => {
  const result = await ChildCategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('ChildCategory not found to update.');
  }
  return result;
};

// Delete child category (only if no products exist under it)
const deleteChildCategoryFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ children: new Types.ObjectId(id) });
  if (existingModel) {
    throw new Error('Cannot delete this child category as it is used in a product model.');
  }

  const result = await ChildCategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('ChildCategory not found to delete.');
  }
  return null;
};

// Get child category by slug
const getProductsByChildCategorySlugWithFiltersFromDB = async (
  slug: string,
  filters: {
    search?: string;
    brand?: string; // Name
    size?: string;  // Name
    sort?: string;
  }
) => {
  // ১. স্লাগ দিয়ে চাইল্ড-ক্যাটাগরি খোঁজা
  const childCategory = await ChildCategoryModel.findOne({ slug, status: 'active' });
  if (!childCategory) return null;

  const query: any = {
    childCategory: childCategory._id,
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
      return { childCategory, products: [] };
    }
  }

  // 🔥 UPDATED SIZE FILTER LOGIC 🔥
  if (filters.size) {
    const sizeDoc = await ProductSize.findOne({ 
      name: { $regex: new RegExp(`^${filters.size.trim()}$`, 'i') } 
    });

    if (sizeDoc) {
      query['productOptions.size'] = sizeDoc._id;
    } else {
      return { childCategory, products: [] };
    }
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

    // ✅ নতুন যোগ:
    .populate('productModel', 'name')
    .populate({
      path: 'productOptions.size',
      model: 'ProductSize',
      select: 'name'
    })
    
    .sort(sortQuery);

  return { childCategory, products };
};


export const ChildCategoryServices = {
  createChildCategoryInDB,
  getAllChildCategoriesFromDB,
  getChildCategoriesBySubCategoryFromDB,
  updateChildCategoryInDB,
  deleteChildCategoryFromDB,
  getProductsByChildCategorySlugWithFiltersFromDB,
};
