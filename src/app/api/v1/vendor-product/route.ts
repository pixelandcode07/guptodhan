import { VendorProductController } from "@/lib/modules/vendor-product/vendorProduct.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(VendorProductController.getAllVendorProducts);

export const POST = catchAsync(VendorProductController.createVendorProduct);