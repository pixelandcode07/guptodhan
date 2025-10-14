import { ProductWarrantyController } from "@/lib/modules/product-config/controllers/warranty.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ProductWarrantyController.getAllProductWarranties);
export const POST = catchAsync(ProductWarrantyController.createProductWarranty);