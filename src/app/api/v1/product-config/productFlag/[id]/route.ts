import { ProductFlagController } from "@/lib/modules/product-config/controllers/productFlag.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ProductFlagController.updateProductFlag);

export const DELETE = catchAsync(ProductFlagController.deleteProductFlag);