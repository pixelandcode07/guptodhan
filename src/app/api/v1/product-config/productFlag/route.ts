import { ProductFlagController } from "@/lib/modules/product-config/controllers/productFlag.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ProductFlagController.getAllProductFlags);
export const POST = catchAsync(checkRole(["admin"])(ProductFlagController.createProductFlag));
export const PATCH = catchAsync(checkRole(["admin"])(ProductFlagController.reorderProductFlags));