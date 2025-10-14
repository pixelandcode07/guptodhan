import { ProductWarrantyController } from "@/lib/modules/product-config/controllers/warranty.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ProductWarrantyController.updateProductWarranty);
export const DELETE = catchAsync(ProductWarrantyController.deleteProductWarranty);