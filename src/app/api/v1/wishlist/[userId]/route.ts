import { WishlistController } from "@/lib/wishlist/wishlist.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(WishlistController.getAllWishlist);
export const PATCH = catchAsync(WishlistController.updateWishlist);
export const DELETE = catchAsync(WishlistController.deleteWishlist);