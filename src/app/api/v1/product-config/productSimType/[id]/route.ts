import { ProductSimTypeController } from "@/lib/modules/product-config/controllers/productSimType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(ProductSimTypeController.updateProductSimType));
export const DELETE = catchAsync(checkRole(["admin"])(ProductSimTypeController.deleteProductSimType));