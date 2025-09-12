import { ProductSizeController } from "@/lib/modules/product-config/controllers/productSize.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ProductSizeController.updateProductSize);

export const DELETE = catchAsync(ProductSizeController.deleteProductSize);