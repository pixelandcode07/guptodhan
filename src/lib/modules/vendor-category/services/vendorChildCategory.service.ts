import { IChildCategory } from '../interfaces/vendorChildCategory.interface';
import { ChildCategoryModel } from '../models/vendorChildCategory.model';
import { Types } from 'mongoose';

// Create child-category
const createChildCategoryInDB = async (payload: Partial<IChildCategory>) => {
  const result = await ChildCategoryModel.create(payload);
  return result;
};

// Get all active child-categories (optional: sorted by name)
const getAllChildCategoriesFromDB = async () => {
  const result = await ChildCategoryModel.find({ status: 'active' }).sort({ name: 1 });
  return result;
};

// Get child-categories by sub-category
const getChildCategoriesBySubCategoryFromDB = async (subCategoryId: string) => {
  const result = await ChildCategoryModel.find({ 
    subCategory: new Types.ObjectId(subCategoryId), 
    status: 'active' 
  }).sort({ name: 1 });
  return result;
};

// Update child-category
const updateChildCategoryInDB = async (id: string, payload: Partial<IChildCategory>) => {
  const result = await ChildCategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Child-category not found to update.');
  }
  return result;
};

// Delete child-category
const deleteChildCategoryFromDB = async (id: string) => {
  const result = await ChildCategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Child-category not found to delete.');
  }
  return null;
};

export const ChildCategoryServices = {
  createChildCategoryInDB,
  getAllChildCategoriesFromDB,
  getChildCategoriesBySubCategoryFromDB,
  updateChildCategoryInDB,
  deleteChildCategoryFromDB,
};
