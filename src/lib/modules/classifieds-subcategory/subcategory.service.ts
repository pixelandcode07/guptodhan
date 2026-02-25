import { IClassifiedSubCategory } from './subcategory.interface';
import { ClassifiedSubCategory } from './subcategory.model';
import { ClassifiedCategory } from '../classifieds-category/category.model'; 
import { Types } from 'mongoose';
import { ClassifiedAd } from '../classifieds/ad.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary'; // ✅ Missing import fixed

// ✅ Redis Cache Imports
import { deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys } from '@/lib/redis/cache-keys';

const createSubCategoryInDB = async (payload: Partial<IClassifiedSubCategory>) => {
  const parentCategory = await ClassifiedCategory.findById(payload.category);

  if (!parentCategory) {
    throw new Error(`Parent category with ID '${payload.category}' not found.`);
  }
  
  const result = await ClassifiedSubCategory.create(payload);

  // 🗑️ Clear caches (কারণ সাব-ক্যাটাগরি অ্যাড হলে মেইন ক্যাটাগরির ডেটাও চেঞ্জ হয়)
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);

  return result;
};


const getSubCategoriesByParentFromDB = async (id: string) => {
  const result = await ClassifiedSubCategory.find({
    category: new Types.ObjectId(id),
    status: 'active',
  });
  return result;
};



const updateSubCategoryInDB = async (id: string, payload: Partial<IClassifiedSubCategory>) => {
  const subCategoryToUpdate = await ClassifiedSubCategory.findById(id);
  if (!subCategoryToUpdate) {
    throw new Error("Sub-category not found to update.");
  }

  // যদি নতুন প্যারেন্ট ক্যাটাগরি পাঠানো হয়, তবে সেটি ভ্যালিড কিনা চেক করা হচ্ছে
  if (payload.category) {
    const parentCategoryExists = await ClassifiedCategory.findById(payload.category);
    if (!parentCategoryExists) {
      throw new Error(`The new parent category with ID '${payload.category}' does not exist.`);
    }
  }
  
  // যদি নতুন আইকন আপলোড করা হয়, তাহলে ক্লাউডিনারি থেকে পুরোনো আইকন ডিলিট করা হচ্ছে
  if (payload.icon && subCategoryToUpdate.icon) {
    await deleteFromCloudinary(subCategoryToUpdate.icon);
  }

  // ডেটাবেসে সাব-ক্যাটাগরিটি আপডেট করা হচ্ছে
  const result = await ClassifiedSubCategory.findByIdAndUpdate(id, payload, { new: true });

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);

  return result;
};


// সাব-ক্যাটাগরি ডিলিট করার জন্য সার্ভিস
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

  // 🗑️ Clear caches
  await deleteCachePattern(CacheKeys.PATTERNS.CATEGORY_ALL);

  return null;
};

export const ClassifiedSubCategoryServices = {
  createSubCategoryInDB,
  getSubCategoriesByParentFromDB,
  updateSubCategoryInDB,
  deleteSubCategoryFromDB,
};