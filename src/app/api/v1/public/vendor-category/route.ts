import { catchAsync } from "@/lib/middlewares/catchAsync";
import { VendorCategoryController } from "@/lib/modules/vendor-category/vendorCategory.controller";

export const GET = catchAsync(VendorCategoryController.getAllVendorCategories);