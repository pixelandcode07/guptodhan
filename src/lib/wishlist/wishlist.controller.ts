import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import {
  createWishlistValidationSchema,
  updateWishlistValidationSchema,
} from './wishlist.validation';
import { WishlistServices } from './wishlist.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { IWishlist } from './wishlist.interface';

// Create a new wishlist item
const createWishlist = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createWishlistValidationSchema.parse(body);

  const payload: Partial<IWishlist> = {
    ...validatedData,
    userID: new Types.ObjectId(validatedData.userID),
    productID: new Types.ObjectId(validatedData.productID),
  } as Partial<IWishlist>;

  const result = await WishlistServices.createWishlistInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Wishlist item created successfully!',
    data: result,
  });
};

// Get all wishlist items for a user
const getAllWishlist = async (_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  await dbConnect();
  const { userId } = await params;
  const result = await WishlistServices.getAllWishlistFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All wishlist items retrieved successfully!',
    data: result,
  });
};

// Get wishlist items by product
const getWishlistByProduct = async (_req: NextRequest, { params }: { params: Promise<{ productId: string }> }) => {
  await dbConnect();
  const { productId } = await params;
  const result = await WishlistServices.getWishlistByProductFromDB(productId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist items for product retrieved successfully!',
    data: result,
  });
};

// Update wishlist item
const updateWishlist = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateWishlistValidationSchema.parse(body);

  const payload: Partial<IWishlist> = {
    ...validatedData,
    ...(validatedData.userID ? { userID: new Types.ObjectId(validatedData.userID) } : {}),
    ...(validatedData.productID ? { productID: new Types.ObjectId(validatedData.productID) } : {}),
  } as Partial<IWishlist>;

  const result = await WishlistServices.updateWishlistInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist item updated successfully!',
    data: result,
  });
};

// Delete wishlist item
const deleteWishlist = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  await WishlistServices.deleteWishlistFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist item deleted successfully!',
    data: null,
  });
};

export const WishlistController = {
  createWishlist,
  getAllWishlist,
  getWishlistByProduct,
  updateWishlist,
  deleteWishlist,
};
