import { WishlistController } from "@/lib/wishlist/wishlist.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(WishlistController.updateWishlist);
export const DELETE = catchAsync(WishlistController.deleteWishlist);

