import { catchAsync } from "../../../../../lib/middlewares/catchAsync";
import { VendorProductController } from "../../../../../lib/modules/product/vendorProduct.controller";

// Ekhon "getAllVendorProductsNoPagination" function ta call koro
export const GET = catchAsync(VendorProductController.getAllVendorProductsNoPagination);