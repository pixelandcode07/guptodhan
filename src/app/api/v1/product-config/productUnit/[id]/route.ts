import { ProductUnitController } from "@/lib/modules/product-config/controllers/productUnit.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(ProductUnitController.updateProductUnit));
export const DELETE = catchAsync(checkRole(["admin"])(ProductUnitController.deleteProductUnit));