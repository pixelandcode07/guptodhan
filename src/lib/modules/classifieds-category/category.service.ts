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


export const ClassifiedCategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};