import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createCartValidationSchema, updateCartValidationSchema } from './addToCart.validation';
import { CartServices } from './addToCart.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { ICart } from './addToCart.interface';

// Add item to cart
const addToCart = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();

  const validatedData = createCartValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    userID: new Types.ObjectId(validatedData.userID),
    productID: new Types.ObjectId(validatedData.productID),
  };

  const result = await CartServices.addToCartInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Cart item added/updated successfully!',
    data: result,
  });
};

// Get all cart items for a user
const getAllCartItems = async (_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  await dbConnect();
  const { userId } = await params;

  const result = await CartServices.getAllCartItemsFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All cart items retrieved successfully!',
    data: result,
  });
};

// Update cart item
const updateCartItem = async (_req: NextRequest, { params }: { params: Promise<{ cartId: string; userId: string }> }) => {
  await dbConnect();
  const { cartId, userId } = await params;
  const body = await _req.json();
  const validatedData = updateCartValidationSchema.parse(body);

  const payload: Partial<ICart> = {
    ...validatedData,
    ...(validatedData.productID ? { productID: new Types.ObjectId(validatedData.productID) } : {}),
    totalPrice:
      validatedData.quantity && validatedData.unitPrice
        ? validatedData.quantity * validatedData.unitPrice
        : undefined,
  };

  const result = await CartServices.updateCartItemInDB(cartId, userId, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cart item updated successfully!',
    data: result,
  });
};

// Delete cart item
const deleteCartItem = async (_req: NextRequest, { params }: { params: Promise<{ cartId: string; userId: string }> }) => {
  await dbConnect();
  const { cartId, userId } = await params;

  await CartServices.deleteCartItemFromDB(cartId, userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cart item deleted successfully!',
    data: null,
  });
};

// Clear all cart items for a user (after order confirmation)
const clearCartForUser = async (_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  await dbConnect();
  const { userId } = await params;

  await CartServices.clearCartForUserInDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All cart items cleared successfully!',
    data: null,
  });
};

// Get a specific cart item by userId and cartId
const getCartItemByUserAndCartId = async (
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; cartId: string }> }
) => {
  await dbConnect();
  const { userId, cartId } = await params;

  const result = await CartServices.getCartItemByUserAndCartIdFromDB(userId, cartId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cart item retrieved successfully!',
    data: result,
  });
};


export const CartController = {
  addToCart,
  getAllCartItems,
  updateCartItem,
  deleteCartItem,
  clearCartForUser,
  getCartItemByUserAndCartId
};
