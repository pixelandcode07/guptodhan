import { VendorProductController } from "@/lib/modules/product/vendorProduct.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(VendorProductController.getAllVendorProducts);

export const POST = catchAsync(checkRole(['vendor'])(VendorProductController.createVendorProduct));