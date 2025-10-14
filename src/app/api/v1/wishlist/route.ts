import { WishlistController } from "@/lib/wishlist/wishlist.controller";
import dbConnect from "@/lib/db";
import { WishlistModel } from "@/lib/wishlist/wishlist.model";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(async () => {
  await dbConnect();
  const result = await WishlistModel.find({}).sort({ createdAt: -1 });
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "All wishlist items retrieved successfully!",
    data: result,
  });
});

export const POST = catchAsync(WishlistController.createWishlist);