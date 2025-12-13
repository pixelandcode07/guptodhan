import { BrandController } from "@/lib/modules/product-config/controllers/brandName.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(BrandController.getAllBrands);
export const POST = catchAsync(checkRole(["admin"])(BrandController.createBrand));
export const PATCH = catchAsync(checkRole(["admin"])(BrandController.reorderBrandNames));