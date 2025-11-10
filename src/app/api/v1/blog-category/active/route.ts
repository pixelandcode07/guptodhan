import { BlogCategoryController } from "@/lib/modules/blog-category/blogCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(BlogCategoryController.getAllActiveBlogCategories);