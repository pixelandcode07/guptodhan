import { IWishlist } from './wishlist.interface';
import { WishlistModel } from './wishlist.model';
import { Types } from 'mongoose';

// Create wishlist item
const createWishlistInDB = async (payload: Partial<IWishlist>) => {
  const result = await WishlistModel.create(payload);
  return result;
};

// Get all wishlist items for a user
const getAllWishlistFromDB = async (userId: string) => {
  const result = await WishlistModel.find({ userID: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  return result;
};

// Get wishlist items by product
const getWishlistByProductFromDB = async (productId: string) => {
  const result = await WishlistModel.find({
    productID: new Types.ObjectId(productId),
  }).sort({ createdAt: -1 });
  return result;
};

// Update wishlist item
const updateWishlistInDB = async (id: string, payload: Partial<IWishlist>) => {
  const result = await WishlistModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Wishlist item not found to update.');
  }
  return result;
};

// Delete wishlist item
const deleteWishlistFromDB = async (id: string) => {
  const result = await WishlistModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Wishlist item not found to delete.');
  }
  return null;
};

// Get wishlist items for public view (if needed, e.g., shared wishlist)
const getPublicWishlistFromDB = async (userId: string) => {
  return await WishlistModel.find({ userID: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
};

export const WishlistServices = {
  createWishlistInDB,
  getAllWishlistFromDB,
  getWishlistByProductFromDB,
  updateWishlistInDB,
  deleteWishlistFromDB,
  getPublicWishlistFromDB,
};
