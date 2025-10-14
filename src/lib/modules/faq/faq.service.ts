import { IFAQ } from './faq.interface';
import { FAQModel } from './faq.model';
import { Types } from 'mongoose';

// Create FAQ
const createFAQInDB = async (payload: Partial<IFAQ>) => {
  const result = await FAQModel.create(payload);
  return result;
};

// Get all active FAQs (optional: sorted by question)
const getAllFAQsFromDB = async () => {
  const result = await FAQModel.find({ isActive: true }).sort({ question: 1 });
  return result;
};

// Get FAQs by category
const getFAQsByCategoryFromDB = async (categoryId: string) => {
  const result = await FAQModel.find({ 
    category: new Types.ObjectId(categoryId), 
    isActive: true 
  }).sort({ question: 1 });
  return result;
};

// Update FAQ
const updateFAQInDB = async (id: string, payload: Partial<IFAQ>) => {
  const result = await FAQModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("FAQ not found to update.");
  }
  return result;
};

// Delete FAQ
const deleteFAQFromDB = async (id: string) => {
  const result = await FAQModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("FAQ not found to delete.");
  }
  return null;
};

export const FAQServices = {
  createFAQInDB,
  getAllFAQsFromDB,
  getFAQsByCategoryFromDB,
  updateFAQInDB,
  deleteFAQFromDB,
};
