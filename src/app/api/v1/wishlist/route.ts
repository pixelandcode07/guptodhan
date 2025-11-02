import { WishlistController } from "@/lib/wishlist/wishlist.controller";
import dbConnect from "@/lib/db";
import { WishlistModel } from "@/lib/wishlist/wishlist.model";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { NextRequest } from "next/server";
import { Types } from "mongoose";

export const GET = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  // If userId is provided, get wishlist items for that user only
  if (userId) {
    if (!Types.ObjectId.isValid(userId)) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid user ID format.',
        data: null,
      });
    }
    
    // Ensure VendorProductModel is registered
    await import('@/lib/modules/product/vendorProduct.model')
    
    // Populate product details
    const result = await WishlistModel.find({ userID: new Types.ObjectId(userId) })
      .populate({
        path: 'productID',
        select: 'productTitle thumbnailImage photoGallery productPrice discountPrice _id',
        model: 'VendorProductModel'
      })
      .sort({ createdAt: -1 })
      .lean();
    
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "User wishlist items retrieved successfully!",
      data: result,
    });
  }
  
  // Otherwise, get all wishlist items (admin view)
  // Ensure VendorProductModel is registered
  await import('@/lib/modules/product/vendorProduct.model')
  
  // Populate product details for admin view
  const result = await WishlistModel.find({})
    .populate({
      path: 'productID',
      select: 'productTitle thumbnailImage photoGallery productPrice discountPrice _id',
      model: 'VendorProductModel'
    })
    .sort({ createdAt: -1 })
    .lean();
  
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "All wishlist items retrieved successfully!",
    data: result,
  });
});

export const POST = catchAsync(WishlistController.createWishlist);