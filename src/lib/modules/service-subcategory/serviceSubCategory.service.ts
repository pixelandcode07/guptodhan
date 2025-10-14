// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-subcategory\serviceSubCategory.service.ts

import { IServiceSubCategory } from './serviceSubCategory.interface';
import { ServiceSubCategory } from './serviceSubCategory.model';
import { ServiceCategory } from '../service-category/serviceCategory.model';
import { Types } from 'mongoose';

const createSubCategoryInDB = async (payload: Partial<IServiceSubCategory>) => {
  const parentCategory = await ServiceCategory.findById(payload.category);
  if (!parentCategory) {
    throw new Error(`Parent category with ID '${payload.category}' not found.`);
  }
  return await ServiceSubCategory.create(payload);
};

const getSubCategoriesByParentFromDB = async (categoryId: string) => {
  return await ServiceSubCategory.find({ category: new Types.ObjectId(categoryId), status: 'active' });
};

// নতুন: সাব-ক্যাটাগরি আপডেট করার জন্য সার্ভিস
const updateSubCategoryInDB = async (id: string, payload: Partial<IServiceSubCategory>) => {
  // যদি ইউজার Parent Category পরিবর্তন করতে চায়, তাহলে ID ভ্যালিড কিনা তা চেক করা হচ্ছে
  if (payload.category) {
    const parentCategory = await ServiceCategory.findById(payload.category);
    if (!parentCategory) {
      throw new Error(`Parent category with ID '${payload.category}' not found.`);
    }
  }

  const result = await ServiceSubCategory.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("Sub-category not found to update.");
  }
  return result;
};

// নতুন: সাব-ক্যাটাগরি ডিলিট করার জন্য সার্ভিস
const deleteSubCategoryFromDB = async (id: string) => {
  // Bonus Check: ডিলিট করার আগে চেক করা হচ্ছে কোনো সার্ভিস প্রোভাইডার এই সাব-ক্যাটাগরিটি ব্যবহার করছে কিনা
  // const existingProvider = await ServiceProvider.findOne({ subCategory: new Types.ObjectId(id) });
  // if (existingProvider) {
  //   throw new Error("Cannot delete this sub-category as it is currently in use.");
  // }
  
  const result = await ServiceSubCategory.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Sub-category not found to delete.");
  }
  return null;
};

export const ServiceSubCategoryServices = {
  createSubCategoryInDB,
  getSubCategoriesByParentFromDB,
  updateSubCategoryInDB,
  deleteSubCategoryFromDB,
};