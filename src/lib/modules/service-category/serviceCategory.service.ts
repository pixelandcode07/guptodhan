  // ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-category\serviceCategory.service.ts

  import { IServiceCategory } from './serviceCategory.interface';
  import { ServiceCategory } from './serviceCategory.model';
  import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

  const createCategoryInDB = async (payload: Partial<IServiceCategory>) => {
    return await ServiceCategory.create(payload);
  };

  // এই সার্ভিসটি অ্যাডমিন এবং পাবলিক উভয় রুটই ব্যবহার করবে
  const getAllCategoriesFromDB = async () => {
    return await ServiceCategory.find({ status: 'active' }).sort({ name: 1 });
  };

  const updateCategoryInDB = async (id: string, payload: Partial<IServiceCategory>) => {
    return await ServiceCategory.findByIdAndUpdate(id, payload, { new: true });
  };

  const deleteCategoryFromDB = async (id: string) => {
      // Bonus: Check if any sub-category is using this category before deleting
      const category = await ServiceCategory.findById(id);
      if (!category) { throw new Error("Category not found"); }
      if (category.icon) {
          await deleteFromCloudinary(category.icon);
      }
      await ServiceCategory.findByIdAndDelete(id);
      return null;
  };

  export const ServiceCategoryServices = {
    createCategoryInDB,
    getAllCategoriesFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
  };