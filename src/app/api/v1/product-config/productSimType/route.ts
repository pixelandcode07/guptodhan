import { ProductSimTypeController } from "@/lib/modules/product-config/controllers/productSimType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ProductSimTypeController.getAllProductSimTypes);
export const POST = catchAsync(ProductSimTypeController.createProductSimType);
