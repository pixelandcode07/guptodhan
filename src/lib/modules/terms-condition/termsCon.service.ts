import { ITerms } from './termsCon.interface';
import { TermsModel } from './termsCon.model';
import { Types } from 'mongoose';

// Create a new term
const createTermsInDB = async (payload: Partial<ITerms>) => {
  const result = await TermsModel.create(payload);
  return result;
};

// Get all terms (optional: sorted by createdAt)
const getAllTermsFromDB = async () => {
  const result = await TermsModel.find().sort({ createdAt: -1 });
  return result;
};

// Get terms by category
const getTermsByCategoryFromDB = async (categoryId: string) => {
  const result = await TermsModel.find({
    category: new Types.ObjectId(categoryId),
  }).sort({ createdAt: -1 });
  return result;
};

// Update a term
const updateTermsInDB = async (id: string, payload: Partial<ITerms>) => {
  const result = await TermsModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("Term not found to update.");
  }
  return result;
};

// Delete a term
const deleteTermsFromDB = async (id: string) => {
  const result = await TermsModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Term not found to delete.");
  }
  return null;
};

export const TermsServices = {
  createTermsInDB,
  getAllTermsFromDB,
  getTermsByCategoryFromDB,
  updateTermsInDB,
  deleteTermsFromDB,
};
