import { ProductSizeController } from "@/lib/modules/product-config/controllers/productSize.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(checkRole(["admin"])(ProductSizeController.getAllProductSizes));
export const POST = catchAsync(checkRole(["admin"])(ProductSizeController.createProductSize));