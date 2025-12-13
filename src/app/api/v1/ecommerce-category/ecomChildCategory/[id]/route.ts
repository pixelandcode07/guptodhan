import { ChildCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomChildCategory.controller";
import { VendorProductController } from "@/lib/modules/product/vendorProduct.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(VendorProductController.getVendorProductsByChildCategory);
export const PATCH = catchAsync(checkRole(["admin"])(ChildCategoryController.updateChildCategory));
export const DELETE = catchAsync(checkRole(["admin"])(ChildCategoryController.deleteChildCategory));