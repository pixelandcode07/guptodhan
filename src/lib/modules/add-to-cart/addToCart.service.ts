import { VendorProductServices } from "../product/vendorProduct.service";
import { ICart } from "./addToCart.interface";
import { CartModel } from "./addToCart.model";
import { Types } from "mongoose";

const addToCartInDB = async (payload: Partial<ICart>) => {
  // 1. Get Product with Populated Names (Color/Size IDs converted to Names)
  const productIdStr = payload.productID ? payload.productID.toString() : null;

  if (!productIdStr) {
    throw new Error("Product ID is required!");
  }

  const product = await VendorProductServices.getVendorProductByIdFromDB(productIdStr);

  if (!product) {
    throw new Error("Product not found!");
  }

  // 2. Validate Variant Stock (Now comparing Name vs Name ✅)
  if (payload.color || payload.size) {
    const variant = product.productOptions.find((opt: any) => {
      // Database এ color/size অ্যারে হতে পারে, আবার স্ট্রিংও হতে পারে। তাই সেফটি চেক:
      const dbColor = Array.isArray(opt.color) ? opt.color : [opt.color];
      const dbSize = Array.isArray(opt.size) ? opt.size : [opt.size];

      // Check match
      const colorMatch = payload.color ? dbColor.includes(payload.color) : true;
      const sizeMatch = payload.size ? dbSize.includes(payload.size) : true;

      return colorMatch && sizeMatch;
    });
    
    if (!variant) throw new Error("Selected variant (Color/Size) not available!");
    
    // Check Stock
    if ((variant.stock || 0) < (payload.quantity || 1)) {
      throw new Error(`Insufficient stock! Only ${variant.stock} left.`);
    }
  } else {
    // No variant selected, check main stock
    if ((product.stock || 0) < (payload.quantity || 1)) {
      throw new Error("Insufficient stock!");
    }
  }

  // 3. Build Query to check existing cart item
  const query: Record<string, unknown> = {
    userID: new Types.ObjectId(payload.userID),
    productID: new Types.ObjectId(payload.productID),
    color: payload.color || null,
    size: payload.size || null,
  };

  const existingItem = await CartModel.findOne(query);

  if (existingItem) {
    // Update quantity
    existingItem.quantity += payload.quantity || 1;
    existingItem.totalPrice = existingItem.quantity * (existingItem.unitPrice || 0);
    return await existingItem.save();
  }

  // 4. Create New Item
  const newItem = await CartModel.create({
    cartID: "CID-" + Date.now() + Math.floor(Math.random() * 1000),
    userID: payload.userID,
    userName: payload.userName,
    userEmail: payload.userEmail,
    productID: payload.productID,
    // ✅ Store Name and Info correctly
    storeName: product.vendorStoreId?.storeName || payload.storeName || "Unknown Store",
    color: payload.color,
    size: payload.size,
    warranty: payload.warranty,
    productName: product.productTitle,
    productImage: payload.productImage || product.thumbnailImage,
    quantity: payload.quantity || 1,
    unitPrice: payload.unitPrice || product.productPrice,
    totalPrice: (payload.quantity || 1) * (payload.unitPrice || product.productPrice || 0),
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

export const CartServices = {
  addToCartInDB,
  getAllCartItemsFromDB,
  updateCartItemInDB,
  deleteCartItemFromDB,
  clearCartForUserInDB,
  getCartItemByUserAndCartIdFromDB,
};
