import {ProductColorController} from "@/lib/modules/product-config/controllers/productColor.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ProductColorController.updateProductColor);

export const DELETE = catchAsync(ProductColorController.deleteProductColor);