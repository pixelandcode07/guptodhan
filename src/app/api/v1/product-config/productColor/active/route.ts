import { ProductColorController } from "@/lib/modules/product-config/controllers/productColor.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ProductColorController.getAllActiveProductColors);