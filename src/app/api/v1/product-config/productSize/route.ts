import { ProductSizeController } from "@/lib/modules/product-config/controllers/productSize.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ProductSizeController.getAllProductSizes);

export const POST = catchAsync(ProductSizeController.createProductSize);