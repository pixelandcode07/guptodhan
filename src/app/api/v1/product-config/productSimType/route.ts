import { ProductSimTypeController } from "@/lib/modules/product-config/controllers/productSimType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ProductSimTypeController.getAllProductSimTypes);
export const POST = catchAsync(checkRole(["admin"])(ProductSimTypeController.createProductSimType));
