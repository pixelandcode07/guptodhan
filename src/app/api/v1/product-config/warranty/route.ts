import { ProductWarrantyController } from "@/lib/modules/product-config/controllers/warranty.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ProductWarrantyController.getAllProductWarranties);
export const POST = catchAsync(checkRole(["admin"])(ProductWarrantyController.createProductWarranty));