import { VendorCategoryController } from "@/lib/modules/vendor-category/vendorCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(VendorCategoryController.getAllVendorCategories);
export const POST = catchAsync(
  checkRole(["admin"])(VendorCategoryController.createVendorCategory)
);
export const PATCH = catchAsync(
  checkRole(["admin"])(VendorCategoryController.reorderVendorCategory)
);