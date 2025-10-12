import { BlogCategoryController } from "@/lib/modules/blog-category/blogCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(BlogCategoryController.updateBlogCategory);
export const DELETE = catchAsync(BlogCategoryController.deleteBlogCategory);