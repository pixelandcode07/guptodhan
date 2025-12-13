import { BlogCategoryController } from "@/lib/modules/blog-category/blogCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(BlogCategoryController.updateBlogCategory));
export const DELETE = catchAsync(checkRole(["admin"])(BlogCategoryController.deleteBlogCategory));