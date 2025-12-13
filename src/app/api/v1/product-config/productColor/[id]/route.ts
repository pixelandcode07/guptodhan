import {ProductColorController} from "@/lib/modules/product-config/controllers/productColor.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(ProductColorController.updateProductColor));
export const DELETE = catchAsync(checkRole(["admin"])(ProductColorController.deleteProductColor));