import { ICart } from './addToCart.interface';
import { CartModel } from './addToCart.model';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Add item to cart
const addToCartInDB = async (payload: Partial<ICart>) => {
  // Check if this product already exists in the user's cart
  const existingItem = await CartModel.findOne({
    userID: new Types.ObjectId(payload.userID),
    productID: new Types.ObjectId(payload.productID),
  });

  if (existingItem) {
    // Update quantity and totalPrice if exists
    existingItem.quantity += payload.quantity || 1;
    existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
    const updated = await existingItem.save();
    return updated;
  }

  // If not exists, create new cart item
  const newItem = await CartModel.create({
    cartID: `CID-${Math.random().toString(36).substring(2, 10)}`,
    userID: payload.userID,
    userName: payload.userName,
    userEmail: payload.userEmail,
    productID: payload.productID,
    productName: payload.productName,
    productImage: payload.productImage,
    quantity: payload.quantity || 1,
    unitPrice: payload.unitPrice,
    totalPrice: (payload.quantity || 1) * payload.unitPrice,
  });

  return newItem;
};

// Get all cart items for a user
const getAllCartItemsFromDB = async (userId: string) => {
  const result = await CartModel.find({ userID: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  return result;
};

// Update cart item (quantity, etc.)
const updateCartItemInDB = async (cartID: string, userId: string, payload: Partial<ICart>) => {
  const result = await CartModel.findOneAndUpdate(
    { cartID, userID: new Types.ObjectId(userId) },
    {
      ...payload,
      totalPrice: payload.quantity && payload.unitPrice ? payload.quantity * payload.unitPrice : undefined,
    },
    { new: true }
  );

  if (!result) {
    throw new Error('Cart item not found to update.');
  }
  return result;
};

// Delete cart item
const deleteCartItemFromDB = async (cartID: string, userID: string) => {
  const result = await CartModel.findOneAndDelete({ cartID, userID: new Types.ObjectId(userID) });
  if (!result) {
    throw new Error('Cart item not found to delete.');
  }
  return null;
};

// Clear all cart items for a user (after order confirmation)
const clearCartForUserInDB = async (userId: string) => {
  await CartModel.deleteMany({ userID: new Types.ObjectId(userId) });
  return null;
};

// Get a specific cart item by userId and cartId
const getCartItemByUserAndCartIdFromDB = async (userId: string, cartId: string) => {
  const result = await CartModel.findOne({
    userID: new Types.ObjectId(userId),
    cartID: cartId,
  });

  return result;
};


export const CartServices = {
  addToCartInDB,
  getAllCartItemsFromDB,
  updateCartItemInDB,
  deleteCartItemFromDB,
  clearCartForUserInDB,
  getCartItemByUserAndCartIdFromDB
};
