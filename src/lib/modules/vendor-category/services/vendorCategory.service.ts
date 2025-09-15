import { ICategory } from '../interfaces/vendorCategory.interface';
import { CategoryModel } from '../models/vendorCategory.model';
import { Types } from 'mongoose';

// Create category
const createCategoryInDB = async (payload: Partial<ICategory>) => {
  const result = await CategoryModel.create(payload);
  return result;
};

// Get all active categories (optional: sorted by name)
const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find({ status: 'active' }).sort({ name: 1 });
  return result;
};

// Get category by ID
const getCategoryByIdFromDB = async (categoryId: string) => {
  const result = await CategoryModel.findOne({ categoryId: categoryId, status: 'active' });
  if (!result) {
    throw new Error('Category not found.');
  }
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

// Delete category (optional: check if subcategories exist under it before deleting)
const deleteCategoryFromDB = async (id: string) => {
  const existingSubCategory = await CategoryModel.findOne({ category: new Types.ObjectId(id) });
  if (existingSubCategory) {
    throw new Error('Cannot delete this category as it has subcategories.');
  }

  const result = await CategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Category not found to delete.');
  }
  return null;
};

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
