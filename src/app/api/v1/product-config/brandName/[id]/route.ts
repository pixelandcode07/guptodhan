import { BrandController } from "@/lib/modules/product-config/controllers/brandName.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(BrandController.updateBrand);

export const DELETE = catchAsync(BrandController.deleteBrand);