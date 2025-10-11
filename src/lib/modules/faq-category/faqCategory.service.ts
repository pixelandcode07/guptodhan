import { IFAQCategory } from './faqCategory.interface';
import { FAQCategoryModel } from './faqCategory.model';

// Create FAQ Category
const createFAQCategoryInDB = async (payload: Partial<IFAQCategory>) => {
  const result = await FAQCategoryModel.create(payload);
  return result;
};

// Get all FAQ Categories
const getAllFAQCategoriesFromDB = async () => {
  const result = await FAQCategoryModel.find({}).sort({ name: 1 });
  return result;
};

// Get only active FAQ Categories
const getActiveFAQCategoriesFromDB = async () => {
  const result = await FAQCategoryModel.find({ isActive: true }).sort({ name: 1 });
  return result;
};

// Update FAQ Category
const updateFAQCategoryInDB = async (id: string, payload: Partial<IFAQCategory>) => {
  const result = await FAQCategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("FAQ Category not found to update.");
  }
  return result;
};

// Delete FAQ Category
const deleteFAQCategoryFromDB = async (id: string) => {
  const result = await FAQCategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("FAQ Category not found to delete.");
  }
  return null;
};

export const FAQCategoryServices = {
  createFAQCategoryInDB,
  getAllFAQCategoriesFromDB,
  getActiveFAQCategoriesFromDB,
  updateFAQCategoryInDB,
  deleteFAQCategoryFromDB,
};
