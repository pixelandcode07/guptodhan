
import { IClassifiedSubCategory } from './subcategory.interface';
import { ClassifiedSubCategory } from './subcategory.model';
import { ClassifiedCategory } from '../classifieds-category/category.model'; // <-- Parent Category মডেল ইম্পোর্ট করুন
import { Types } from 'mongoose';

const createSubCategoryInDB = async (payload: Partial<IClassifiedSubCategory>) => {
  const parentCategory = await ClassifiedCategory.findById(payload.category);

  if (!parentCategory) {
    throw new Error(`Parent category with ID '${payload.category}' not found.`);
  }
  
  const result = await ClassifiedSubCategory.create(payload);
  return result;
};


const getSubCategoriesByParentFromDB = async (id: string) => {
    const result = await ClassifiedSubCategory.find({ category: new Types.ObjectId(id), status: 'active' });
    return result;
};



const updateSubCategoryInDB = async (id: string, payload: { name?: string; category?: string; status?: 'active' | 'inactive' }) => {
  const payloadForDB: any = { ...payload };

  if (payload.category) {
    const parentCategory = await ClassifiedCategory.findOne({ name: payload.category });
    if (!parentCategory) {
      throw new Error(`Parent category '${payload.category}' not found.`);
    }
    payloadForDB.category = parentCategory._id;
  }

  const result = await ClassifiedSubCategory.findByIdAndUpdate(id, payloadForDB, { new: true });
  if (!result) {
    throw new Error("Sub-category not found to update.");
  }
  return result;
};

// নতুন: সাব-ক্যাটাগরি ডিলিট করার জন্য সার্ভিস
const deleteSubCategoryFromDB = async (id: string) => {
  // Bonus Check: ডিলিট করার আগে চেক করা হচ্ছে কোনো বিজ্ঞাপন এই সাব-ক্যাটাগরিটি ব্যবহার করছে কিনা
  const existingAd = await ClassifiedAd.findOne({ subCategory: new Types.ObjectId(id) });
  if (existingAd) {
    throw new Error("Cannot delete this sub-category as it is currently in use by one or more ads.");
  }
  
  const result = await ClassifiedSubCategory.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Sub-category not found to delete.");
  }
  return null; // সফলভাবে ডিলিট হলে কোনো ডেটা পাঠানোর প্রয়োজন নেই
};

export const ClassifiedSubCategoryServices = {
  createSubCategoryInDB,
  getSubCategoriesByParentFromDB,
  updateSubCategoryInDB,
  deleteSubCategoryFromDB,
};