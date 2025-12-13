import { IDonationCategory } from './donation-category.interface';
import { DonationCategory } from './donation-category.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary'; // Import the delete utility

const createCategoryInDB = async (payload: Partial<IDonationCategory>) => {
  return await DonationCategory.create(payload);
};

const getActiveCategoriesFromDB = async () => {
  return await DonationCategory.find().sort({ orderCount: 1 });
  // { status: 'active' }
};

const getAllCategoriesForAdminFromDB = async () => {
  return await DonationCategory.find({}).sort({ orderCount: 1 });
};

const updateCategoryInDB = async (id: string, payload: Partial<IDonationCategory>) => {
  // If a new icon is being uploaded, we should delete the old one first
  if (payload.icon) {
    const existingCategory = await DonationCategory.findById(id);
    if (existingCategory?.icon) {
      await deleteFromCloudinary(existingCategory.icon);
    }
  }
  return await DonationCategory.findByIdAndUpdate(id, payload, { new: true });
};

// ✅ NEW: Function to delete a category
const deleteCategoryFromDB = async (id: string) => {
  const categoryToDelete = await DonationCategory.findById(id);
  if (!categoryToDelete) {
    throw new Error('Category not found to delete.');
  }
  // Delete the icon from Cloudinary before deleting the DB record
  if (categoryToDelete.icon) {
    await deleteFromCloudinary(categoryToDelete.icon);
  }
  return await DonationCategory.findByIdAndDelete(id);
};


const getCategoryByIdFromDB = async (id: string) => {
  const category = await DonationCategory.findById(id);
  if (!category || category.status !== 'active') {
    throw new Error('Category not found or is inactive.');
  }
  return category;
};

const getCategoryByIdForAdminFromDB = async (id: string) => {
  const category = await DonationCategory.findById(id);
  if (!category) {
    throw new Error('Category not found.');
  }
  return category;
};

// rearrange donation category
export const reorderDonationCategoryService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    DonationCategory.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'donation category reordered successfully!' };
};

export const DonationCategoryServices = {
  createCategoryInDB,
  getActiveCategoriesFromDB,
  getAllCategoriesForAdminFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getCategoryByIdFromDB,
  getCategoryByIdForAdminFromDB,

  reorderDonationCategoryService
};