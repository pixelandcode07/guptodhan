import { ProductFlagController } from "@/lib/modules/product-config/controllers/productFlag.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ProductFlagController.getAllActiveProductFlags);