
import { IClassifiedCategory } from './category.interface';
import { ClassifiedCategory } from './category.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createCategoryInDB = async (payload: Partial<IClassifiedCategory>) => {
  const result = await ClassifiedCategory.create(payload);
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find({ status: 'active' });
  return result;
};

const getPublicCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find({ status: 'active' }).sort({ name: 1 });
  return result;
};

const updateCategoryInDB = async (id: string, payload: Partial<IClassifiedCategory>) => {
  const result = await ClassifiedCategory.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
    const category = await ClassifiedCategory.findById(id);
    if (!category) { throw new Error("Category not found"); }

    if (category.icon) {
        await deleteFromCloudinary(category.icon);
    }
    
    await ClassifiedCategory.findByIdAndDelete(id);
    return null;
};


const getCategoriesWithSubcategoriesFromDB = async () => {
  const result = await ClassifiedCategory.aggregate([
    {
      $match: { status: 'active' }
    },
    {
      $lookup: {
        from: 'classifiedsubcategories', // সাব-ক্যাটাগরি মডেলের কালেকশনের নাম (Mongoose এটিকে plural করে)
        localField: '_id',
        foreignField: 'category',
        as: 'subCategories'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        icon: 1,
        'subCategories._id': 1,
        'subCategories.name': 1,
      }
    },
    
    {
      $sort: { name: 1 }
    }
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