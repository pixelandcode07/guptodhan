import { ProductUnitController } from "@/lib/modules/product-config/controllers/productUnit.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ProductUnitController.getAllProductUnits);
export const POST = catchAsync(checkRole(["admin"])(ProductUnitController.createProductUnit));