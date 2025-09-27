import { ICategory } from '../interfaces/ecomCategory.interface';
import { CategoryModel } from '../models/ecomCategory.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';

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

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
