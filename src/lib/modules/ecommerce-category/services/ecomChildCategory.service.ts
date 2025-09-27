import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import { ChildCategoryModel } from '../models/ecomChildCategory.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';

// Create child category
const createChildCategoryInDB = async (payload: Partial<IChildCategory>) => {
  const result = await ChildCategoryModel.create(payload);
  return result;
};

// Get all active child categories (optional: sorted by name)
const getAllChildCategoriesFromDB = async () => {
  const result = await ChildCategoryModel.find({ status: 'active' }).sort({ name: 1 });
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

export const ChildCategoryServices = {
  createChildCategoryInDB,
  getAllChildCategoriesFromDB,
  getChildCategoriesBySubCategoryFromDB,
  updateChildCategoryInDB,
  deleteChildCategoryFromDB,
};
