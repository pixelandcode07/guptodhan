import { IReview } from './productReview.interface';
import { ReviewModel } from './productReview.model';
import { Types } from 'mongoose';

// Create review
const createReviewInDB = async (payload: Partial<IReview>) => {
  const result = await ReviewModel.create(payload);
  return result;
};

// Get all reviews (optional: sorted by uploadedTime descending)
const getAllReviewsFromDB = async () => {
  const result = await ReviewModel.find().sort({ uploadedTime: -1 });
  return result;
};

// Get reviews by user
const getReviewsByUserFromDB = async (userId: string) => {
  const result = await ReviewModel.find({
    userId: new Types.ObjectId(userId),
  }).sort({ uploadedTime: -1 });
  return result;
};

// Update review
const updateReviewInDB = async (id: string, payload: Partial<IReview>) => {
  const result = await ReviewModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Review not found to update.');
  }
  return result;
};

// Delete review
const deleteReviewFromDB = async (id: string) => {
  const result = await ReviewModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Review not found to delete.');
  }
  return null;
};

// Get reviews by product
const getReviewsByProductFromDB = async (productId: string) => {
  const result = await ReviewModel.find({
    productId: new Types.ObjectId(productId),
  }).sort({ uploadedTime: -1 });
  return result;
};


export const ReviewServices = {
  createReviewInDB,
  getAllReviewsFromDB,
  getReviewsByUserFromDB,
  getReviewsByProductFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
};
