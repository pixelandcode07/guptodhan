import { ProductSimTypeController } from "@/lib/modules/product-config/controllers/productSimType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ProductSimTypeController.updateProductSimType);
export const DELETE = catchAsync(ProductSimTypeController.deleteProductSimType);