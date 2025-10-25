import { ProductSizeController } from "@/lib/modules/product-config/controllers/productSize.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(ProductSizeController.updateProductSize));
export const DELETE = catchAsync(checkRole(["admin"])(ProductSizeController.deleteProductSize));