import { ICart } from "./addToCart.interface";
import { CartModel } from "./addToCart.model";
import { Types } from "mongoose";

const addToCartInDB = async (payload: Partial<ICart>) => {
  // Build query to check if exact same product variant already exists
  // Different variants (different color/size) should be separate cart items
  const query: Record<string, unknown> = {
    userID: new Types.ObjectId(payload.userID),
    productID: new Types.ObjectId(payload.productID),
  };
  
  // Include color and size in the query to differentiate variants
  // This ensures different variants are treated as separate cart items
  if (payload.color !== undefined) {
    query.color = payload.color || null;
  }
  if (payload.size !== undefined) {
    query.size = payload.size || null;
  }

  // Check if exact same product variant already exists
  const existingItem = await CartModel.findOne(query);

  if (existingItem) {
    existingItem.quantity += payload.quantity || 1;
    existingItem.totalPrice = existingItem.quantity * (existingItem.unitPrice || 0);
    return await existingItem.save();
  }

  // Create new cart item — backend auto generates cartID
  const newItem = await CartModel.create({
    cartID:
      "CID-" +
      Array.from(
        { length: 10 },
        () =>
          "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
      ).join(""),
    userID: payload.userID,
    userName: payload.userName,
    userEmail: payload.userEmail,
    productID: payload.productID,
    storeName: payload.storeName,
    color: payload.color,
    size: payload.size,
    warranty: payload.warranty,
    productName: payload.productName,
    productImage: payload.productImage,
    quantity: payload.quantity || 1,
    unitPrice: payload.unitPrice || 0,
    totalPrice: (payload.quantity || 1) * (payload.unitPrice || 0),
  });

  return newItem;
};

// Get all cart items for a user
const getAllCartItemsFromDB = async (userId: string) => {
  const result = await CartModel.find({
    userID: new Types.ObjectId(userId),
  }).sort({ createdAt: -1 });
  return result;
};

// Update cart item (quantity, etc.)
const updateCartItemInDB = async (
  cartID: string,
  userId: string,
  payload: Partial<ICart>
) => {
  const result = await CartModel.findOneAndUpdate(
    { cartID, userID: new Types.ObjectId(userId) },
    {
      ...payload,
      totalPrice:
        payload.quantity && payload.unitPrice
          ? payload.quantity * payload.unitPrice
          : undefined,
    },
    { new: true }
  );

  if (!result) {
    throw new Error("Cart item not found to update.");
  }
  return result;
};

// Delete cart item
const deleteCartItemFromDB = async (cartID: string, userID: string) => {
  const result = await CartModel.findOneAndDelete({
    cartID,
    userID: new Types.ObjectId(userID),
  });
  if (!result) {
    throw new Error("Cart item not found to delete.");
  }
  return null;
};

// Clear all cart items for a user (after order confirmation)
const clearCartForUserInDB = async (userId: string) => {
  await CartModel.deleteMany({ userID: new Types.ObjectId(userId) });
  return null;
};

// Get a specific cart item by userId and cartId
const getCartItemByUserAndCartIdFromDB = async (
  userId: string,
  cartId: string
) => {
  const result = await CartModel.findOne({
    userID: new Types.ObjectId(userId),
    cartID: cartId,
  });

  return result;
};

const deleteSelectedCartItemsFromDB = async (
  cartIds: string[],
  userID: string
) => {
  const objectIds = cartIds.map((id) => new Types.ObjectId(id));

  const result = await CartModel.deleteMany({
    _id: { $in: objectIds },
    userID: new Types.ObjectId(userID),
  });

  if (result.deletedCount === 0) {
    throw new Error("No cart items found to delete.");
  }

  return result;
};


export const CartServices = {
  addToCartInDB,
  getAllCartItemsFromDB,
  updateCartItemInDB,
  deleteCartItemFromDB,
  clearCartForUserInDB,
  getCartItemByUserAndCartIdFromDB,
  deleteSelectedCartItemsFromDB,
};
