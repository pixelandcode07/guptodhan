import { CartController } from "@/lib/modules/add-to-cart/addToCart.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(CartController.getCartItemByUserAndCartId);
export const PATCH = catchAsync(CartController.updateCartItem);
export const DELETE = catchAsync(CartController.deleteCartItem);