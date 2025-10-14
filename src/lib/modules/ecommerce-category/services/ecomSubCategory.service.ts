import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import { SubCategoryModel } from '../models/ecomSubCategory.model';
import '../models/ecomCategory.model'; // ensure CategoryModel registered
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';

// Create subcategory
const createSubCategoryInDB = async (payload: Partial<ISubCategory>) => {
  //console.log('💾 Creating subcategory in database with payload:', payload);
  const result = await SubCategoryModel.create(payload);
 // console.log('✅ Subcategory created successfully:', { id: result._id, name: result.name });
  return result;
};

// Get all subcategories (both active and inactive)
const getAllSubCategoriesFromDB = async () => {
  //console.log('🔍 Fetching all subcategories from database...');
  const result = await SubCategoryModel.find({})
    .populate('category', 'name')
    .sort({ name: 1 });
  //console.log('📊 Found subcategories:', result.length, result.map(r => ({ id: r._id, name: r.name, category: r.category })));
  return result;
};

// Get subcategories by category
const getSubCategoriesByCategoryFromDB = async (categoryId: string) => {
  const result = await SubCategoryModel.find({
    category: new Types.ObjectId(categoryId),
    status: 'active',
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

export const SubCategoryServices = {
  createSubCategoryInDB,
  getAllSubCategoriesFromDB,
  getSubCategoriesByCategoryFromDB,
  updateSubCategoryInDB,
  deleteSubCategoryFromDB,
};
