import { VendorProductController } from "@/lib/modules/vendor-product/vendorProduct.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(VendorProductController.updateVendorProduct);

export const DELETE = catchAsync(VendorProductController.deleteVendorProduct);