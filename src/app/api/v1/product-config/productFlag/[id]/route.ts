import { ProductFlagController } from "@/lib/modules/product-config/controllers/productFlag.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(ProductFlagController.updateProductFlag));
export const DELETE = catchAsync(checkRole(["admin"])(ProductFlagController.deleteProductFlag));