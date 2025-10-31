import {ProductColorController} from "@/lib/modules/product-config/controllers/productColor.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ProductColorController.getAllProductColors);
export const POST = catchAsync(checkRole(["admin"])(ProductColorController.createProductColor));