import { ProductUnitController } from "@/lib/modules/product-config/controllers/productUnit.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ProductUnitController.updateProductUnit);

export const DELETE = catchAsync(ProductUnitController.deleteProductUnit);