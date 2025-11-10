import {ProductUnitController} from "@/lib/modules/product-config/controllers/productUnit.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ProductUnitController.getAllActiveProductUnits);