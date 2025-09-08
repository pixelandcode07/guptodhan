// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-category\category.service.ts

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

    // যদি আইকন থাকে, তাহলে Cloudinary থেকে ডিলিট করা হচ্ছে
    if (category.icon) {
        await deleteFromCloudinary(category.icon);
    }
    
    await ClassifiedCategory.findByIdAndDelete(id);
    return null;
};


// নতুন: সাধারণ ব্যবহারকারীদের জন্য ক্যাটাগরি এবং সাব-ক্যাটাগরি একসাথে নিয়ে আসার সার্ভিস
const getCategoriesWithSubcategoriesFromDB = async () => {
  const result = await ClassifiedCategory.aggregate([
    // ধাপ ১: শুধুমাত্র active ক্যাটাগরিগুলো খুঁজে বের করা
    {
      $match: { status: 'active' }
    },
    // ধাপ ২: SubCategory কালেকশনের সাথে join (lookup) করা
    {
      $lookup: {
        from: 'classifiedsubcategories', // সাব-ক্যাটাগরি মডেলের কালেকশনের নাম (Mongoose এটিকে plural করে)
        localField: '_id',
        foreignField: 'category',
        as: 'subCategories'
      }
    },
    // ধাপ ৩: শুধুমাত্র প্রয়োজনীয় ফিল্ডগুলো সিলেক্ট করা
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



export const ClassifiedCategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getCategoriesWithSubcategoriesFromDB,
  getPublicCategoriesFromDB,
};