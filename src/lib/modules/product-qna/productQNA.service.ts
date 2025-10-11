import { IProductQA } from './productQNA.interface';
import { ProductQAModel } from './productQNA.model';
import { Types } from 'mongoose';

// Create new product question
const createProductQAInDB = async (payload: Partial<IProductQA>) => {
  const result = await ProductQAModel.create(payload);
  return result;
};

// Get all product Q&A (sorted by createdAt descending)
const getAllProductQAFromDB = async () => {
  const result = await ProductQAModel.find().sort({ createdAt: -1 });
  return result;
};

// Get Q&A by product
const getProductQAByProductFromDB = async (productId: string) => {
  const result = await ProductQAModel.find({
    productId: new Types.ObjectId(productId),
  }).sort({ createdAt: -1 });
  return result;
};

// Get questions asked by specific user
const getProductQAByUserFromDB = async (userId: string) => {
  const result = await ProductQAModel.find({
    userId: new Types.ObjectId(userId),
  }).sort({ createdAt: -1 });
  return result;
};

// Admin updates question with answer
const updateProductQAWithAnswerInDB = async (id: string, payload: Partial<IProductQA>) => {
  const result = await ProductQAModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Product Q&A not found to update.');
  }
  return result;
};

// Delete product question (and answer if exists)
const deleteProductQAFromDB = async (id: string) => {
  const result = await ProductQAModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Product Q&A not found to delete.');
  }
  return null;
};

export const ProductQAService = {
  createProductQAInDB,
  getAllProductQAFromDB,
  getProductQAByProductFromDB,
  getProductQAByUserFromDB,
  updateProductQAWithAnswerInDB,
  deleteProductQAFromDB,
};
