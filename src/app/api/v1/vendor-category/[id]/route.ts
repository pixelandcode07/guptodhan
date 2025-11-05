import { VendorCategoryController } from "@/lib/modules/vendor-category/vendorCategory.controller";
import { NextRequest } from "next/server";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(VendorCategoryController.getSingleVendorCategory);
export const PATCH = checkRole(["admin"])(
  catchAsync(VendorCategoryController.updateVendorCategory)
);
export const DELETE = checkRole(["admin"])(
  catchAsync(VendorCategoryController.deleteVendorCategory)
);