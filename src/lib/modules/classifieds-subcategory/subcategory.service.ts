// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-subcategory\subcategory.service.ts

import { IClassifiedSubCategory } from './subcategory.interface';
import { ClassifiedSubCategory } from './subcategory.model';
import { ClassifiedCategory } from '../classifieds-category/category.model'; // <-- Parent Category মডেল ইম্পোর্ট করুন
import { Types } from 'mongoose';

const createSubCategoryInDB = async (payload: Partial<IClassifiedSubCategory>) => {
  // ধাপ ১: পাঠানো category ID দিয়ে ডেটাবেসে Parent Category-কে খোঁজা হচ্ছে
  const parentCategory = await ClassifiedCategory.findById(payload.category);

  // যদি Parent Category খুঁজে না পাওয়া যায়, তাহলে এরর দেওয়া হচ্ছে
  if (!parentCategory) {
    throw new Error(`Parent category with ID '${payload.category}' not found.`);
  }
  
  // ধাপ ২: নতুন সাব-ক্যাটাগরিটি তৈরি করা হচ্ছে
  const result = await ClassifiedSubCategory.create(payload);
  return result;
};


// সমাধান: প্যারামিটারের নাম categoryId থেকে id করা হয়েছে (ঐচ্ছিক, কিন্তু সামঞ্জস্যপূর্ণ)
const getSubCategoriesByParentFromDB = async (id: string) => {
    const result = await ClassifiedSubCategory.find({ category: new Types.ObjectId(id), status: 'active' });
    return result;
};



// নতুন: সাব-ক্যাটাগরি আপডেট করার জন্য সার্ভিস
const updateSubCategoryInDB = async (id: string, payload: { name?: string; category?: string; status?: 'active' | 'inactive' }) => {
  const payloadForDB: any = { ...payload };

  // যদি ইউজার Parent Category পরিবর্তন করতে চায়
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