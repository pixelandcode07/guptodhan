import { ISubCategory } from '../interfaces/vendorSubCategory.interface';
import { SubCategoryModel } from '../models/vendorSubCategory.model';
import { Types } from 'mongoose';

// Create sub-category
const createSubCategoryInDB = async (payload: Partial<ISubCategory>) => {
  const result = await SubCategoryModel.create(payload);
  return result;
};

// Get all active sub-categories (optional: sorted by name)
const getAllSubCategoriesFromDB = async () => {
  const result = await SubCategoryModel.find({ status: 'active' }).sort({ name: 1 });
  return result;
};

// Get sub-categories by category
const getSubCategoriesByCategoryFromDB = async (categoryId: string) => {
  const result = await SubCategoryModel.find({ 
    category: new Types.ObjectId(categoryId), 
    status: 'active' 
  }).sort({ name: 1 });
  return result;
};

// Update sub-category
const updateSubCategoryInDB = async (id: string, payload: Partial<ISubCategory>) => {
  const result = await SubCategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Sub-category not found to update.');
  }
  return result;
};

// Delete sub-category (optional: check if child categories exist under it)
const deleteSubCategoryFromDB = async (id: string) => {
  const existingChildCategory = await SubCategoryModel.findOne({ subCategoryId: id });
  if (existingChildCategory) {
    throw new Error('Cannot delete this sub-category as it has child categories.');
  }

  const result = await SubCategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Sub-category not found to delete.');
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
