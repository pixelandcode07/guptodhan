import { BrandController } from "@/lib/modules/product-config/controllers/brandName.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(BrandController.updateBrand));
export const DELETE = catchAsync(checkRole(["admin"])(BrandController.deleteBrand));