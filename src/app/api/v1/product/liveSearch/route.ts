import { VendorProductController } from "@/lib/modules/product/vendorProduct.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(VendorProductController.searchVendorProducts);