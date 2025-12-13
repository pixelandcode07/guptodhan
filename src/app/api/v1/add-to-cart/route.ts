import { CartController } from "@/lib/modules/add-to-cart/addToCart.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const POST = catchAsync(CartController.addToCart);