
import { Types } from 'mongoose';
import { ClassifiedSubCategory } from '../classifieds-subcategory/subcategory.model';
import { ClassifiedAd } from '../classifieds/ad.model';
import { IClassifiedCategory } from './category.interface';
import { ClassifiedCategory } from './category.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createCategoryInDB = async (payload: Partial<IClassifiedCategory>) => {
  const result = await ClassifiedCategory.create(payload);
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find(); // { status: 'active' }
  return result;
};

const getPublicCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find({ status: 'active' }).sort({
    name: 1,
  });
  return result;
};

const updateCategoryInDB = async (
  id: string,
  payload: Partial<IClassifiedCategory>
) => {
  const result = await ClassifiedCategory.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const categoryId = new Types.ObjectId(id);

  // Step 1: Find all sub-categories that belong to this parent category
  const subCategoriesToDelete = await ClassifiedSubCategory.find({ category: categoryId });

  // Step 2 (Optional but Recommended): Check if any of those sub-categories are in use by an ad
  const subCategoryIds = subCategoriesToDelete.map(sub => sub._id);
  const adUsingSubCategory = await ClassifiedAd.findOne({ subCategory: { $in: subCategoryIds } });
  if (adUsingSubCategory) {
    throw new Error("Cannot delete: One of its sub-categories is currently in use by an ad.");
  }

  // Step 3: Delete the sub-categories
  await ClassifiedSubCategory.deleteMany({ category: categoryId });

  // Step 4: Delete the parent category's icon from Cloudinary
  const category = await ClassifiedCategory.findById(categoryId);
  if (!category) { throw new Error("Category not found"); }
  if (category.icon) {
      await deleteFromCloudinary(category.icon);
  }
  
  // Step 5: Finally, delete the parent category itself
  await ClassifiedCategory.findByIdAndDelete(categoryId);
  
  return null;
};

const getCategoriesWithSubcategoriesFromDB = async () => {
  const result = await ClassifiedCategory.aggregate([
    // {
    //   $match: { status: 'active' }
    // },
    {
      $lookup: {
        from: 'classifiedsubcategories', // সাব-ক্যাটাগরি মডেলের কালেকশনের নাম (Mongoose এটিকে plural করে)
        localField: '_id',
        foreignField: 'category',
        as: 'subCategories',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        icon: 1,
        status: 1, // For getting status in frontend
        'subCategories._id': 1,
        'subCategories.name': 1,
        'subCategories.category': 1, // Parent category ID
        'subCategories.icon': 1, // Optional for icon
        'subCategories.status': 1, // Include status for frontend filter
      }
    },

    {
      $sort: { name: 1 },
    },
  ]);

  return result;
};

const getCategoryByIdFromDB = async (id: string) => {
  const result = await ClassifiedCategory.findById(id);
  if (!result) {
    throw new Error('Category not found');
  }
  return result;
};

export const ClassifiedCategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getCategoriesWithSubcategoriesFromDB,
  getPublicCategoriesFromDB,
  getCategoryByIdFromDB,
};
