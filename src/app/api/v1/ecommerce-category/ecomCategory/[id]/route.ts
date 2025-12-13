import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";
import { VendorProductController } from "@/lib/modules/product/vendorProduct.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

// GET request for category products
export const GET = catchAsync(VendorProductController.getVendorProductsByCategory);

// PATCH and DELETE for admin
export const PATCH = catchAsync(checkRole(["admin"])(CategoryController.updateCategory));
export const DELETE = catchAsync(checkRole(["admin"])(CategoryController.deleteCategory));
