import { IDonationCategory } from './donation-category.interface';
import { DonationCategory } from './donation-category.model';

const createCategoryInDB = async (payload: Partial<IDonationCategory>) => {
  return await DonationCategory.create(payload);
};

// Public facing - only active categories
const getActiveCategoriesFromDB = async () => {
  return await DonationCategory.find({ status: 'active' }).sort({ name: 1 });
};

// Admin facing - all categories
const getAllCategoriesForAdminFromDB = async () => {
  return await DonationCategory.find({}).sort({ createdAt: -1 });
};

const updateCategoryInDB = async (id: string, payload: Partial<IDonationCategory>) => {
  return await DonationCategory.findByIdAndUpdate(id, payload, { new: true });
};

export const DonationCategoryServices = {
  createCategoryInDB,
  getActiveCategoriesFromDB,
  getAllCategoriesForAdminFromDB,
  updateCategoryInDB,
};