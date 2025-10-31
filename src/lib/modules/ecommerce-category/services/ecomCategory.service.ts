import { ICategory } from '../interfaces/ecomCategory.interface';
import { CategoryModel } from '../models/ecomCategory.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';
import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import { SubCategoryModel } from '../models/ecomSubCategory.model';
import { ChildCategoryModel } from '../models/ecomChildCategory.model';

// Create category
const createCategoryInDB = async (payload: Partial<ICategory>) => {
  const result = await CategoryModel.create(payload);
  return result;
};

// Get all categories (sorted by name)
const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find({}).sort({ name: 1 });
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

export const getSubCategoriesWithChildren = async (categoryId: string) => {
  // Get all subcategories for the main category
  const subCategories: ISubCategory[] = await SubCategoryModel.find({
    category: new Types.ObjectId(categoryId),
  }).sort({ name: 1 });

  // Map each subcategory to include its child categories
  const result = await Promise.all(
    subCategories.map(async (sub) => {
      const childCategories: IChildCategory[] = await ChildCategoryModel.find({
        subCategory: sub._id,
      }).sort({ name: 1 });

      return {
        subCategoryId: sub.subCategoryId,
        name: sub.name,
        children: childCategories.map((child) => ({
          childCategoryId: child.childCategoryId,
          name: child.name,
        })),
      };
    })
  );

  return result;
};

export const CategoryServices = {
  getSubCategoriesWithChildren,
  createCategoryInDB,
  getAllCategoriesFromDB,
  getFeaturedCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
