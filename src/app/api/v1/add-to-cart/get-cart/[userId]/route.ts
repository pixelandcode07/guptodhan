import { CartController } from "@/lib/modules/add-to-cart/addToCart.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(CartController.getAllCartItems);
export const DELETE = catchAsync(CartController.clearCartForUser);