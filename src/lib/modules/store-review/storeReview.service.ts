import { Types } from 'mongoose';
import { StoreReview } from './storeReview.model';
import { IStoreReview } from './storeReview.interface';

// CREATE REVIEW
const createStoreReviewInDB = async (payload: IStoreReview) => {
  const review = await StoreReview.create(payload);
  return review;
};

//    GET ALL REVIEWS
const getAllStoreReviewsFromDB = async () => {
  const reviews = await StoreReview.find()
    .sort({ createdAt: -1 });

  return reviews;
};

//    GET REVIEW BY ID
const getStoreReviewByIdFromDB = async (id: string) => {
  const review = await StoreReview.findById(id);
  return review;
};

//    GET REVIEWS BY STORE ID
const getStoreReviewsByStoreIdFromDB = async (storeId: string) => {
  const reviews = await StoreReview.find({
    storeId: new Types.ObjectId(storeId),
  }).sort({ createdAt: -1 });

  return reviews;
};

// GET REVIEWS BY USER ID
const getStoreReviewsByUserIdFromDB = async (userId: string) => {
  const reviews = await StoreReview.find({ userId })
    .sort({ createdAt: -1 });

  return reviews;
};


const updateStoreReviewInDB = async (
  id: string,
  payload: Partial<IStoreReview>
) => {
  const updatedReview = await StoreReview.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedReview;
};


const deleteStoreReviewFromDB = async (id: string) => {
  const deletedReview = await StoreReview.findByIdAndDelete(id);
  return deletedReview;
};

export const StoreReviewServices = {
  createStoreReviewInDB,
  getAllStoreReviewsFromDB,
  getStoreReviewByIdFromDB,
  getStoreReviewsByStoreIdFromDB,
  getStoreReviewsByUserIdFromDB,
  updateStoreReviewInDB,
  deleteStoreReviewFromDB,
};
